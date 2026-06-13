import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { getCsrfToken } from '@/csrf.js';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        sku: '',
        image_url: '',
        status: 'active',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [search]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/products?search=${search}`, {
                credentials: 'include',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            const data = await response.json();
            setProducts(data.data || []);
        } catch (err) {
            setError('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/products/${editingId}` : '/api/products';

            const response = await fetch(url, {
                method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || 'Failed to save product');
                return;
            }

            setSuccess(editingId ? 'Product updated!' : 'Product created!');
            resetForm();
            fetchProducts();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            if (!response.ok) throw new Error('Delete failed');

            setSuccess('Product deleted!');
            fetchProducts();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (product) => {
        setFormData(product);
        setEditingId(product.id);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            sku: '',
            image_url: '',
            status: 'active',
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Products
                    </h2>
                    <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
                        ← Back
                    </Link>
                </div>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                            {success}
                        </div>
                    )}

                    <div className="mb-4 flex gap-4">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {showForm ? 'Cancel' : '+ New Product'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="mb-4 p-6 bg-white dark:bg-gray-800 rounded shadow">
                            <h3 className="text-lg font-semibold mb-4 dark:text-white">
                                {editingId ? 'Edit Product' : 'New Product'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="SKU"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                        step="0.01"
                                        required
                                    />
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                    rows="3"
                                ></textarea>
                                <input
                                    type="url"
                                    placeholder="Image URL"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                />
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                            </form>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">Loading...</div>
                    ) : (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <table className="w-full text-left text-sm dark:text-gray-300">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">SKU</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} className="border-t dark:border-gray-700">
                                            <td className="px-6 py-4 font-medium">{product.name}</td>
                                            <td className="px-6 py-4">{product.sku}</td>
                                            <td className="px-6 py-4">${product.price}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded text-white ${product.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                    {product.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-blue-500 hover:text-blue-700 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
