import React, { useState } from 'react';
import { AlertTriangle, Calculator } from 'lucide-react';

interface DiscontinuedProject {
  id: number;
  name: string;
  days: number;
  payment: number;
}

interface DiscontinuedProjectFormProps {
  discontinuedProjects: DiscontinuedProject[];
  onAddDiscontinuedProject: (project: Omit<DiscontinuedProject, 'id' | 'payment'>) => void;
  onRemoveDiscontinuedProject: (id: number) => void;
}

export default function DiscontinuedProjectForm({ 
  discontinuedProjects, 
  onAddDiscontinuedProject, 
  onRemoveDiscontinuedProject 
}: DiscontinuedProjectFormProps) {
  const [hasDiscontinuedProject, setHasDiscontinuedProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [days, setDays] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName || !days) {
      alert('Please fill all fields');
      return;
    }

    const daysNumber = parseInt(days);
    if (daysNumber <= 0) {
      alert('Days must be a positive number');
      return;
    }

    onAddDiscontinuedProject({
      name: projectName,
      days: daysNumber
    });

    // Reset form
    setProjectName('');
    setDays('');
  };

  const handleRadioChange = (value: string) => {
    setHasDiscontinuedProject(value === 'yes');
    if (value === 'none') {
      // Clear all discontinued projects when user selects "none"
      discontinuedProjects.forEach(project => {
        onRemoveDiscontinuedProject(project.id);
      });
    }
  };

  const totalDiscontinuedPayment = discontinuedProjects.reduce((sum, project) => sum + project.payment, 0);

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-200 mb-8 transition-all duration-300 hover:shadow-lg hover:border-orange-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-orange-600">Discontinued Projects</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-orange-600 mb-3">
            Is there a project discontinued by client?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="discontinuedProject"
                value="yes"
                checked={hasDiscontinuedProject}
                onChange={(e) => handleRadioChange(e.target.value)}
                className="mr-2 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-orange-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="discontinuedProject"
                value="none"
                checked={!hasDiscontinuedProject}
                onChange={(e) => handleRadioChange(e.target.value)}
                className="mr-2 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-orange-700">None</span>
            </label>
          </div>
        </div>

        {hasDiscontinuedProject && (
          <form onSubmit={handleSubmit} className="space-y-4 border-t border-orange-200 pt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-600 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter discontinued project name"
                  className="w-full p-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:bg-orange-50 transition-all duration-300 hover:border-orange-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-orange-600 mb-2">
                  <Calculator className="w-4 h-4 inline mr-1" />
                  Number of Work Days
                </label>
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="Enter number of work days"
                  min="1"
                  className="w-full p-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:bg-orange-50 transition-all duration-300 hover:border-orange-300"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-orange-700 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
            >
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Add Discontinued Project
            </button>
          </form>
        )}

        {discontinuedProjects.length > 0 && (
          <div className="border-t border-orange-200 pt-4">
            <h4 className="text-lg font-semibold text-orange-600 mb-3">Discontinued Projects List</h4>
            <div className="space-y-2">
              {discontinuedProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between bg-orange-100 p-3 rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium text-orange-800">{project.name}</span>
                    <span className="text-orange-600 ml-2">({project.days} days)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-orange-800">
                      ₱{project.payment.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveDiscontinuedProject(project.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {totalDiscontinuedPayment > 0 && (
                <div className="bg-orange-200 p-3 rounded-lg border-2 border-orange-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-orange-800">Total Discontinued Payment:</span>
                    <span className="font-bold text-orange-900 text-lg">
                      ₱{totalDiscontinuedPayment.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export type { DiscontinuedProject };