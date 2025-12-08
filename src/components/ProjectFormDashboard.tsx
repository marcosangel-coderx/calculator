import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface ProjectFormDashboardProps {
    onAddProject: (
        name: string,
        startDate: string,
        employmentType: 'full-time' | 'part-time',
        partTimeDaysPerWeek?: number,
        partTimeHoursPerDay?: number
    ) => void;
}

export default function ProjectFormDashboard({ onAddProject }: ProjectFormDashboardProps) {
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [employmentType, setEmploymentType] = useState<'full-time' | 'part-time'>('full-time');
    const [partTimeDaysPerWeek, setPartTimeDaysPerWeek] = useState<number>(5);
    const [partTimeHoursPerDay, setPartTimeHoursPerDay] = useState<number>(4);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (projectName && startDate) {
            onAddProject(
                projectName,
                startDate,
                employmentType,
                employmentType === 'part-time' ? partTimeDaysPerWeek : undefined,
                employmentType === 'part-time' ? partTimeHoursPerDay : undefined
            );
            setProjectName('');
            setStartDate('');
            setEmploymentType('full-time');
            setPartTimeDaysPerWeek(5);
            setPartTimeHoursPerDay(4);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Add New Project
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                            Project Name
                        </label>
                        <input
                            id="projectName"
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Project 1"
                        />
                    </div>

                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Type
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="employmentType"
                                value="full-time"
                                checked={employmentType === 'full-time'}
                                onChange={(e) => setEmploymentType(e.target.value as 'full-time' | 'part-time')}
                                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Full-Time</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="employmentType"
                                value="part-time"
                                checked={employmentType === 'part-time'}
                                onChange={(e) => setEmploymentType(e.target.value as 'full-time' | 'part-time')}
                                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Part-Time</span>
                        </label>
                    </div>
                </div>

                {/* Part-Time Schedule Fields */}
                {employmentType === 'part-time' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div>
                            <label htmlFor="daysPerWeek" className="block text-sm font-medium text-gray-700 mb-2">
                                Days per Week
                            </label>
                            <input
                                id="daysPerWeek"
                                type="number"
                                min="1"
                                max="7"
                                value={partTimeDaysPerWeek}
                                onChange={(e) => setPartTimeDaysPerWeek(parseInt(e.target.value) || 1)}
                                required={employmentType === 'part-time'}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label htmlFor="hoursPerDay" className="block text-sm font-medium text-gray-700 mb-2">
                                Hours per Day
                            </label>
                            <input
                                id="hoursPerDay"
                                type="number"
                                min="0.5"
                                max="24"
                                step="0.5"
                                value={partTimeHoursPerDay}
                                onChange={(e) => setPartTimeHoursPerDay(parseFloat(e.target.value) || 0.5)}
                                required={employmentType === 'part-time'}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-2 text-sm text-gray-600">
                            <p>Part-time projects use a base rate of ₱10,000/month</p>
                            <p>Salary will be calculated based on your schedule: {partTimeDaysPerWeek} days/week × {partTimeHoursPerDay} hours/day</p>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                    Add Project
                </button>
            </form>
        </div>
    );
}
