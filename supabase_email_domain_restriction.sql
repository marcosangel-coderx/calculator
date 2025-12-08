-- Email Domain Restriction Migration
-- This ensures only @rooche.digital email addresses can sign up
-- Run this in your Supabase SQL Editor

-- Create a function to validate email domain
CREATE OR REPLACE FUNCTION validate_email_domain()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the email ends with @rooche.digital
  IF NEW.email NOT LIKE '%@rooche.digital' THEN
    RAISE EXCEPTION 'Only @rooche.digital email addresses are allowed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on auth.users table to validate email on insert
DROP TRIGGER IF EXISTS check_email_domain ON auth.users;
CREATE TRIGGER check_email_domain
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION validate_email_domain();

-- Also add the same validation to profiles table
DROP TRIGGER IF EXISTS check_profile_email_domain ON profiles;
CREATE TRIGGER check_profile_email_domain
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_email_domain();
