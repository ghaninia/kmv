import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, ImageIcon } from 'lucide-react';
import { productAPI, categoryAPI } from '../api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SlugInput } from '../components/SlugInput';
import { PriceInput } from '../components/PriceInput';
import { SearchableSelect } from '../components/SearchableSelect';

const emptyForm = {
    category_id: '',
    name: '',
    slug: '',
    description: '',
    base_price_usd: '',
    status: true,
};

export const ProductsPage = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [categories, setCategories] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [newImages, setNewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const fetchData = async (currentPage = page, currentSearch = search, currentCat = categoryFilter) => {
        try {
            setIsLoading(true);
            const res = await productAPI.getList(currentPage, currentSearch, currentCat || null);
            setData(res.data);
            setPagination(res.pagination);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await categoryAPI.getList(1, '', 100);
            setCategories(res.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchData(page, search, categoryFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchData(1, search, categoryFilter);
    };

    const handleCategoryFilter = (value) => {
        setCategoryFilter(value);
        setPage(1);
        fetchData(1, search, value);
    };

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setNewImages([]);
        setExistingImages([]);
        setErrors({});
        setModalOpen(true);
    };

    const openEdit = (row) => {
        setEditing(row);
        setForm({
            category_id: row.category_id || '',
            name: row.name || '',
            slug: row.slug || '',
            description: row.description || '',
            base_price_usd: row.base_price_usd ?? '',
            status: !!row.status,
        });
        setNewImages([]);
        setExistingImages(row.images || []);
        setErrors({});
        setModalOpen(true);
    };

    const handleFileChange = (e) => {
        setNewImages([...newImages, ...Array.from(e.target.files)]);
        e.target.value = '';
    };

    const removeNewImage = (idx) => {
        setNewImages(newImages.filter((_, i) => i !== idx));
    };

    const removeExistingImage = async (mediaId) => {
        try {
            await productAPI.deleteImage(editing.id, mediaId);
            setExistingImages(existingImages.filter((img) => img.id !== mediaId));
        } catch (error) {
            setExistingImages(existingImages.filter((img) => img.id !== mediaId));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            const payload = {
                category_id: form.category_id,
                name: form.name,
                slug: form.slug || '',
                description: form.description || '',
                base_price_usd: Math.round(parseFloat(form.base_price_usd || 0) * 100),
                status: form.status ? 1 : 0,
            };
            if (newImages.length > 0) {
                payload.images = newImages;
            }
            if (editing) {
                await productAPI.update(editing.id, payload);
            } else {
                await productAPI.create(payload);
            }
            setModalOpen(false);
            fetchData(page, search, categoryFilter);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                alert(error.response?.data?.message || 'ذخیره محصول ناموفق بود');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await productAPI.delete(deleteTarget.id);
            setDeleteTarget(null);
            const nextPage = data.length === 1 && page > 1 ? page - 1 : page;
            setPage(nextPage);
            fetchData(nextPage, search, categoryFilter);
        } catch (error) {
            alert(error.response?.data?.message || 'حذف محصول ناموفق بود');
        } finally {
            setDeleting(false);
        }
    };

    const columns = [
        {
            key: 'images',
            label: 'تصویر',
            render: (images) =>
                images && images.length > 0 ? (
                    <img
                        src={images[0].url}
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
            key: 'category_name',
            label: 'دسته‌بندی',
            render: (value) => <span className="text-gray-500">{value || '—'}</span>,
        },
        {
            key: 'base_price_usd',
            label: 'قیمت',
            render: (value) => (
                <span dir="ltr" className="inline-block font-medium text-gray-900">
                    ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                    <h1 className="text-3xl font-bold text-gray-900">محصولات</h1>
                    <p className="text-gray-500 mt-1">محصولات خود را مدیریت کنید</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                >
                    <Plus className="w-5 h-5" />
                    افزودن محصول
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="جستجوی محصول..."
                            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </form>
                    <div className="w-full sm:w-56">
                        <SearchableSelect
                            value={categoryFilter}
                            onChange={(val) => handleCategoryFilter(val)}
                            options={categories.map((cat) => ({
                                value: cat.id,
                                label: cat.name,
                            }))}
                            placeholder="همه دسته‌بندی‌ها"
                        />
                    </div>
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
                title={editing ? 'ویرایش محصول' : 'افزودن محصول'}
                size="2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                دسته‌بندی <span className="text-red-500">*</span>
                            </label>
                            <SearchableSelect
                                value={form.category_id}
                                onChange={(val) => setForm({ ...form, category_id: val })}
                                options={categories.map((cat) => ({
                                    value: cat.id,
                                    label: cat.name,
                                }))}
                                placeholder="انتخاب دسته‌بندی"
                                isClearable={false}
                                error={errors.category_id && errors.category_id[0]}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                قیمت پایه (دلار) <span className="text-red-500">*</span>
                            </label>
                            <PriceInput
                                value={form.base_price_usd}
                                onChange={(val) => setForm({ ...form, base_price_usd: val })}
                                prefix="$"
                                required
                                error={errors.base_price_usd && errors.base_price_usd[0]}
                            />
                        </div>

                        <SlugInput
                            value={form.slug}
                            onChange={(slug) => setForm((prev) => ({ ...prev, slug }))}
                            source={form.name}
                            error={errors.slug && errors.slug[0]}
                        />
                    </div>

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
                            تصاویر
                        </label>
                        <div className="flex flex-wrap gap-3">
                            {existingImages.map((img) => (
                                <div key={img.id} className="relative w-20 h-20 group">
                                    <img
                                        src={img.url}
                                        alt=""
                                        className="w-20 h-20 rounded object-cover border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(img.id)}
                                        className="absolute -top-2 -left-2 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {newImages.map((file, idx) => (
                                <div key={idx} className="relative w-20 h-20 group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt=""
                                        className="w-20 h-20 rounded object-cover border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(idx)}
                                        className="absolute -top-2 -left-2 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <label className="w-20 h-20 rounded border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                                <Plus className="w-6 h-6 text-gray-400" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {errors['images.0'] && (
                            <p className="text-sm text-red-600 mt-1">{errors['images.0'][0]}</p>
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
                title="حذف محصول"
                message={`آیا مطمئن هستید که می‌خواهید «${deleteTarget?.name}» را حذف کنید؟ این عمل قابل بازگشت نیست.`}
            />
        </div>
    );
};
