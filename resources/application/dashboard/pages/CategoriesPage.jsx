import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, ImageIcon } from 'lucide-react';
import { categoryAPI } from '../api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SlugInput } from '../components/SlugInput';

const emptyForm = { name: '', slug: '', description: '', status: true };

export const CategoriesPage = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [newImage, setNewImage] = useState(null);
    const [existingCover, setExistingCover] = useState(null);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchData = async (currentPage = page, currentSearch = search) => {
        try {
            setIsLoading(true);
            const res = await categoryAPI.getList(currentPage, currentSearch);
            setData(res.data);
            setPagination(res.pagination);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page, search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchData(1, search);
    };

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setNewImage(null);
        setExistingCover(null);
        setErrors({});
        setModalOpen(true);
    };

    const openEdit = (row) => {
        setEditing(row);
        setForm({
            name: row.name || '',
            slug: row.slug || '',
            description: row.description || '',
            status: !!row.status,
        });
        setNewImage(null);
        setExistingCover(row.cover_media || null);
        setErrors({});
        setModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
        }
        e.target.value = '';
    };

    const removeNewImage = () => {
        setNewImage(null);
    };

    const removeExistingCover = async () => {
        if (!editing) {
            setExistingCover(null);
            return;
        }
        try {
            await categoryAPI.deleteImage(editing.id);
            setExistingCover(null);
        } catch (error) {
            alert(error.response?.data?.message || 'حذف تصویر ناموفق بود');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            const payload = {
                name: form.name,
                slug: form.slug || '',
                description: form.description || '',
                status: form.status ? 1 : 0,
            };
            if (newImage) {
                payload.image = newImage;
            }
            if (editing) {
                await categoryAPI.update(editing.id, payload);
            } else {
                await categoryAPI.create(payload);
            }
            setModalOpen(false);
            fetchData(page, search);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                alert(error.response?.data?.message || 'ذخیره دسته‌بندی ناموفق بود');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await categoryAPI.delete(deleteTarget.id);
            setDeleteTarget(null);
            const nextPage = data.length === 1 && page > 1 ? page - 1 : page;
            setPage(nextPage);
            fetchData(nextPage, search);
        } catch (error) {
            alert(error.response?.data?.message || 'حذف دسته‌بندی ناموفق بود');
        } finally {
            setDeleting(false);
        }
    };

    const columns = [
        {
            key: 'image',
            label: 'تصویر',
            render: (value, row) =>
                row.cover_media?.url ? (
                    <img
                        src={row.cover_media.url}
                        alt=""
                        className="w-10 h-10 rounded object-cover border border-gray-200"
                    />
                ) : (
                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                ),
        },
        { key: 'name', label: 'نام' },
        {
            key: 'slug',
            label: 'اسلاگ',
            render: (value) => <span className="text-gray-500">{value || '—'}</span>,
        },
        {
            key: 'product_count',
            label: 'محصولات',
            render: (value) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {value ?? 0}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'وضعیت',
            render: (value) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        value ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    {value ? 'فعال' : 'غیرفعال'}
                </span>
            ),
        },
        {
            key: 'id',
            label: 'عملیات',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => openEdit(row)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                        title="ویرایش"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setDeleteTarget(row)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600 transition"
                        title="حذف"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">دسته‌بندی‌ها</h1>
                    <p className="text-gray-500 mt-1">دسته‌بندی‌های محصولات خود را مدیریت کنید</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                >
                    <Plus className="w-5 h-5" />
                    افزودن دسته‌بندی
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                    <form onSubmit={handleSearch} className="relative max-w-sm">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="جستجوی دسته‌بندی..."
                            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </form>
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
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            نام <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name[0]}</p>}
                    </div>

                    <SlugInput
                        value={form.slug}
                        onChange={(slug) => setForm((prev) => ({ ...prev, slug }))}
                        source={form.name}
                        error={errors.slug && errors.slug[0]}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            توضیحات
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            تصویر دسته‌بندی
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {existingCover && !newImage && (
                                <div className="relative w-24 h-24 group">
                                    <img
                                        src={existingCover.url}
                                        alt=""
                                        className="w-24 h-24 rounded object-cover border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeExistingCover}
                                        className="absolute -top-2 -left-2 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                            {newImage && (
                                <div className="relative w-24 h-24 group">
                                    <img
                                        src={URL.createObjectURL(newImage)}
                                        alt=""
                                        className="w-24 h-24 rounded object-cover border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeNewImage}
                                        className="absolute -top-2 -left-2 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                            {!newImage && (
                                <label
                                    className="w-24 h-24 rounded border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition text-center px-1"
                                    title={existingCover ? 'تغییر تصویر' : 'افزودن تصویر'}
                                >
                                    <Plus className="w-6 h-6 text-gray-400" />
                                    <span className="text-[10px] text-gray-500 mt-1">
                                        {existingCover ? 'تغییر' : 'افزودن'}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                        {errors.image && (
                            <p className="text-sm text-red-600 mt-1">{errors.image[0]}</p>
                        )}
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">فعال</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
                        >
                            انصراف
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition"
                        >
                            {saving ? 'در حال ذخیره...' : editing ? 'به‌روزرسانی' : 'ایجاد'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                isLoading={deleting}
                title="حذف دسته‌بندی"
                message={`آیا مطمئن هستید که می‌خواهید «${deleteTarget?.name}» را حذف کنید؟ این عمل قابل بازگشت نیست.`}
            />
        </div>
    );
};
