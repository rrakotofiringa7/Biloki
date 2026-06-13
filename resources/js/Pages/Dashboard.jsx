import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Products Card */}
                        <Link href="/admin/products">
                            <div className="cursor-pointer overflow-hidden bg-blue-500 shadow-sm sm:rounded-lg hover:shadow-lg transition">
                                <div className="p-6 text-white">
                                    <h3 className="text-2xl font-bold">📦</h3>
                                    <p className="mt-2 text-lg font-semibold">Products</p>
                                    <p className="text-blue-100">Manage your product catalog</p>
                                </div>
                            </div>
                        </Link>

                        {/* Clients Card */}
                        <Link href="/admin/clients">
                            <div className="cursor-pointer overflow-hidden bg-green-500 shadow-sm sm:rounded-lg hover:shadow-lg transition">
                                <div className="p-6 text-white">
                                    <h3 className="text-2xl font-bold">👥</h3>
                                    <p className="mt-2 text-lg font-semibold">Clients</p>
                                    <p className="text-green-100">Manage your clients</p>
                                </div>
                            </div>
                        </Link>

                        {/* Stock Card */}
                        <Link href="/admin/stocks">
                            <div className="cursor-pointer overflow-hidden bg-purple-500 shadow-sm sm:rounded-lg hover:shadow-lg transition">
                                <div className="p-6 text-white">
                                    <h3 className="text-2xl font-bold">📊</h3>
                                    <p className="mt-2 text-lg font-semibold">Stock</p>
                                    <p className="text-purple-100">Monitor inventory</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
