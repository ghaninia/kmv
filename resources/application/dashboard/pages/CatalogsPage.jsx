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
} from 'lucide-react';
import { catalogAPI, productAPI } from '../api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

const emptyForm = { name: '', slug: '', description: '', status: true };

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
                alert(error.response?.data?.message || 'Failed to save catalog');
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
            alert(error.response?.data?.message || 'Failed to delete catalog');
        } finally {
            setDeleting(false);
        }
    };

    const columns = [
        { key: 'name', label: 'Name' },
        {
            key: 'slug',
            label: 'Slug',
            render: (value) => <span className="text-gray-500">{value || '—'}</span>,
        },
        {
            key: 'product_count',
            label: 'Products',
            render: (value) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                    {value ?? 0}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        value ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    {value ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            key: 'id',
            label: 'Actions',
            render: (_, row) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setProductsCatalog(row)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-purple-600 transition"
                        title="Manage Products"
                    >
                        <Boxes className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setLinksCatalog(row)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-green-600 transition"
                        title="Public Links"
                    >
                        <Link2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => openEdit(row)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                        title="Edit"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setDeleteTarget(row)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-600 transition"
                        title="Delete"
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
                    <h1 className="text-3xl font-bold text-gray-900">Catalogs</h1>
                    <p className="text-gray-500 mt-1">Manage your catalogs and public links</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                >
                    <Plus className="w-5 h-5" />
                    Add Catalog
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                    <form onSubmit={handleSearch} className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search catalogs..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
                title={editing ? 'Edit Catalog' : 'Add Catalog'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name <span className="text-red-500">*</span>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                        <input
                            type="text"
                            value={form.slug}
                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                            placeholder="auto-generated if empty"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                        {errors.slug && <p className="text-sm text-red-600 mt-1">{errors.slug[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition"
                        >
                            {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                isLoading={deleting}
                title="Delete Catalog"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
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

const CatalogProductsModal = ({ catalog, onClose }) => {
    const [attached, setAttached] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [customPrice, setCustomPrice] = useState('');
    const [attaching, setAttaching] = useState(false);

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

    const loadAllProducts = async () => {
        try {
            const res = await productAPI.getList(1, '', null, 100);
            setAllProducts(res.data);
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    };

    useEffect(() => {
        loadAttached();
        loadAllProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const attachedIds = new Set(attached.map((p) => p.id));
    const availableProducts = allProducts.filter((p) => !attachedIds.has(p.id));

    const handleAttach = async () => {
        if (!selectedProduct) return;
        setAttaching(true);
        try {
            const product = allProducts.find((p) => p.id === Number(selectedProduct));
            const priceCents = customPrice
                ? Math.round(parseFloat(customPrice) * 100)
                : Math.round((product?.base_price_usd ?? 0) * 100);
            await catalogAPI.attachProducts(catalog.id, [
                { product_id: Number(selectedProduct), custom_price_usd: priceCents },
            ]);
            setSelectedProduct('');
            setCustomPrice('');
            loadAttached();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to attach product');
        } finally {
            setAttaching(false);
        }
    };

    const handleDetach = async (productId) => {
        try {
            await catalogAPI.detachProduct(catalog.id, productId);
            loadAttached();
        } catch (error) {
            alert('Failed to detach product');
        }
    };

    const handlePriceUpdate = async (productId, value) => {
        try {
            const cents = Math.round(parseFloat(value || 0) * 100);
            await catalogAPI.updateProductPrice(catalog.id, productId, cents);
            loadAttached();
        } catch (error) {
            alert('Failed to update price');
        }
    };

    return (
        <Modal isOpen onClose={onClose} title={`Products — ${catalog.name}`} size="2xl">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-lg">
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                        <option value="">Select product to add...</option>
                        {availableProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name} (${Number(p.base_price_usd).toLocaleString()})
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        placeholder="Custom price (optional)"
                        className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button
                        onClick={handleAttach}
                        disabled={!selectedProduct || attaching}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                    </div>
                ) : attached.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No products in this catalog yet</p>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {attached.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                            >
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt=""
                                        className="w-10 h-10 rounded object-cover border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded bg-gray-100" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                                    <p className="text-xs text-gray-500">
                                        Base: ${Number(product.base_price_usd).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-gray-500">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        defaultValue={product.custom_price_usd}
                                        onBlur={(e) => handlePriceUpdate(product.id, e.target.value)}
                                        className="w-28 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                    />
                                </div>
                                <button
                                    onClick={() => handleDetach(product.id)}
                                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-600 transition"
                                    title="Remove"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
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
            alert(error.response?.data?.message || 'Failed to create link');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (linkId) => {
        try {
            await catalogAPI.deleteLink(catalog.id, linkId);
            loadLinks();
        } catch (error) {
            alert('Failed to delete link');
        }
    };

    const copyToClipboard = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    return (
        <Modal isOpen onClose={onClose} title={`Public Links — ${catalog.name}`} size="2xl">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-lg items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Password (optional)
                        </label>
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 4 characters"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Expires at (optional)
                        </label>
                        <input
                            type="date"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={creating}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition"
                    >
                        <Plus className="w-4 h-4" />
                        Create
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                    </div>
                ) : links.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No public links created yet</p>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {links.map((link) => (
                            <div
                                key={link.id}
                                className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-mono text-sm text-gray-900 truncate">
                                        {link.public_url}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        {link.is_password_protected && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                                                Protected
                                            </span>
                                        )}
                                        {link.is_expired ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                                Expired
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                Active
                                            </span>
                                        )}
                                        {link.expires_at && (
                                            <span className="text-xs text-gray-500">
                                                Expires: {new Date(link.expires_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(link.public_url, link.id)}
                                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition"
                                    title="Copy link"
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
                                    title="Delete link"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};
