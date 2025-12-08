import React from 'react';
import { FileText, Save, Download } from 'lucide-react';

interface ActionButtonsProps {
  onShowBreakdown: () => void;
  onSaveData: () => void;
  onLoadData: () => void;
}

export default function ActionButtons({ onShowBreakdown, onSaveData, onLoadData }: ActionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-8">
      <button
        onClick={onShowBreakdown}
        className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 flex items-center gap-2"
      >
        <FileText className="w-5 h-5" />
        View Printable Report
      </button>
      

      
      <button
        onClick={onSaveData}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 flex items-center gap-2"
      >
        <Save className="w-5 h-5" />
        Save Data
      </button>
      
      <button
        onClick={onLoadData}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-purple-700 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 flex items-center gap-2"
      >
        <Download className="w-5 h-5" />
        Load Data
      </button>
    </div>
  );
}