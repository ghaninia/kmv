import React, { useEffect, useState } from 'react';
import { Eye, Printer, Search } from 'lucide-react';
import { orderAPI } from '../api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';

const statusOptions = [
    { value: '', label: 'همه وضعیت‌ها' },
    { value: 'pending', label: 'در انتظار' },
    { value: 'confirmed', label: 'تایید شده' },
    { value: 'cancelled', label: 'لغو شده' },
];

const statusBadgeClass = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-green-50 text-green-700',
    cancelled: 'bg-gray-100 text-gray-600',
};

export const OrdersPage = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);

    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(false);

    const fetchData = async (currentPage = page, currentSearch = search, currentStatus = statusFilter) => {
        try {
            setIsLoading(true);
            const res = await orderAPI.getList(currentPage, currentSearch, currentStatus || null);
            setData(res.data);
            setPagination(res.pagination);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page, search, statusFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchData(1, search, statusFilter);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        setPage(1);
        fetchData(1, search, value);
    };

    const openDetail = async (row) => {
        setDetailOpen(true);
        setDetailLoading(true);
        try {
            const order = await orderAPI.getById(row.id);
            setSelectedOrder(order);
        } catch (error) {
            console.error('Failed to fetch order:', error);
            setSelectedOrder(row);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleStatusChange = async (status) => {
        if (!selectedOrder) return;
        setStatusUpdating(true);
        try {
            const updated = await orderAPI.updateStatus(selectedOrder.id, status);
            setSelectedOrder(updated);
            fetchData(page, search, statusFilter);
        } catch (error) {
            alert(error.response?.data?.message || 'به‌روزرسانی وضعیت ناموفق بود');
        } finally {
            setStatusUpdating(false);
        }
    };

    const handlePrint = (orderId) => {
        window.open(`/api/orders/${orderId}/invoice`, '_blank');
    };

    const formatToman = (value) =>
        `${Number(value).toLocaleString('fa-IR')} تومان`;

    const columns = [
        { key: 'order_number', label: 'شماره پیش‌فاکتور' },
        { key: 'customer_name', label: 'مشتری' },
        {
            key: 'customer_phone',
            label: 'تلفن',
            render: (value) => <span dir="ltr">{value || '—'}</span>,
        },
        {
            key: 'catalog_name',
            label: 'کاتالوگ',
            render: (value) => <span className="text-gray-500">{value || '—'}</span>,
        },
        {
            key: 'subtotal_toman',
            label: 'جمع (تومان)',
            render: (value) => (
                <span dir="ltr" className="font-medium text-gray-900">
                    {formatToman(value)}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'وضعیت',
            render: (value, row) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusBadgeClass[value] || 'bg-gray-100 text-gray-600'
                    }`}
                >
                    {row.status_label || value}
                </span>
            ),
        },
        {
            key: 'created_at',
            label: 'تاریخ',
            render: (value) =>
                value ? new Date(value).toLocaleString('fa-IR') : '—',
        },
        {
            key: 'id',
            label: 'عملیات',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => openDetail(row)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                        title="مشاهده"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handlePrint(row.id)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-green-600 transition"
                        title="چاپ پیش‌فاکتور"
                    >
                        <Printer className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">پیش‌فاکتورها</h1>
                <p className="text-gray-500 mt-1">سفارش‌های ثبت‌شده از کاتالوگ عمومی</p>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="جستجو بر اساس شماره، نام یا تلفن..."
                            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </form>
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="p-2">
                    <DataTable
                        columns={columns}
                        data={data}
                        isLoading={isLoading}
                        pagination={pagination}
                        onPageChange={setPage}
                    />
                </div>
            </div>

            <Modal
                isOpen={detailOpen}
                onClose={() => setDetailOpen(false)}
                title="جزئیات پیش‌فاکتور"
                size="2xl"
            >
                {detailLoading || !selectedOrder ? (
                    <div className="py-12 text-center text-gray-500">در حال بارگذاری...</div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">شماره:</span>{' '}
                                <span className="font-semibold">{selectedOrder.order_number}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">کاتالوگ:</span>{' '}
                                <span>{selectedOrder.catalog_name || '—'}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">مشتری:</span>{' '}
                                <span>{selectedOrder.customer_name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">تلفن:</span>{' '}
                                <span dir="ltr">{selectedOrder.customer_phone || '—'}</span>
                            </div>
                        </div>

                        {selectedOrder.customer_note && (
                            <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-800">
                                <strong>توضیحات:</strong> {selectedOrder.customer_note}
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 text-gray-500">
                                        <th className="py-2 text-right">محصول</th>
                                        <th className="py-2 text-right">تعداد</th>
                                        <th className="py-2 text-right">قیمت واحد</th>
                                        <th className="py-2 text-right">جمع</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(selectedOrder.items || []).map((item) => (
                                        <tr key={item.id} className="border-b border-gray-100">
                                            <td className="py-3">{item.product_name}</td>
                                            <td className="py-3">{item.quantity}</td>
                                            <td className="py-3" dir="ltr">
                                                {formatToman(item.unit_price_toman)}
                                            </td>
                                            <td className="py-3 font-medium" dir="ltr">
                                                {formatToman(item.line_total_toman)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg bg-gray-50 px-4 py-4">
                            <div>
                                <p className="text-sm text-gray-500">جمع کل</p>
                                <p className="text-xl font-bold text-gray-900" dir="ltr">
                                    {formatToman(selectedOrder.subtotal_toman)}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <select
                                    value={selectedOrder.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    disabled={statusUpdating}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    {statusOptions
                                        .filter((option) => option.value)
                                        .map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => handlePrint(selectedOrder.id)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition"
                                >
                                    <Printer className="w-4 h-4" />
                                    چاپ پیش‌فاکتور
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
