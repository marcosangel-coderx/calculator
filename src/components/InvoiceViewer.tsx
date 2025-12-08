import { InvoiceData } from '../services/invoiceService';
import { Project } from '../services/projectService';
import { format, parseISO } from 'date-fns';
import { Printer } from 'lucide-react';

interface InvoiceViewerProps {
    invoice: InvoiceData;
    projects: Project[];
}

export default function InvoiceViewer({ invoice, projects }: InvoiceViewerProps) {
    const getProjectName = (projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        return project?.name || 'Unknown Project';
    };

    const handlePrint = () => {
        window.print();
    };

    const overtimeAdjustments = invoice.adjustments.filter(a => a.type === 'overtime');
    const reimbursementAdjustments = invoice.adjustments.filter(a => a.type === 'reimbursement');

    const regularTotal = invoice.items.reduce((sum, item) => sum + item.regular_pay, 0);
    const overtimeTotal = overtimeAdjustments.reduce((sum, adj) => sum + adj.amount, 0);
    const reimbursementTotal = reimbursementAdjustments.reduce((sum, adj) => sum + adj.amount, 0);

    return (
        <div className="print-content">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                {/* Print Button */}
                <div className="mb-6 flex justify-end no-print">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Printer className="w-5 h-5" />
                        Print Invoice
                    </button>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
                    <p className="text-lg text-gray-600">Rooche Digital</p>
                    <p className="text-sm text-gray-500">Salary Calculator Invoice</p>
                </div>

                {/* Period Info */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Invoice Period</p>
                            <p className="font-semibold text-gray-900">
                                {format(parseISO(invoice.period.period_start), 'MMMM dd, yyyy')} -{' '}
                                {format(parseISO(invoice.period.period_end), 'MMMM dd, yyyy')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Generated Date</p>
                            <p className="font-semibold text-gray-900">
                                {format(parseISO(invoice.period.generated_at), 'MMMM dd, yyyy')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Project Items */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Breakdown</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-300">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Project</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Working Days</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Working Hours</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Rate</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-200">
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.project_name || getProjectName(item.project_id)}</p>
                                                {item.is_discontinued && (
                                                    <p className="text-xs text-orange-600">Discontinued (50% payment)</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-center py-3 px-4 text-gray-700">{item.working_days}</td>
                                        <td className="text-center py-3 px-4 text-gray-700">{item.working_hours.toFixed(2)}</td>
                                        <td className="text-center py-3 px-4 text-gray-700">
                                            {item.rate_type === 'first_project' ? '₱20,000' : '₱10,000'}/mo
                                        </td>
                                        <td className="text-right py-3 px-4 font-semibold text-gray-900">
                                            ₱{item.regular_pay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Adjustments */}
                {invoice.adjustments.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Adjustments</h2>
                        <div className="space-y-2">
                            {invoice.adjustments.map((adjustment) => (
                                <div key={adjustment.id} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{adjustment.description}</p>
                                        <p className="text-sm text-gray-600">
                                            {adjustment.type === 'overtime' && adjustment.hours && `${adjustment.hours} hours`}
                                            {adjustment.type === 'reimbursement' && 'Reimbursement'}
                                        </p>
                                    </div>
                                    <p className="font-semibold text-green-600">
                                        +₱{adjustment.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Summary */}
                <div className="border-t-2 border-gray-300 pt-6">
                    <div className="space-y-2 max-w-md ml-auto">
                        <div className="flex justify-between text-gray-700">
                            <span>Regular Pay:</span>
                            <span className="font-semibold">
                                ₱{regularTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        {overtimeTotal > 0 && (
                            <div className="flex justify-between text-gray-700">
                                <span>Overtime:</span>
                                <span className="font-semibold">
                                    ₱{overtimeTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        )}
                        {reimbursementTotal > 0 && (
                            <div className="flex justify-between text-gray-700">
                                <span>Reimbursements:</span>
                                <span className="font-semibold">
                                    ₱{reimbursementTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t border-gray-300">
                            <span>TOTAL:</span>
                            <span className="text-green-600">
                                ₱{invoice.period.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                    <p>Thank you for your work!</p>
                    <p className="mt-2">Generated on {format(parseISO(invoice.period.generated_at), 'MMMM dd, yyyy hh:mm a')}</p>
                </div>
            </div>
        </div>
    );
}
