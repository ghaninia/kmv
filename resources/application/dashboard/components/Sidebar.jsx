import React from 'react';
import { Link } from 'react-router-dom';
import {
    Home,
    Package,
    Tag,
    Boxes,
    FileText,
    Settings,
    X,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { icon: Home, label: 'داشبورد', href: '/' },
        { icon: Tag, label: 'دسته‌بندی‌ها', href: '/categories' },
        { icon: Package, label: 'محصولات', href: '/products' },
        { icon: Boxes, label: 'کاتالوگ‌ها', href: '/catalogs' },
        { icon: FileText, label: 'پیش‌فاکتورها', href: '/orders' },
        { icon: Settings, label: 'تنظیمات', href: '/settings' },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:static inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200 transform transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
                }`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">داشبورد</h2>
                        <button
                            onClick={onClose}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-gray-700 transition group"
                            >
                                <item.icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            پنل مدیریت نسخه ۱.۰
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};
