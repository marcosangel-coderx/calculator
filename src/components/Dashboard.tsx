import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import ProjectFormDashboard from './ProjectFormDashboard';
import ProjectsListDashboard from './ProjectsListDashboard';
import InvoiceGenerator from './InvoiceGenerator';
import InvoiceHistory from './InvoiceHistory';
import { projectService, Project } from '../services/projectService';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('generator');

    useEffect(() => {
        loadProjects();

        // Subscribe to real-time updates
        const unsubscribe = projectService.subscribeToProjects((updatedProjects) => {
            setProjects(updatedProjects);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const loadProjects = async () => {
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProject = async (
        name: string,
        startDate: string,
        employmentType: 'full-time' | 'part-time',
        partTimeDaysPerWeek?: number,
        partTimeHoursPerDay?: number
    ) => {
        try {
            await projectService.createProject(name, startDate, employmentType, partTimeDaysPerWeek, partTimeHoursPerDay);
            await loadProjects();
        } catch (error) {
            console.error('Failed to add project:', error);
            alert('Failed to add project. Please try again.');
        }
    };

    const handleDiscontinue = async (projectId: string, discontinuedDate: string) => {
        try {
            await projectService.discontinueProject(projectId, discontinuedDate);
            await loadProjects();
        } catch (error) {
            console.error('Failed to discontinue project:', error);
            alert('Failed to discontinue project. Please try again.');
        }
    };

    const handleReactivate = async (projectId: string) => {
        try {
            await projectService.reactivateProject(projectId);
            await loadProjects();
        } catch (error) {
            console.error('Failed to reactivate project:', error);
            alert('Failed to reactivate project. Please try again.');
        }
    };

    const handleDelete = async (projectId: string) => {
        try {
            await projectService.deleteProject(projectId);
            await loadProjects();
        } catch (error) {
            console.error('Failed to delete project:', error);
            alert('Failed to delete project. Please try again.');
        }
    };

    const handleInvoiceGenerated = () => {
        setActiveTab('history');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100">
                <Navigation />
                <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100">
            <Navigation />

            <div className="max-w-7xl mx-auto p-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Management Dashboard</h1>
                    <p className="text-gray-600">
                        Manage your projects and generate invoices for bi-monthly periods (1-15 and 16-end of month)
                    </p>
                </div>

                {/* Projects Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <ProjectFormDashboard onAddProject={handleAddProject} />
                    <ProjectsListDashboard
                        projects={projects}
                        onDiscontinue={handleDiscontinue}
                        onReactivate={handleReactivate}
                        onDelete={handleDelete}
                    />
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <div className="flex gap-4 px-6 pt-4">
                            <button
                                onClick={() => setActiveTab('generator')}
                                className={`px-4 py-2 font-semibold transition-colors border-b-2 ${activeTab === 'generator'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Generate Invoice
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`px-4 py-2 font-semibold transition-colors border-b-2 ${activeTab === 'history'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Invoice History
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {activeTab === 'generator' && (
                            <InvoiceGenerator
                                projects={projects}
                                onInvoiceGenerated={handleInvoiceGenerated}
                            />
                        )}
                        {activeTab === 'history' && <InvoiceHistory />}
                    </div>
                </div>
            </div>
        </div>
    );
}
