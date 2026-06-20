import React, { useEffect, useState } from 'react';
import { DollarSign, Save, History, Check } from 'lucide-react';
import { currencyAPI } from '../api';
import { useAppStore } from '../store/appStore';

export const SettingsPage = () => {
    const setUSDRate = useAppStore((state) => state.setUSDRate);

    const [toman, setToman] = useState('');
    const [currentFormatted, setCurrentFormatted] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    const loadRate = async () => {
        try {
            setIsLoading(true);
            const data = await currencyAPI.getRate();
            // rate is stored in cents (rate / 100 = toman)
            setToman(String(Math.round(data.rate / 100)));
            setCurrentFormatted(data.rate_formatted);
        } catch (e) {
            console.error('Failed to load currency rate:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const loadHistory = async () => {
        try {
            setHistoryLoading(true);
            const data = await currencyAPI.getHistory(30);
            setHistory(data);
        } catch (e) {
            console.error('Failed to load currency history:', e);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        loadRate();
        loadHistory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        const tomanValue = parseInt(toman, 10);
        if (!toman || isNaN(tomanValue) || tomanValue < 0) {
            setError('Please enter a valid USD rate.');
            return;
        }

        setSaving(true);
        try {
            // backend stores rate in cents (toman * 100)
            const rateCents = tomanValue * 100;
            const res = await currencyAPI.updateRate(rateCents, 'manual');
            setCurrentFormatted(res.data.rate_formatted);
            setUSDRate(res.data.rate, res.data.rate_formatted);
            setSuccess(true);
            loadHistory();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            if (err.response?.status === 422) {
                const errs = err.response.data.errors || {};
                setError(errs.rate?.[0] || 'The entered value is invalid.');
            } else {
                setError('Failed to save rate. Please try again.');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">USD to Toman exchange rate settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Update rate card */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                USD to Toman Rate
                            </h2>
                            <p className="text-sm text-gray-500">
                                {isLoading
                                    ? 'Loading...'
                                    : `Current rate: ${currentFormatted ?? '-'} Toman`}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price per USD (Toman) *
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={toman}
                                onChange={(e) => setToman(e.target.value)}
                                disabled={isLoading}
                                placeholder="e.g. 850000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                            />
                            {error && (
                                <p className="text-sm text-red-600 mt-1">{error}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={saving || isLoading}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : 'Save Rate'}
                            </button>
                            {success && (
                                <span className="inline-flex items-center gap-1 text-sm text-green-600">
                                    <Check className="w-4 h-4" />
                                    Rate updated successfully
                                </span>
                            )}
                        </div>
                    </form>
                </div>

                {/* History card */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <History className="w-5 h-5 text-gray-500" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Rate History
                        </h2>
                    </div>

                    {historyLoading ? (
                        <p className="text-sm text-gray-500">Loading...</p>
                    ) : history.length === 0 ? (
                        <p className="text-sm text-gray-500">No history recorded yet.</p>
                    ) : (
                        <ul className="space-y-2 max-h-80 overflow-y-auto">
                            {[...history].reverse().map((item, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-center justify-between text-sm border-b border-gray-100 pb-2 last:border-0"
                                >
                                    <span className="text-gray-500">{item.date}</span>
                                    <span className="font-medium text-gray-900">
                                        {item.rate_formatted} Toman
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
