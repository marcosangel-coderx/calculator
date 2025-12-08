import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings, Lock, Trash2, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';

export default function Navigation() {
    const { user, signOut } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSignOut = async () => {
        await signOut();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChangePassword = () => {
        setIsDropdownOpen(false);
        setIsChangePasswordOpen(true);
    };

    const handleDeleteAccount = () => {
        setIsDropdownOpen(false);
        setIsDeleteAccountOpen(true);
    };

    return (
        <>
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">R</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Rooche Digital</h1>
                                <p className="text-sm text-gray-600">Invoice Management System</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                                <User className="w-5 h-5 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    {user?.email}
                                </span>
                            </div>

                            {/* Settings Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span className="font-medium">Settings</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-xs text-gray-500 font-medium">Account Settings</p>
                                        </div>

                                        <button
                                            onClick={handleChangePassword}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <Lock className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Change Password</p>
                                                <p className="text-xs text-gray-500">Update your password</p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={handleDeleteAccount}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-600" />
                                            <div>
                                                <p className="text-sm font-medium text-red-900">Delete Account</p>
                                                <p className="text-xs text-red-600">Permanently remove account</p>
                                            </div>
                                        </button>

                                        <div className="border-t border-gray-100 mt-2 pt-2">
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <LogOut className="w-5 h-5 text-gray-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Logout</p>
                                                    <p className="text-xs text-gray-500">Sign out of your account</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Modals */}
            <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
            />
            <DeleteAccountModal
                isOpen={isDeleteAccountOpen}
                onClose={() => setIsDeleteAccountOpen(false)}
            />
        </>
    );
}
