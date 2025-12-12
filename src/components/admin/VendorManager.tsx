'use client';

import { useState } from 'react';
import { deleteVendor } from '@/lib/dbActions';

type Vendor = {
    id: string;
    name: string;
    owner: string;
    address: string | null;
    hours: string | null;
    _count: {
        ingredients: number;
    };
};

type Props = {
    vendors: Vendor[];
};

export default function VendorManager({ vendors }: Props) {
    const [vendorList, setVendorList] = useState(vendors);
    const [loading, setLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

    const handleDeleteVendor = async (vendorId: string, vendorName: string) => {
        setLoading(vendorId);
        setConfirmingDelete(null);
        setMessage(null);

        try {
            await deleteVendor(vendorId);
            setVendorList((prev) => prev.filter((v) => v.id !== vendorId));
            setMessage({ type: 'success', text: `Successfully deleted vendor "${vendorName}"` });
        } catch (error) {
            setMessage({ type: 'error', text: `Failed to delete vendor: ${error}` });
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="overflow-x-auto">
            {message && (
                <div
                    className={`mb-4 rounded-lg p-3 text-sm ${message.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                >
                    {message.text}
                </div>
            )}
            <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Owner</th>
                        <th className="px-4 py-3">Address</th>
                        <th className="px-4 py-3">Hours</th>
                        <th className="px-4 py-3">Ingredients</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {vendorList.map((vendor) => (
                        <tr key={vendor.id}>
                            <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{vendor.name}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-slate-600">{vendor.owner}</td>
                            <td className="px-4 py-3 text-slate-600">{vendor.address || '-'}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-slate-600">{vendor.hours || '-'}</td>
                            <td className="whitespace-nowrap px-4 py-3">
                                <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                    {vendor._count.ingredients} items
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                                {confirmingDelete === vendor.id ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-rose-600">Delete vendor & all ingredients?</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                                            disabled={loading === vendor.id}
                                            className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
                                        >
                                            Yes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConfirmingDelete(null)}
                                            className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200"
                                        >
                                            No
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setConfirmingDelete(vendor.id)}
                                        disabled={loading === vendor.id}
                                        className="rounded-lg bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-100 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {vendorList.length === 0 && (
                <div className="py-8 text-center text-slate-500">No vendors found.</div>
            )}
        </div>
    );
}
