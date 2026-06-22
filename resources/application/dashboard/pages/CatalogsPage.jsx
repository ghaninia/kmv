import React, { useEffect, useState } from 'react';
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    Boxes,
    Link2,
    Copy,
    Check,
    X,
    RefreshCw,
    ExternalLink,
} from 'lucide-react';
import { catalogAPI, productAPI } from '../api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SlugInput } from '../components/SlugInput';
import { PriceInput } from '../components/PriceInput';

const emptyForm = { name: '', slug: '', description: '', status: true };

// Length of the generated public-link password. Configurable via the
// CATALOG_PASSWORD_LENGTH env variable, exposed through a meta tag.
const getPasswordLength = () => {
    const meta = document.querySelector('meta[name="catalog-password-length"]');
    const len = parseInt(meta?.getAttribute('content') ?? '', 10);
    return Number.isFinite(len) && len >= 4 ? len : 12;
};

// Generates a random, URL-safe password of the configured length.
const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    const length = getPasswordLength();
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[values[i] % chars.length];
    }
    return result;
};

export const CatalogsPage = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [productsCatalog, setProductsCatalog] = useState(null);
    const [linksCatalog, setLinksCatalog] = useState(null);

    const fetchData = async (currentPage = page, currentSearch = search) => {
        try {
            setIsLoading(true);
            const res = await catalogAPI.getList(currentPage, currentSearch);
            setData(res.data);
            setPagination(res.pagination);
        } catch (error) {
            console.error('Failed to fetch catalogs:', error);
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
        setErrors({});
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            const payload = {
                name: form.name,
                slug: form.slug || undefined,
                description: form.description || undefined,
                status: form.status,
            };
            if (editing) {
                await catalogAPI.update(editing.id, payload);
            } else {
                await catalogAPI.create(payload);
            }
            setModalOpen(false);
            fetchData(page, search);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                alert(error.response?.data?.message || 'ذخیره کاتالوگ ناموفق بود');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await catalogAPI.delete(deleteTarget.id);
            setDeleteTarget(null);
            const nextPage = data.length === 1 && page > 1 ? page - 1 : page;
            setPage(nextPage);
            fetchData(nextPage, search);
        } catch (error) {
            alert(error.response?.data?.message || 'حذف کاتالوگ ناموفق بود');
        } finally {
            setDeleting(false);
        }
    };

    const columns = [
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
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
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setProductsCatalog(row)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-purple-600 transition"
                        title="مدیریت محصولات"
                    >
                        <Boxes className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setLinksCatalog(row)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-green-600 transition"
                        title="لینک‌های عمومی"
                    >
                        <Link2 className="w-4 h-4" />
                    </button>
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
                    <h1 className="text-3xl font-bold text-gray-900">کاتالوگ‌ها</h1>
                    <p className="text-gray-500 mt-1">کاتالوگ‌ها و لینک‌های عمومی خود را مدیریت کنید</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                >
                    <Plus className="w-5 h-5" />
                    افزودن کاتالوگ
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
                            placeholder="جستجوی کاتالوگ..."
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
                title={editing ? 'ویرایش کاتالوگ' : 'افزودن کاتالوگ'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex items-start gap-3 p-3 bg-blue-50/60 border border-blue-100 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Boxes className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600">
                            {editing
                                ? 'جزئیات کاتالوگ را به‌روزرسانی کنید. محصولات و لینک‌های عمومی آن را می‌توانید از فهرست کاتالوگ مدیریت کنید.'
                                : 'یک کاتالوگ بسازید، سپس از فهرست، محصولات را اضافه کرده و لینک‌های عمومی قابل اشتراک بسازید.'}
                        </p>
                    </div>

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
                                placeholder="مثلاً کاتالوگ بهاره"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 mt-1">{errors.name[0]}</p>
                            )}
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
                            placeholder="توضیح کوتاه و اختیاری برای این کاتالوگ"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                        <input
                            type="checkbox"
                            checked={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>
                            <span className="block text-sm font-medium text-gray-700">فعال</span>
                            <span className="block text-xs text-gray-500">
                                کاتالوگ‌های غیرفعال در لینک‌های عمومی نمایش داده نمی‌شوند
                            </span>
                        </span>
                    </label>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
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
                            {saving ? 'در حال ذخیره...' : editing ? 'به‌روزرسانی کاتالوگ' : 'ایجاد کاتالوگ'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                isLoading={deleting}
                title="حذف کاتالوگ"
                message={`آیا مطمئن هستید که می‌خواهید «${deleteTarget?.name}» را حذف کنید؟ این عمل قابل بازگشت نیست.`}
            />

            {productsCatalog && (
                <CatalogProductsModal
                    catalog={productsCatalog}
                    onClose={() => {
                        setProductsCatalog(null);
                        fetchData(page, search);
                    }}
                />
            )}

            {linksCatalog && (
                <CatalogLinksModal
                    catalog={linksCatalog}
                    onClose={() => setLinksCatalog(null)}
                />
            )}
        </div>
    );
};

