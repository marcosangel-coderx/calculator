import React from 'react';
import { Clock } from 'lucide-react';

interface OvertimeFormProps {
  overtimeHours: number;
  onOvertimeChange: (hours: number) => void;
  hourlyRate: number;
}

export default function OvertimeForm({ overtimeHours, onOvertimeChange, hourlyRate }: OvertimeFormProps) {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 mb-8 transition-all duration-300 hover:shadow-lg hover:border-yellow-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Clock className="w-6 h-6 text-yellow-600" />
        </div>
        <h3 className="text-xl font-semibold text-yellow-700">Overtime Hours (1st Project Only)</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-yellow-700 mb-2">
            Overtime Hours
          </label>
          <input
            type="number"
            value={overtimeHours}
            onChange={(e) => onOvertimeChange(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.5"
            placeholder="0"
            className="w-full p-3 border-2 border-yellow-200 rounded-lg focus:border-yellow-500 focus:bg-yellow-50 transition-all duration-300 hover:border-yellow-300"
          />
        </div>
        
        <div className="text-gray-600">
          <p className="text-sm">Rate: ₱{hourlyRate.toFixed(2)}/hour (1st Project Rate)</p>
          <p className="text-sm font-semibold text-yellow-700">
            Total OT Pay: ₱{(overtimeHours * hourlyRate).toFixed(2)}
          </p>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm italic mt-4 p-3 bg-yellow-100 rounded-lg">
        Note: Overtime only applies to the first project at the ₱20,000/month rate
      </p>
    </div>
  );
}