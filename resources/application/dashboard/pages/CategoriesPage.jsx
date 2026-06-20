import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { categoryAPI } from '../api';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

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
                alert(error.response?.data?.message || 'Failed to save category');
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
            alert(error.response?.data?.message || 'Failed to delete category');
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
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
                <div className="flex items-center gap-2">
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
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500 mt-1">Manage your product categories</p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                >
                    <Plus className="w-5 h-5" />
                    Add Category
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
                            placeholder="Search categories..."
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
                title={editing ? 'Edit Category' : 'Add Category'}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug
                        </label>
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
                title="Delete Category"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
            />
        </div>
    );
};
