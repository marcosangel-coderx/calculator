import React from 'react';
import { Edit, Trash2, Briefcase } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

interface ProjectsListProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onRemoveProject: (id: number) => void;
}

export default function ProjectsList({ projects, onEditProject, onRemoveProject }: ProjectsListProps) {
  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  if (projects.length === 0) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200 text-center">
        <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No projects added yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <Briefcase className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-red-600">Projects List</h3>
      </div>
      
      <div className="space-y-4">
        {projects.map((project, index) => {
          const projectNumber = index + 1;
          const suffix = getOrdinalSuffix(projectNumber);
          
          return (
            <div
              key={project.id}
              className="bg-white p-4 rounded-lg border border-red-200 flex items-center justify-between transition-all duration-300 hover:border-red-300 hover:shadow-md hover:translate-x-2 group"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
                    {projectNumber}{suffix} Project
                  </span>
                  <span className="font-semibold text-gray-800">{project.name}</span>
                </div>
                <p className="text-gray-600">
                  {new Date(project.startDate + 'T00:00:00').toLocaleDateString()} - {new Date(project.endDate + 'T00:00:00').toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => onEditProject(project)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 hover:text-gray-700 transition-all duration-200 hover:scale-105"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onRemoveProject(project.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:text-red-700 transition-all duration-200 hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}