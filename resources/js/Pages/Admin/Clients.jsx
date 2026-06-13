import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { getCsrfToken } from '@/csrf.js';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        country: '',
        type: 'individual',
        status: 'active',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchClients();
    }, [search]);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/clients?search=${search}`, {
                credentials: 'include',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            const data = await response.json();
            setClients(data.data || []);
        } catch (err) {
            setError('Failed to fetch clients');
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
            const url = editingId ? `/api/clients/${editingId}` : '/api/clients';

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
                setError(data.message || 'Failed to save client');
                return;
            }

            setSuccess(editingId ? 'Client updated!' : 'Client created!');
            resetForm();
            fetchClients();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;

        try {
            const response = await fetch(`/api/clients/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            if (!response.ok) throw new Error('Delete failed');

            setSuccess('Client deleted!');
            fetchClients();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (client) => {
        setFormData(client);
        setEditingId(client.id);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            postal_code: '',
            country: '',
            type: 'individual',
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
                        Clients
                    </h2>
                    <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
                        ← Back
                    </Link>
                </div>
            }
        >
            <Head title="Clients" />

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
                            placeholder="Search clients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            {showForm ? 'Cancel' : '+ New Client'}
                        </button>
                    </div>

                    {showForm && (
                        <div className="mb-4 p-6 bg-white dark:bg-gray-800 rounded shadow">
                            <h3 className="text-lg font-semibold mb-4 dark:text-white">
                                {editingId ? 'Edit Client' : 'New Client'}
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
                                        type="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                    />
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                    />
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="individual">Individual</option>
                                        <option value="company">Company</option>
                                    </select>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Postal Code"
                                        value={formData.postal_code}
                                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                        className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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

                    {loading ? (
                        <div className="text-center py-12">Loading...</div>
                    ) : (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <table className="w-full text-left text-sm dark:text-gray-300">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">City</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map((client) => (
                                        <tr key={client.id} className="border-t dark:border-gray-700">
                                            <td className="px-6 py-4 font-medium">{client.name}</td>
                                            <td className="px-6 py-4">{client.email}</td>
                                            <td className="px-6 py-4 capitalize">{client.type}</td>
                                            <td className="px-6 py-4">{client.city}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded text-white ${client.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                    {client.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleEdit(client)}
                                                    className="text-blue-500 hover:text-blue-700 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
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
