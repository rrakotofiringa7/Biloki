import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { getCsrfToken } from '@/csrf.js';

export default function Stocks() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [lowStockOnly, setLowStockOnly] = useState(false);
    const [formData, setFormData] = useState({
        product_id: '',
        quantity: '',
        reserved: '',
        reorder_level: '',
        reorder_quantity: '',
        warehouse_location: '',
    });
    const [adjustData, setAdjustData] = useState({
        stockId: null,
        adjustment: '',
        reason: '',
    });
    const [showAdjust, setShowAdjust] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchStocks();
        fetchProducts();
    }, [lowStockOnly]);

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const url = lowStockOnly ? '/api/stocks?low_stock=1' : '/api/stocks';
            const response = await fetch(url, {
                credentials: 'include',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            const data = await response.json();
            setStocks(data.data || []);
        } catch (err) {
            setError('Failed to fetch stocks');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products?per_page=1000', {
                credentials: 'include',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            const data = await response.json();
            setProducts(data.data || []);
        } catch (err) {
            setError('Failed to fetch products');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/stocks/${editingId}` : '/api/stocks';

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
                setError(data.message || 'Failed to save stock');
                return;
            }

            setSuccess(editingId ? 'Stock updated!' : 'Stock created!');
            resetForm();
            fetchStocks();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAdjustStock = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/stocks/${adjustData.stockId}/adjust`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    adjustment: parseInt(adjustData.adjustment),
                    reason: adjustData.reason,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || 'Failed to adjust stock');
                return;
            }

            setSuccess('Stock adjusted!');
            setShowAdjust(false);
            setAdjustData({ stockId: null, adjustment: '', reason: '' });
            fetchStocks();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;

        try {
            const response = await fetch(`/api/stocks/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            if (!response.ok) throw new Error('Delete failed');

            setSuccess('Stock deleted!');
            fetchStocks();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (stock) => {
        setFormData(stock);
        setEditingId(stock.id);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            product_id: '',
            quantity: '',
            reserved: '',
            reorder_level: '',
            reorder_quantity: '',
            warehouse_location: '',
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Stock Management
                    </h2>
                    <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
                        ← Back
                    </Link>
                </div>
            }
        >
            <Head title="Stock Management" />

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

                    <div className="mb-4 flex gap-4 justify-between">
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={lowStockOnly}
                                    onChange={(e) => setLowStockOnly(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="dark:text-white">Low Stock Only</span>
                            </label>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                            {showForm ? 'Cancel' : '+ New Stock'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="mb-4 p-6 bg-white dark:bg-gray-800 rounded shadow">
                            <h3 className="text-lg font-semibold mb-4 dark:text-white">
                                {editingId ? 'Edit Stock' : 'New Stock'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={formData.product_id}
                                        onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                        required
                                        disabled={!!editingId}
                                    >
                                        <option value="">Select Product</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Reserved"
                                        value={formData.reserved}
                                        onChange={(e) => setFormData({ ...formData, reserved: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Reorder Level"
                                        value={formData.reorder_level}
                                        onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Reorder Quantity"
                                        value={formData.reorder_quantity}
                                        onChange={(e) => setFormData({ ...formData, reorder_quantity: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Warehouse Location"
                                        value={formData.warehouse_location}
                                        onChange={(e) => setFormData({ ...formData, warehouse_location: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                            </form>
                        </div>
                    )}

                    {showAdjust && (
                        <div className="mb-4 p-6 bg-white dark:bg-gray-800 rounded shadow">
                            <h3 className="text-lg font-semibold mb-4 dark:text-white">Adjust Stock</h3>
                            <form onSubmit={handleAdjustStock} className="space-y-4">
                                <input
                                    type="number"
                                    placeholder="Adjustment (+/-)"
                                    value={adjustData.adjustment}
                                    onChange={(e) => setAdjustData({ ...adjustData, adjustment: e.target.value })}
                                    className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                    required
                                />
                                <textarea
                                    placeholder="Reason for adjustment"
                                    value={adjustData.reason}
                                    onChange={(e) => setAdjustData({ ...adjustData, reason: e.target.value })}
                                    className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                    rows="2"
                                ></textarea>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAdjust(false)}
                                        className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
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
                                        <th className="px-6 py-3">Product</th>
                                        <th className="px-6 py-3">Qty</th>
                                        <th className="px-6 py-3">Reserved</th>
                                        <th className="px-6 py-3">Available</th>
                                        <th className="px-6 py-3">Location</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocks.map((stock) => (
                                        <tr key={stock.id} className={`border-t dark:border-gray-700 ${stock.quantity <= stock.reorder_level ? 'bg-red-50 dark:bg-red-900' : ''}`}>
                                            <td className="px-6 py-4 font-medium">{stock.product?.name}</td>
                                            <td className="px-6 py-4">{stock.quantity}</td>
                                            <td className="px-6 py-4">{stock.reserved}</td>
                                            <td className="px-6 py-4"><strong>{stock.available}</strong></td>
                                            <td className="px-6 py-4">{stock.warehouse_location}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => {
                                                        setAdjustData({ ...adjustData, stockId: stock.id });
                                                        setShowAdjust(true);
                                                    }}
                                                    className="text-yellow-500 hover:text-yellow-700 mr-3"
                                                >
                                                    Adjust
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(stock)}
                                                    className="text-blue-500 hover:text-blue-700 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(stock.id)}
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
