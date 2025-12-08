-- Migration: Add employment_type and part-time schedule columns to projects table
-- Description: Adds support for part-time and full-time employment types with configurable schedules
-- Date: 2025-12-08

-- Add employment_type column with default value 'full-time'
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS employment_type VARCHAR(20) NOT NULL DEFAULT 'full-time'
CHECK (employment_type IN ('full-time', 'part-time'));

-- Add part-time schedule columns
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS part_time_days_per_week INTEGER DEFAULT NULL
CHECK (part_time_days_per_week IS NULL OR (part_time_days_per_week >= 1 AND part_time_days_per_week <= 7));

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS part_time_hours_per_day DECIMAL(4,2) DEFAULT NULL
CHECK (part_time_hours_per_day IS NULL OR (part_time_hours_per_day > 0 AND part_time_hours_per_day <= 24));

-- Add comments for documentation
COMMENT ON COLUMN projects.employment_type IS 'Employment type: full-time or part-time. Full-time rates: ₱20k/₱10k. Part-time rate: ₱10k';
COMMENT ON COLUMN projects.part_time_days_per_week IS 'For part-time projects: number of working days per week (1-7)';
COMMENT ON COLUMN projects.part_time_hours_per_day IS 'For part-time projects: number of working hours per day';

-- Update existing projects to be full-time (they already default to this, but being explicit)
UPDATE projects 
SET employment_type = 'full-time' 
WHERE employment_type IS NULL;
