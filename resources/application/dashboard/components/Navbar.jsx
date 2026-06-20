import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/appStore';
import { LogOut, DollarSign, Menu } from 'lucide-react';

export const Navbar = ({ onMenuClick }) => {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const usdRateFormatted = useAppStore((state) => state.usdRateFormatted);

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMenuClick}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* USD Rate Display */}
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">
                                USD: {usdRateFormatted || 'Loading...'}
                            </span>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
