import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
    const { deleteAccount, user } = useAuth();
    const [confirmText, setConfirmText] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (confirmText !== 'DELETE') {
            setError('Please type DELETE to confirm');
            return;
        }

        setLoading(true);

        try {
            const { error } = await deleteAccount();

            if (error) {
                setError(error.message || 'Failed to delete account');
                setLoading(false);
            }
            // If successful, user will be signed out and redirected automatically
        } catch (err) {
            setError('An unexpected error occurred');
            setLoading(false);
        }
    };

    const handleClose = () => {
        setConfirmText('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Delete Account</h2>
                        <p className="text-sm text-gray-600">This action cannot be undone</p>
                    </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-red-900 mb-2">Warning</h3>
                    <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                        <li>All your data will be permanently deleted</li>
                        <li>Your projects and invoices will be removed</li>
                        <li>This action cannot be reversed</li>
                    </ul>
                </div>

                <form onSubmit={handleDelete} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Account: <span className="font-semibold">{user?.email}</span>
                        </label>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type <span className="font-bold text-red-600">DELETE</span> to confirm
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent uppercase"
                            placeholder="Type DELETE"
                            required
                            autoComplete="off"
                        />
                        <p className="mt-1 text-xs text-gray-500">Text will automatically capitalize</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || confirmText !== 'DELETE'}
                            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Deleting...' : 'Delete Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
