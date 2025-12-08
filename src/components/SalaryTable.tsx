import React from 'react';

interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

interface SalaryData {
  project: Project;
  projectNumber: number;
  totalDays: number;
  workingDays: number;
  workingHours: number;
  hourlyRate: number;
  regularSalary: number;
  otHours: number;
  otPay: number;
  totalSalary: number;
}

interface SalaryTableProps {
  salaryData: SalaryData[];
  totalRegularPay: number;
  totalOTPay: number;
  totalSalary: number;
}

export default function SalaryTable({ 
  salaryData, 
  totalRegularPay, 
  totalOTPay, 
  totalSalary 
}: SalaryTableProps) {
  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-red-600 mb-6">Salary Breakdown</h3>
      
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-red-200">
        <table className="w-full">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="px-4 py-3 text-left font-semibold">Project Name</th>
              <th className="px-4 py-3 text-left font-semibold">Start Date</th>
              <th className="px-4 py-3 text-left font-semibold">End Date</th>
              <th className="px-4 py-3 text-left font-semibold">Total Days</th>
              <th className="px-4 py-3 text-left font-semibold">Working Days</th>
              <th className="px-4 py-3 text-left font-semibold">Working Hours</th>
              <th className="px-4 py-3 text-left font-semibold">Hourly Rate</th>
              <th className="px-4 py-3 text-left font-semibold">Regular Pay</th>
              <th className="px-4 py-3 text-left font-semibold">OT Hours</th>
              <th className="px-4 py-3 text-left font-semibold">OT Pay</th>
              <th className="px-4 py-3 text-left font-semibold">Total Salary</th>
            </tr>
          </thead>
          <tbody>
            {salaryData.map((data, index) => {
              const suffix = getOrdinalSuffix(data.projectNumber);
              return (
                <tr 
                  key={data.project.id} 
                  className={`transition-all duration-300 hover:bg-red-50 hover:scale-[1.01] ${
                    index % 2 === 0 ? 'bg-red-25' : 'bg-white'
                  }`}
                >
                  <td className="px-4 py-3">
                    {data.project.name}
                    <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                      ({data.projectNumber}{suffix} Project)
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(data.project.startDate + 'T00:00:00').toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(data.project.endDate + 'T00:00:00').toLocaleDateString()}</td>
                  <td className="px-4 py-3">{data.totalDays} days</td>
                  <td className="px-4 py-3">{data.workingDays} days</td>
                  <td className="px-4 py-3">{data.workingHours} hours</td>
                  <td className="px-4 py-3">₱{data.hourlyRate.toFixed(2)}/hour</td>
                  <td className="px-4 py-3">₱{data.regularSalary.toFixed(2)}</td>
                  <td className="px-4 py-3">{data.otHours} hours</td>
                  <td className="px-4 py-3">₱{data.otPay.toFixed(2)}</td>
                  <td className="px-4 py-3 font-bold text-red-600 bg-red-100 animate-pulse">
                    ₱{data.totalSalary.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-red-500 text-white font-bold">
              <td colSpan={7} className="px-4 py-3">Total Regular Pay</td>
              <td className="px-4 py-3">₱{totalRegularPay.toFixed(2)}</td>
              <td className="px-4 py-3">Total OT</td>
              <td className="px-4 py-3">₱{totalOTPay.toFixed(2)}</td>
              <td className="px-4 py-3 text-xl">₱{totalSalary.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}