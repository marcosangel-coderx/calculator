import { Project } from '../services/projectService';
import { Trash2, StopCircle, PlayCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ProjectsListDashboardProps {
    projects: Project[];
    onDiscontinue: (projectId: string, discontinuedDate: string) => void;
    onReactivate: (projectId: string) => void;
    onDelete: (projectId: string) => void;
}

export default function ProjectsListDashboard({
    projects,
    onDiscontinue,
    onReactivate,
    onDelete,
}: ProjectsListDashboardProps) {
    if (projects.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No projects yet. Add your first project above!</p>
            </div>
        );
    }

    const handleDiscontinue = (projectId: string) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        if (confirm('Mark this project as discontinued?')) {
            onDiscontinue(projectId, today);
        }
    };

    const handleDelete = (projectId: string) => {
        if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            onDelete(projectId);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Projects</h2>

            <div className="space-y-3">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className={`p-4 rounded-lg border-2 ${project.status === 'active'
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-gray-500">
                                        P{index + 1}
                                    </span>
                                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${project.employment_type === 'part-time'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-blue-100 text-blue-700'
                                            }`}
                                    >
                                        {project.employment_type === 'part-time' ? 'Part-Time' : 'Full-Time'}
                                    </span>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-200 text-gray-700'
                                            }`}
                                    >
                                        {project.status === 'active' ? 'Active' : 'Discontinued'}
                                    </span>
                                </div>
                                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                    <span>
                                        Started: {format(parseISO(project.start_date), 'MMM dd, yyyy')}
                                    </span>
                                    {project.discontinued_date && (
                                        <span>
                                            Ended: {format(parseISO(project.discontinued_date), 'MMM dd, yyyy')}
                                        </span>
                                    )}
                                    {project.employment_type === 'part-time' && (
                                        <span className="text-green-600 font-medium">
                                            Schedule: {project.part_time_days_per_week || 5} days/week × {project.part_time_hours_per_day || 4} hrs/day
                                        </span>
                                    )}
                                    <span className="text-blue-600 font-medium">
                                        Rate: ₱{project.employment_type === 'part-time' ? '10,000' : (index === 0 ? '20,000' : '10,000')}/month
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {project.status === 'active' ? (
                                    <button
                                        onClick={() => handleDiscontinue(project.id)}
                                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                        title="Mark as discontinued"
                                    >
                                        <StopCircle className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onReactivate(project.id)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Reactivate project"
                                    >
                                        <PlayCircle className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete project"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
