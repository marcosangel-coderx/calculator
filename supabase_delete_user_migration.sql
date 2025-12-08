-- This migration adds a function to delete a user and all their associated data
-- Run this in your Supabase SQL Editor

-- Create a function to delete user and all associated data
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current user's ID
  current_user_id := auth.uid();
  
  -- Check if user_id is valid
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'No authenticated user found';
  END IF;
  
  -- Delete in the correct order to avoid foreign key constraint violations
  
  -- 1. Delete invoice adjustments (if they reference invoice_periods)
  DELETE FROM invoice_adjustments 
  WHERE invoice_period_id IN (
    SELECT id FROM invoice_periods WHERE user_id = current_user_id
  );
  
  -- 2. Delete invoice items (if they reference projects or invoice_periods)
  DELETE FROM invoice_items 
  WHERE invoice_period_id IN (
    SELECT id FROM invoice_periods WHERE user_id = current_user_id
  );
  
  -- 3. Delete invoice periods
  DELETE FROM invoice_periods WHERE user_id = current_user_id;
  
  -- 4. Delete user's projects
  DELETE FROM projects WHERE projects.user_id = current_user_id;
  
  -- 5. Delete user's profile (this is what was causing the foreign key error)
  DELETE FROM profiles WHERE id = current_user_id;
  
  -- 6. Finally, delete the user from auth.users
  DELETE FROM auth.users WHERE id = current_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;
