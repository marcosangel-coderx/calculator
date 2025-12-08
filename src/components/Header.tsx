import React from 'react';
import { Calendar, Settings } from 'lucide-react';

interface HeaderProps {
  currentDate: string;
  monthInfo: string;
  workingDays: number;
  customDate: string;
  onCustomDateChange: (date: string) => void;
  useCustomDate: boolean;
  onToggleCustomDate: (use: boolean) => void;
}

export default function Header({ 
  currentDate, 
  monthInfo, 
  workingDays, 
  customDate, 
  onCustomDateChange, 
  useCustomDate, 
  onToggleCustomDate 
}: HeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4 transition-all duration-300 hover:text-shadow-lg">
        Rooche Digital Representative Salary Calculator
      </h1>
      
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="flex items-center justify-center gap-2 text-gray-600 text-lg">
          <Calendar className="w-5 h-5" />
          <span>Current Date: {currentDate}</span>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                Use Custom Date for Calculations:
              </label>
              <input
                type="checkbox"
                checked={useCustomDate}
                onChange={(e) => onToggleCustomDate(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
            </div>
            
            {useCustomDate && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Custom Date:
                </label>
                <input
                  type="month"
                  value={customDate}
                  onChange={(e) => onCustomDateChange(e.target.value)}
                  className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:bg-red-50 transition-all duration-300 hover:border-red-300"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200 transition-all duration-300 hover:shadow-lg hover:border-red-300 hover:from-red-100 hover:to-pink-100">
        <h3 className="text-xl font-semibold text-red-600 mb-3">
          {useCustomDate ? 'Custom Month' : 'Current Month'} Rate Calculation
        </h3>
        <p className="text-gray-700 text-lg">
          <strong>{monthInfo}</strong> has <strong className="text-red-600">{workingDays} working days</strong> (excluding weekends)
        </p>
        {useCustomDate && (
          <p className="text-sm text-gray-600 mt-2 italic">
            Using custom date for rate calculations
          </p>
        )}
      </div>
    </div>
  );
}