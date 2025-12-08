import React from 'react';
import { Reimbursement } from './ReimbursementForm';
import { DiscontinuedProject } from './DiscontinuedProjectForm';

interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

interface SummaryData {
  project: Project;
  projectNumber: number;
  monthlyRate: number;
  workingDays: number;
  workingHours: number;
  regularPay: number;
  otHours: number;
  otPay: number;
  total: number;
}

interface SummaryTableProps {
  summaryData: SummaryData[];
  totalDays: number;
  totalHours: number;
  totalRegularPay: number;
  totalOTHours: number;
  totalOTPay: number;
  grandTotal: number;
  reimbursements: Reimbursement[];
  discontinuedProjects: DiscontinuedProject[];
}

export default function SummaryTable({ 
  summaryData, 
  totalDays, 
  totalHours, 
  totalRegularPay, 
  totalOTHours, 
  totalOTPay, 
  grandTotal,
  reimbursements,
  discontinuedProjects 
}: SummaryTableProps) {
  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const totalReimbursements = reimbursements.reduce((sum, r) => sum + r.amount, 0);
  const totalDiscontinuedPayment = discontinuedProjects.reduce((sum, p) => sum + p.payment, 0);
  const finalTotal = grandTotal + totalReimbursements + totalDiscontinuedPayment;

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold text-red-600 mb-6">Summary by Project Category</h3>
      
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-red-200">
        <table className="w-full">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="px-4 py-3 text-left font-semibold">Project</th>
              <th className="px-4 py-3 text-left font-semibold">Project Name</th>
              <th className="px-4 py-3 text-left font-semibold">Monthly Rate</th>
              <th className="px-4 py-3 text-left font-semibold">Working Days</th>
              <th className="px-4 py-3 text-left font-semibold">Working Hours</th>
              <th className="px-4 py-3 text-left font-semibold">Regular Pay</th>
              <th className="px-4 py-3 text-left font-semibold">OT Hours</th>
              <th className="px-4 py-3 text-left font-semibold">OT Pay</th>
              <th className="px-4 py-3 text-left font-semibold">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.length > 0 ? (
              summaryData.map((data, index) => {
                const suffix = getOrdinalSuffix(data.projectNumber);
                return (
                  <tr 
                    key={data.project.id} 
                    className={`transition-all duration-300 hover:bg-red-50 ${
                      index % 2 === 0 ? 'bg-red-25' : 'bg-white'
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold text-red-600">
                      {data.projectNumber}{suffix} Project
                    </td>
                    <td className="px-4 py-3">{data.project.name}</td>
                    <td className="px-4 py-3">₱{data.monthlyRate.toLocaleString()}</td>
                    <td className="px-4 py-3">{data.workingDays}</td>
                    <td className="px-4 py-3">{data.workingHours}</td>
                    <td className="px-4 py-3">₱{data.regularPay.toFixed(2)}</td>
                    <td className="px-4 py-3">{data.otHours}</td>
                    <td className="px-4 py-3">₱{data.otPay.toFixed(2)}</td>
                    <td className="px-4 py-3 font-bold text-red-600">₱{data.total.toFixed(2)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500 italic">
                  No active projects - All projects have been discontinued
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-red-500 text-white font-bold">
              <td colSpan={3} className="px-4 py-3">Salary Subtotal</td>
              <td className="px-4 py-3">{totalDays}</td>
              <td className="px-4 py-3">{totalHours}</td>
              <td className="px-4 py-3">₱{totalRegularPay.toFixed(2)}</td>
              <td className="px-4 py-3">{totalOTHours}</td>
              <td className="px-4 py-3">₱{totalOTPay.toFixed(2)}</td>
              <td className="px-4 py-3 text-xl">₱{grandTotal.toFixed(2)}</td>
            </tr>
            {totalReimbursements > 0 && (
              <tr className="bg-blue-500 text-white font-bold">
                <td colSpan={8} className="px-4 py-3">Total Reimbursements</td>
                <td className="px-4 py-3 text-xl">₱{totalReimbursements.toFixed(2)}</td>
              </tr>
            )}
            {totalDiscontinuedPayment > 0 && (
              <tr className="bg-orange-500 text-white font-bold">
                <td colSpan={8} className="px-4 py-3">Total Discontinued Projects Payment</td>
                <td className="px-4 py-3 text-xl">₱{totalDiscontinuedPayment.toFixed(2)}</td>
              </tr>
            )}
            <tr className="bg-green-600 text-white font-bold text-lg">
              <td colSpan={8} className="px-4 py-3">GRAND TOTAL (Salary + Reimbursements + Discontinued)</td>
              <td className="px-4 py-3 text-2xl">₱{finalTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}