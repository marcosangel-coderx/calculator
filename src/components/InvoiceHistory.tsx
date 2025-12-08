import { useState, useEffect } from 'react';
import { invoiceService, InvoiceData } from '../services/invoiceService';
import { projectService, Project } from '../services/projectService';
import { History, Eye, Trash2, Printer, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import InvoiceViewer from './InvoiceViewer';

export default function InvoiceHistory() {
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [invoicesData, projectsData] = await Promise.all([
                invoiceService.getInvoiceHistory(),
                projectService.getProjects(),
            ]);
            setInvoices(invoicesData);
            setProjects(projectsData);
        } catch (error) {
            console.error('Failed to load invoice history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (invoiceId: string) => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            try {
                await invoiceService.deleteInvoice(invoiceId);
                await loadData();
            } catch (error: any) {
                console.error('Failed to delete invoice:', error);
                alert(`Failed to delete invoice: ${error.message || 'Unknown error'}`);
            }
        }
    };

    const handlePrint = (invoice: InvoiceData) => {
        setSelectedInvoice(invoice);
        setTimeout(() => {
            window.print();
        }, 100);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading invoice history...</p>
            </div>
        );
    }

    if (selectedInvoice) {
        return (
            <div>
                <button
                    onClick={() => setSelectedInvoice(null)}
                    className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors no-print"
                >
                    ← Back to History
                </button>
                <InvoiceViewer invoice={selectedInvoice} projects={projects} />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Invoice History
            </h2>

            {invoices.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No invoices generated yet.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {invoices
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((invoice) => (
                                <div
                                    key={invoice.period.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-gray-900">
                                                    {format(parseISO(invoice.period.period_start), 'MMM dd')} -{' '}
                                                    {format(parseISO(invoice.period.period_end), 'MMM dd, yyyy')}
                                                </h3>
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                                    {invoice.period.cutoff_type === 'first_half' ? '1st Half' : '2nd Half'}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                                <span>{invoice.items.length} project(s)</span>
                                                <span>{invoice.adjustments.length} adjustment(s)</span>
                                                <span className="font-semibold text-green-600">
                                                    Total: ₱{invoice.period.total_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Generated: {format(parseISO(invoice.period.generated_at), 'MMM dd, yyyy hh:mm a')}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setSelectedInvoice(invoice)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View invoice"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handlePrint(invoice)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Print invoice"
                                            >
                                                <Printer className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(invoice.period.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete invoice"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Pagination Controls */}
                    {invoices.length > itemsPerPage && (
                        <div className="mt-6 flex items-center justify-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>

                            {Array.from({ length: Math.ceil(invoices.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(invoices.length / itemsPerPage), prev + 1))}
                                disabled={currentPage === Math.ceil(invoices.length / itemsPerPage)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
