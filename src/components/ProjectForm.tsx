import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

interface ProjectFormProps {
  onAddProject: (project: Omit<Project, 'id'>) => void;
}

export default function ProjectForm({ onAddProject }: ProjectFormProps) {
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName || !startDate || !endDate) {
      alert('Please fill all fields');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('End date must be after start date');
      return;
    }

    onAddProject({
      name: projectName,
      startDate,
      endDate
    });

    // Reset form
    setProjectName('');
    setStartDate('');
    setEndDate('');
  };

  // Set default dates
  React.useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const lastDay = String(new Date(year, now.getMonth() + 1, 0).getDate()).padStart(2, '0');
    
    if (!startDate) setStartDate(`${year}-${month}-${day}`);
    if (!endDate) setEndDate(`${year}-${month}-${lastDay}`);
  }, []);

  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200 mb-8 transition-all duration-300 hover:shadow-lg hover:border-red-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <Plus className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-red-600">Add New Project</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-red-600 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full p-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:bg-red-50 transition-all duration-300 hover:border-red-300 hover:bg-red-25"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-red-600 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:bg-red-50 transition-all duration-300 hover:border-red-300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-red-600 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:bg-red-50 transition-all duration-300 hover:border-red-300"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-red-700 hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Add Project
        </button>
      </form>
    </div>
  );
}