import { useState } from 'react';
import { FileText, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { getCurrentPeriod, getPeriod, PeriodInfo } from '../utils/invoiceCalculations';
import { Project } from '../services/projectService';
import { invoiceService } from '../services/invoiceService';

interface InvoiceGeneratorProps {
    projects: Project[];
    onInvoiceGenerated: () => void;
}

export default function InvoiceGenerator({ projects, onInvoiceGenerated }: InvoiceGeneratorProps) {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodInfo>(getCurrentPeriod());
    const [customDate, setCustomDate] = useState(format(new Date(), 'yyyy-MM'));
    const [periodType, setPeriodType] = useState<'first_half' | 'second_half'>('first_half');
    const [overtimeHours, setOvertimeHours] = useState(0);
    const [reimbursements, setReimbursements] = useState<Array<{ description: string; amount: number }>>([]);
    const [newReimbursement, setNewReimbursement] = useState({ description: '', amount: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePeriodChange = (date: string, type: 'first_half' | 'second_half') => {
        const [year, month] = date.split('-').map(Number);
        const targetDate = new Date(year, month - 1, 1);
        const period = getPeriod(targetDate, type);
        setSelectedPeriod(period);
        setCustomDate(date);
        setPeriodType(type);
    };

    const handleAddReimbursement = () => {
        if (newReimbursement.description && newReimbursement.amount > 0) {
            setReimbursements([...reimbursements, newReimbursement]);
            setNewReimbursement({ description: '', amount: 0 });
        }
    };

    const handleRemoveReimbursement = (index: number) => {
        setReimbursements(reimbursements.filter((_, i) => i !== index));
    };

    const handleGenerateInvoice = async () => {
        setLoading(true);
        setError('');

        try {
            await invoiceService.generateInvoice(
                selectedPeriod,
                projects,
                overtimeHours,
                reimbursements
            );

            alert('Invoice generated successfully!');
            onInvoiceGenerated();

            // Reset form
            setOvertimeHours(0);
            setReimbursements([]);
        } catch (err: any) {
            console.error('Invoice generation error:', err);
            const errorMessage = err.message || 'Failed to generate invoice';
            const detailedError = err.details || err.hint || '';
            setError(`${errorMessage}${detailedError ? ` - ${detailedError}` : ''}`);
        } finally {
            setLoading(false);
        }
    };

    const activeProjects = projects.filter(p => p.status === 'active');

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Generate Invoice
            </h2>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                {/* Period Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Select Invoice Period
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input
                                type="month"
                                value={customDate}
                                onChange={(e) => handlePeriodChange(e.target.value, periodType)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <select
                                value={periodType}
                                onChange={(e) => handlePeriodChange(customDate, e.target.value as 'first_half' | 'second_half')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="first_half">1st - 15th</option>
                                <option value="second_half">16th - End of Month</option>
                            </select>
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Period: {format(selectedPeriod.start, 'MMM dd, yyyy')} - {format(selectedPeriod.end, 'MMM dd, yyyy')}
                    </p>
                </div>

                {/* Overtime */}
                <div>
                    <label htmlFor="overtime" className="block text-sm font-medium text-gray-700 mb-2">
                        Overtime Hours (applies to first project only)
                    </label>
                    <input
                        id="overtime"
                        type="number"
                        min="0"
                        step="0.5"
                        value={overtimeHours}
                        onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                    />
                </div>

                {/* Reimbursements */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reimbursements
                    </label>

                    {reimbursements.length > 0 && (
                        <div className="mb-3 space-y-2">
                            {reimbursements.map((r, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{r.description}</p>
                                        <p className="text-sm text-gray-600">₱{r.amount.toFixed(2)}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveReimbursement(index)}
                                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                            type="text"
                            value={newReimbursement.description}
                            onChange={(e) => setNewReimbursement({ ...newReimbursement, description: e.target.value })}
                            placeholder="Description"
                            className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={newReimbursement.amount || ''}
                            onChange={(e) => setNewReimbursement({ ...newReimbursement, amount: parseFloat(e.target.value) || 0 })}
                            placeholder="Amount"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleAddReimbursement}
                        className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Add Reimbursement
                    </button>
                </div>


                {/* Project Summary */}
                <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Projects in this period:</h3>
                    {activeProjects.length === 0 ? (
                        <p className="text-gray-600 text-sm">No active projects</p>
                    ) : (
                        <ul className="space-y-1">
                            {activeProjects.map((project, index) => {
                                const isPartTime = project.employment_type === 'part-time';
                                const rate = isPartTime ? '10,000' : (index === 0 ? '20,000' : '10,000');
                                const typeLabel = isPartTime ? 'Part-Time' : 'Full-Time';
                                const scheduleInfo = isPartTime
                                    ? ` - ${project.part_time_days_per_week || 5} days/week × ${project.part_time_hours_per_day || 4} hrs/day`
                                    : '';

                                return (
                                    <li key={project.id} className="text-sm text-gray-700">
                                        • {project.name} ({typeLabel}{scheduleInfo} - ₱{rate}/month)
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Generate Button */}
                <button
                    onClick={handleGenerateInvoice}
                    disabled={loading || activeProjects.length === 0}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <FileText className="w-5 h-5" />
                            Generate Invoice
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
