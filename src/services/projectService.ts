import { supabase } from '../lib/supabase';

export interface Project {
    id: string;
    user_id: string;
    name: string;
    start_date: string;
    employment_type: 'full-time' | 'part-time';
    part_time_days_per_week: number | null;
    part_time_hours_per_day: number | null;
    status: 'active' | 'discontinued';
    discontinued_date: string | null;
    created_at: string;
    updated_at: string;
}

export const projectService = {
    // Get all projects for current user
    async getProjects(): Promise<Project[]> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Get active projects only
    async getActiveProjects(): Promise<Project[]> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    // Create new project
    async createProject(
        name: string,
        startDate: string,
        employmentType: 'full-time' | 'part-time' = 'full-time',
        partTimeDaysPerWeek?: number,
        partTimeHoursPerDay?: number
    ): Promise<Project> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('projects')
            .insert({
                user_id: user.id,
                name,
                start_date: startDate,
                employment_type: employmentType,
                part_time_days_per_week: employmentType === 'part-time' ? partTimeDaysPerWeek : null,
                part_time_hours_per_day: employmentType === 'part-time' ? partTimeHoursPerDay : null,
                status: 'active',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Mark project as discontinued
    async discontinueProject(projectId: string, discontinuedDate: string): Promise<void> {
        const { error } = await supabase
            .from('projects')
            .update({
                status: 'discontinued',
                discontinued_date: discontinuedDate,
            })
            .eq('id', projectId);

        if (error) throw error;
    },

    // Reactivate project
    async reactivateProject(projectId: string): Promise<void> {
        const { error } = await supabase
            .from('projects')
            .update({
                status: 'active',
                discontinued_date: null,
            })
            .eq('id', projectId);

        if (error) throw error;
    },

    // Delete project
    async deleteProject(projectId: string): Promise<void> {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId);

        if (error) throw error;
    },

    // Subscribe to real-time changes
    subscribeToProjects(callback: (projects: Project[]) => void) {
        const channel = supabase
            .channel('projects_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'projects',
                },
                async () => {
                    const projects = await this.getProjects();
                    callback(projects);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    },
};
