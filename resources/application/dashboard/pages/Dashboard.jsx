import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tag, Boxes, TrendingUp } from 'lucide-react';
import { dashboardAPI } from '../api';

export const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const data = await dashboardAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Failed to load dashboard</p>
            </div>
        );
    }

    const cards = [
        {
            title: 'Total Products',
            value: stats.total_products,
            active: stats.active_products,
            icon: Package,
            color: 'blue',
        },
        {
            title: 'Total Categories',
            value: stats.total_categories,
            active: stats.active_categories,
            icon: Tag,
            color: 'green',
        },
        {
            title: 'Total Catalogs',
            value: stats.total_catalogs,
            active: stats.active_catalogs,
            icon: Boxes,
            color: 'purple',
        },
        {
            title: 'USD to Toman',
            value: stats.usd_rate_formatted,
            subtitle: `Rate: ${(stats.usd_rate / 100).toLocaleString()}`,
            icon: TrendingUp,
            color: 'orange',
        },
    ];

    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome to the admin dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.title}
                            className="bg-white rounded-lg shadow p-6 border border-gray-100"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {card.title}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">
                                        {card.value}
                                    </p>
                                    {card.active !== undefined && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {card.active} active
                                        </p>
                                    )}
                                    {card.subtitle && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            {card.subtitle}
                                        </p>
                                    )}
                                </div>
                                <div className={`p-3 rounded-lg ${colorClasses[card.color]}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        to="/categories"
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition text-center"
                    >
                        <p className="font-medium text-gray-900">Manage Categories</p>
                    </Link>
                    <Link
                        to="/products"
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition text-center"
                    >
                        <p className="font-medium text-gray-900">Manage Products</p>
                    </Link>
                    <Link
                        to="/catalogs"
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition text-center"
                    >
                        <p className="font-medium text-gray-900">Manage Catalogs</p>
                    </Link>
                    <button
                        onClick={fetchStats}
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition text-center"
                    >
                        <p className="font-medium text-gray-900">Refresh Stats</p>
                    </button>
                </div>
            </div>
        </div>
    );
};
