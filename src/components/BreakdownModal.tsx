import React from 'react';
import { X, Printer, Copy } from 'lucide-react';
import { Reimbursement } from './ReimbursementForm';
import { DiscontinuedProject } from './DiscontinuedProjectForm';

interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

interface BreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  firstProjectRates: { daily: number; hourly: number };
  secondProjectRates: { daily: number; hourly: number };
  overtimeHours: number;
  overtimePay: number;
  workingDays: number;
  monthInfo: string;
  totalRegularPay: number;
  totalOTPay: number;
  grandTotal: number;
  reimbursements: Reimbursement[];
  discontinuedProjects: DiscontinuedProject[];
}

export default function BreakdownModal({
  isOpen,
  onClose,
  projects,
  firstProjectRates,
  secondProjectRates,
  overtimeHours,
  overtimePay,
  workingDays,
  monthInfo,
  totalRegularPay,
  totalOTPay,
  grandTotal,
  reimbursements,
  discontinuedProjects
}: BreakdownModalProps) {
  if (!isOpen) return null;

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const calculateWorkingDays = (startDate: string, endDate: string) => {
    let count = 0;
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    let currentDate = new Date(start);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
  };

  const totalReimbursements = reimbursements.reduce((sum, r) => sum + r.amount, 0);
  const totalDiscontinuedPayment = discontinuedProjects.reduce((sum, p) => sum + p.payment, 0);
  const finalTotal = grandTotal + totalReimbursements + totalDiscontinuedPayment;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let textContent = 'ROOCHE DIGITAL REPRESENTATIVE SALARY BREAKDOWN\n';
    textContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    textContent += 'RATE INFORMATION\n';
    textContent += `${monthInfo} has ${workingDays} working days\n`;
    textContent += `First Project: ₱20,000/month | ₱${firstProjectRates.daily.toFixed(2)}/day | ₱${firstProjectRates.hourly.toFixed(2)}/hour\n`;
    textContent += `2nd & Succeeding: ₱10,000/month | ₱${secondProjectRates.daily.toFixed(2)}/day | ₱${secondProjectRates.hourly.toFixed(2)}/hour\n\n`;
    
    if (overtimeHours > 0) {
      textContent += 'OVERTIME INFORMATION\n';
      textContent += `1st Project Overtime: ${overtimeHours} hours × ₱${firstProjectRates.hourly.toFixed(2)}/hour = ₱${overtimePay.toFixed(2)}\n\n`;
    }
    
    if (projects.length > 0) {
      textContent += 'PROJECT DETAILS\n';
      projects.forEach((project, index) => {
        const workingDays = calculateWorkingDays(project.startDate, project.endDate);
        const workingHours = workingDays * 8;
        const isFirstProject = index === 0;
        const hourlyRate = isFirstProject ? firstProjectRates.hourly : secondProjectRates.hourly;
        const regularSalary = hourlyRate * workingHours;
        const projectNumber = index + 1;
        const suffix = getOrdinalSuffix(projectNumber);
        
        textContent += `\n${projectNumber}${suffix} Project: ${project.name}\n`;
        textContent += `Working Days: ${workingDays} days (${workingHours} hours)\n`;
        textContent += `Regular Pay: ₱${regularSalary.toFixed(2)}\n`;
      });
    }
    
    if (reimbursements.length > 0) {
      textContent += '\nREIMBURSEMENTS\n';
      reimbursements.forEach(r => {
        textContent += `${r.description} (${r.category}): ₱${r.amount.toFixed(2)} - ${new Date(r.date + 'T00:00:00').toLocaleDateString()}\n`;
      });
      textContent += `Total Reimbursements: ₱${totalReimbursements.toFixed(2)}\n\n`;
    }
    
    if (discontinuedProjects.length > 0) {
        textContent += '\nDISCONTINUED PROJECTS\n';
        discontinuedProjects.forEach(p => {
          textContent += `${p.name}: ${p.days} days - ₱${p.payment.toFixed(2)}\n`;
        });
        textContent += `Total Discontinued Payment: ₱${totalDiscontinuedPayment.toFixed(2)}\n\n`;
      }
    
    textContent += `Total Salary: ₱${grandTotal.toFixed(2)}\n`;
    textContent += `Total Reimbursements: ₱${totalReimbursements.toFixed(2)}\n`;
    textContent += `Total Discontinued Payment: ₱${totalDiscontinuedPayment.toFixed(2)}\n`;
    textContent += `GRAND TOTAL: ₱${finalTotal.toFixed(2)}\n`;
    
    navigator.clipboard.writeText(textContent).then(() => {
      alert('Report copied to clipboard!');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 print-content">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between no-print">
          <h2 className="text-2xl font-bold text-red-600">Salary Report</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopyText}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-red-600 mb-2">Rooche Digital Representative</h1>
            <h2 className="text-2xl font-semibold text-red-500 mb-4">Salary Breakdown Report</h2>
            <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg mb-6 border border-red-200">
            <h3 className="text-xl font-semibold text-red-600 mb-4">Monthly Rate Information</h3>
            <p className="text-lg mb-4">
              <strong>{monthInfo}</strong> has <strong className="text-red-600">{workingDays} working days</strong>
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-red-600 mb-2">1st Project Rate</h4>
                <p>₱20,000/month | ₱{firstProjectRates.daily.toFixed(2)}/day | ₱{firstProjectRates.hourly.toFixed(2)}/hour</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-red-600 mb-2">2nd Project onwards</h4>
                <p>₱10,000/month | ₱{secondProjectRates.daily.toFixed(2)}/day | ₱{secondProjectRates.hourly.toFixed(2)}/hour</p>
              </div>
            </div>
          </div>

          {overtimeHours > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg mb-6 border border-yellow-200">
              <h3 className="text-xl font-semibold text-yellow-700 mb-4">Overtime Information</h3>
              <p><strong>1st Project Overtime:</strong> {overtimeHours} hours × ₱{firstProjectRates.hourly.toFixed(2)}/hour = ₱{overtimePay.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-2"><em>Note: Overtime only applies to 1st project at the ₱20,000/month rate</em></p>
            </div>
          )}

          {projects.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-red-600 mb-4">Project Details</h3>
              {projects.map((project, index) => {
                const workingDays = calculateWorkingDays(project.startDate, project.endDate);
                const workingHours = workingDays * 8;
                const isFirstProject = index === 0;
                const hourlyRate = isFirstProject ? firstProjectRates.hourly : secondProjectRates.hourly;
                const regularSalary = hourlyRate * workingHours;
                const projectNumber = index + 1;
                const suffix = getOrdinalSuffix(projectNumber);
                
                let otHours = 0;
                let otPay = 0;
                if (isFirstProject && overtimeHours > 0) {
                  otHours = overtimeHours;
                  otPay = overtimePay;
                }
                
                const totalSalary = regularSalary + otPay;
                
                return (
                  <div key={project.id} className="bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-red-500">
                    <h4 className="text-lg font-semibold text-red-600 mb-3">
                      {projectNumber}{suffix} Project: {project.name}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Period:</strong> {new Date(project.startDate + 'T00:00:00').toLocaleDateString()} - {new Date(project.endDate + 'T00:00:00').toLocaleDateString()}</p>
                        <p><strong>Working Days:</strong> {workingDays} days ({workingHours} hours)</p>
                        <p><strong>Hourly Rate:</strong> ₱{hourlyRate.toFixed(2)}/hour</p>
                      </div>
                      <div>
                        <p><strong>Regular Pay:</strong> ₱{regularSalary.toFixed(2)}</p>
                        {otHours > 0 && (
                          <>
                            <p><strong>Overtime Hours:</strong> {otHours} hours</p>
                            <p><strong>Overtime Pay:</strong> ₱{otPay.toFixed(2)}</p>
                          </>
                        )}
                        <p className="text-lg font-bold text-red-600"><strong>Total:</strong> ₱{totalSalary.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {reimbursements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">Reimbursements</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                {reimbursements.map((reimbursement, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-blue-200 last:border-b-0">
                    <div>
                      <span className="font-medium">{reimbursement.description}</span>
                      <span className="ml-2 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {reimbursement.category}
                      </span>
                      <div className="text-sm text-gray-600">
                        {new Date(reimbursement.date + 'T00:00:00').toLocaleDateString()}
                      </div>
                    </div>
                    <span className="font-bold text-blue-600">₱{reimbursement.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-blue-300">
                  <div className="flex justify-between items-center font-bold text-blue-700">
                    <span>Total Reimbursements:</span>
                    <span>₱{totalReimbursements.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {discontinuedProjects.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-orange-600 mb-4">Discontinued Projects</h3>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                {discontinuedProjects.map((project, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-orange-200 last:border-b-0">
                    <div>
                      <span className="font-medium">{project.name}</span>
                      <div className="text-sm text-gray-600">
                        Work Days: {project.days} days
                      </div>
                    </div>
                    <span className="font-bold text-orange-600">₱{project.payment.toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-orange-300">
                  <div className="flex justify-between items-center font-bold text-orange-700">
                    <span>Total Discontinued Payment:</span>
                    <span>₱{totalDiscontinuedPayment.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-xl font-semibold text-green-700 mb-4">Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Total Regular Pay:</span>
                <span className="font-semibold">₱{totalRegularPay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Overtime Pay:</span>
                <span className="font-semibold">₱{totalOTPay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-green-300 pt-2">
                <span className="font-semibold">Salary Subtotal:</span>
                <span className="font-bold text-green-700">₱{grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Reimbursements:</span>
                <span className="font-bold text-blue-700">₱{totalReimbursements.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Discontinued Payment:</span>
                <span className="font-bold text-orange-700">₱{totalDiscontinuedPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t-2 border-green-400 pt-3 text-xl">
                <span className="font-bold text-green-800">GRAND TOTAL:</span>
                <span className="font-bold text-green-800">₱{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-gray-200 text-gray-500">
            <p className="text-sm">Rooche Digital - Salary Calculator</p>
            <p className="text-xs">Document generated on {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}