const CatalogPriceField = ({ initialValue, onSave }) => {
    const [value, setValue] = useState(String(initialValue ?? ''));

    useEffect(() => {
        setValue(String(initialValue ?? ''));
    }, [initialValue]);

    return (
        <PriceInput
            value={value}
            onChange={setValue}
            onBlur={() => onSave(value)}
            prefix="$"
            title="قیمت اختصاصی در این کاتالوگ"
            inputClassName="!py-1 text-sm w-28"
        />
    );
};

const CatalogProductsModal = ({ catalog, onClose }) => {
    const [attached, setAttached] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [attachingId, setAttachingId] = useState(null);

    const loadAttached = async () => {
        try {
            setLoading(true);
            const res = await catalogAPI.getProducts(catalog.id, 1, '', 100);
            setAttached(res.data);
        } catch (error) {
            console.error('Failed to load catalog products:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchProducts = async (term) => {
        try {
            setSearching(true);
            const res = await productAPI.getList(1, term, null, 20);
            setResults(res.data);
        } catch (error) {
            console.error('Failed to search products:', error);
        } finally {
            setSearching(false);
        }
    };

    useEffect(() => {
        loadAttached();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Debounced live search
    useEffect(() => {
        const handle = setTimeout(() => searchProducts(search), 300);
        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const attachedIds = new Set(attached.map((p) => p.id));
    const availableResults = results.filter((p) => !attachedIds.has(p.id));

    const handleAttach = async (product) => {
        setAttachingId(product.id);
        try {
            const priceCents = Math.round((product.base_price_usd ?? 0) * 100);
            await catalogAPI.attachProducts(catalog.id, [
                { product_id: product.id, custom_price_usd: priceCents },
            ]);
            await loadAttached();
        } catch (error) {
            alert(error.response?.data?.message || 'افزودن محصول ناموفق بود');
        } finally {
            setAttachingId(null);
        }
    };

    const handleDetach = async (productId) => {
        try {
            await catalogAPI.detachProduct(catalog.id, productId);
            loadAttached();
        } catch (error) {
            alert('حذف محصول ناموفق بود');
        }
    };

    const handlePriceUpdate = async (productId, value) => {
        try {
            const cents = Math.round(parseFloat(value || 0) * 100);
            await catalogAPI.updateProductPrice(catalog.id, productId, cents);
            loadAttached();
        } catch (error) {
            alert('به‌روزرسانی قیمت ناموفق بود');
        }
    };

    return (
        <Modal isOpen onClose={onClose} title={`محصولات — ${catalog.name}`} size="5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Search & add products */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                            افزودن محصول
                        </h3>
                        <span className="text-xs text-gray-400">
                            جستجو کنید و برای افزودن کلیک کنید
                        </span>
                    </div>

                    <div className="relative mb-3">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="جستجوی محصول بر اساس نام..."
                            autoFocus
                            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div className="border border-gray-100 rounded-lg divide-y divide-gray-100 max-h-96 overflow-y-auto">
                        {searching ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                            </div>
                        ) : availableResults.length === 0 ? (
                            <p className="text-center text-sm text-gray-500 py-8">
                                {search
                                    ? 'محصولی مطابق جستجو یافت نشد'
                                    : 'محصول دیگری برای افزودن وجود ندارد'}
                            </p>
                        ) : (
                            availableResults.map((product) => (
                                <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => handleAttach(product)}
                                    disabled={attachingId === product.id}
                                    className="w-full flex items-start gap-3 p-3 text-right hover:bg-blue-50/50 transition disabled:opacity-60"
                                >
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt=""
                                            className="w-12 h-12 rounded object-cover border border-gray-200 shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded bg-gray-100 shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 break-words"
                                            title={product.name}
                                        >
                                            {product.name}
                                        </p>
                                        <p dir="ltr" className="text-xs text-gray-500 mt-0.5 text-right">
                                            ${Number(product.base_price_usd).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 shrink-0 mt-1">
                                        {attachingId === product.id ? (
                                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                                        ) : (
                                            <Plus className="w-4 h-4" />
                                        )}
                                        افزودن
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Attached products */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">
                            در این کاتالوگ
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                            {attached.length} محصول
                        </span>
                    </div>

                    <div className="border border-gray-100 rounded-lg max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                            </div>
                        ) : attached.length === 0 ? (
                            <p className="text-center text-sm text-gray-500 py-8">
                                هنوز محصولی اضافه نشده — از سمت راست اضافه کنید
                            </p>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {attached.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-start gap-3 p-3 hover:bg-gray-50"
                                    >
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt=""
                                                className="w-12 h-12 rounded object-cover border border-gray-200 shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded bg-gray-100 shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 break-words"
                                                title={product.name}
                                            >
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                پایه:{' '}
                                                <span dir="ltr" className="inline-block">
                                                    ${Number(product.base_price_usd).toLocaleString()}
                                                </span>
                                            </p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <CatalogPriceField
                                                    initialValue={product.custom_price_usd}
                                                    onSave={(val) =>
                                                        handlePriceUpdate(product.id, val)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDetach(product.id)}
                                            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-600 transition shrink-0"
                                            title="حذف"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const CatalogLinksModal = ({ catalog, onClose }) => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [creating, setCreating] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [copiedPwId, setCopiedPwId] = useState(null);

    const loadLinks = async () => {
        try {
            setLoading(true);
            const res = await catalogAPI.getLinks(catalog.id);
            setLinks(res.data);
        } catch (error) {
            console.error('Failed to load links:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreate = async () => {
        setCreating(true);
        try {
            await catalogAPI.createLink(catalog.id, {
                password: password || null,
                expires_at: expiresAt || null,
            });
            setPassword('');
            setExpiresAt('');
            loadLinks();
        } catch (error) {
            alert(error.response?.data?.message || 'ساخت لینک ناموفق بود');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (linkId) => {
        try {
            await catalogAPI.deleteLink(catalog.id, linkId);
            loadLinks();
        } catch (error) {
            alert('حذف لینک ناموفق بود');
        }
    };

    const writeToClipboard = (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.setAttribute('readonly', '');
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
        } finally {
            document.body.removeChild(textarea);
        }
        return Promise.resolve();
    };

    const copyToClipboard = (url, id) => {
        writeToClipboard(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    const copyPassword = (pw, id) => {
        writeToClipboard(pw);
        setCopiedPwId(id);
        setTimeout(() => setCopiedPwId(null), 1500);
    };

    return (
        <Modal isOpen onClose={onClose} title={`لینک‌های عمومی — ${catalog.name}`} size="2xl">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-lg items-stretch sm:items-end">
                    <div className="w-full sm:flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            رمز عبور (اختیاری)
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                dir="ltr"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="حداقل ۴ کاراکتر"
                                className="w-full pl-4 pr-11 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-left"
                            />
                            <button
                                type="button"
                                onClick={() => setPassword(generatePassword())}
                                title="ساخت رمز عبور تصادفی"
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full sm:flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            تاریخ انقضا (اختیاری)
                        </label>
                        <input
                            type="date"
                            dir="ltr"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-left"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={creating}
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition"
                    >
                        <Plus className="w-4 h-4" />
                        ایجاد
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                    </div>
                ) : links.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">هنوز لینک عمومی‌ای ساخته نشده است</p>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {links.map((link) => (
                            <div
                                key={link.id}
                                className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-mono text-sm text-gray-900 truncate">
                                        {link.public_url}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        {link.is_password_protected && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                                                محافظت‌شده
                                            </span>
                                        )}
                                        {link.is_expired ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                                منقضی‌شده
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                فعال
                                            </span>
                                        )}
                                        {link.expires_at && (
                                            <span className="text-xs text-gray-500">
                                                انقضا: {new Date(link.expires_at).toLocaleDateString('fa-IR')}
                                            </span>
                                        )}
                                    </div>
                                    {link.password && (
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className="text-xs text-gray-500">رمز عبور:</span>
                                            <code className="font-mono text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded select-all break-all">
                                                {link.password}
                                            </code>
                                            <button
                                                onClick={() => copyPassword(link.password, link.id)}
                                                className="inline-flex items-center justify-center p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition"
                                                title="کپی رمز عبور"
                                            >
                                                {copiedPwId === link.id ? (
                                                    <Check className="w-3.5 h-3.5 text-green-600" />
                                                ) : (
                                                    <Copy className="w-3.5 h-3.5" />
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 self-end sm:self-auto shrink-0 border-t sm:border-t-0 border-gray-100 pt-2 sm:pt-0">
                                    <a
                                        href={link.public_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition"
                                        title="پیش‌نمایش"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => copyToClipboard(link.public_url, link.id)}
                                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition"
                                        title="کپی لینک"
                                    >
                                        {copiedId === link.id ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(link.id)}
                                        className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-600 transition"
                                        title="حذف لینک"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};
