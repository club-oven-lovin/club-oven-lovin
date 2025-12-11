'use client';

import { useState } from 'react';
import { Role } from '@prisma/client';
import { updateUserRole, deleteUser } from '@/lib/dbActions';

type UserWithRole = {
    id: number;
    email: string;
    role: Role;
    name: string | null;
};

type Props = {
    users: UserWithRole[];
    currentAdminId: number;
};

export default function UserRoleManager({ users, currentAdminId }: Props) {
    const [userList, setUserList] = useState(users);
    const [loading, setLoading] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

    const handleRoleChange = async (userId: number, newRole: Role) => {
        setLoading(userId);
        setMessage(null);
        try {
            await updateUserRole(userId, newRole);
            setUserList((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
            );
            setMessage({ type: 'success', text: `Role updated successfully for user ${userId}` });
        } catch (error) {
            setMessage({ type: 'error', text: `Failed to update role: ${error}` });
        } finally {
            setLoading(null);
        }
    };

    const handleDeleteUser = async (userId: number, userEmail: string) => {
        setLoading(userId);
        setConfirmingDelete(null);
        setMessage(null);

        try {
            await deleteUser(userId);
            setUserList((prev) => prev.filter((u) => u.id !== userId));
            setMessage({ type: 'success', text: `Successfully deleted user "${userEmail}"` });
        } catch (error) {
            setMessage({ type: 'error', text: `Failed to delete user: ${error}` });
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
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Current Role</th>
                        <th className="px-4 py-3">Change Role</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {userList.map((user) => (
                        <tr key={user.id}>
                            <td className="whitespace-nowrap px-4 py-3 text-slate-600">{user.id}</td>
                            <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{user.email}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-slate-600">{user.name || '-'}</td>
                            <td className="whitespace-nowrap px-4 py-3">
                                <span
                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${user.role === 'ADMIN'
                                            ? 'bg-purple-100 text-purple-800'
                                            : user.role === 'VENDOR'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-slate-100 text-slate-800'
                                        }`}
                                >
                                    {user.role}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                                <select
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                                    disabled={loading === user.id}
                                >
                                    <option value="USER">USER</option>
                                    <option value="VENDOR">VENDOR</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                                {loading === user.id && (
                                    <span className="ml-2 text-xs text-slate-500">Saving...</span>
                                )}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                                {confirmingDelete === user.id ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-rose-600">Delete?</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteUser(user.id, user.email)}
                                            disabled={loading === user.id}
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
                                        onClick={() => setConfirmingDelete(user.id)}
                                        disabled={loading === user.id || user.id === currentAdminId}
                                        className="rounded-lg bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                                        title={user.id === currentAdminId ? "Can't delete yourself" : 'Delete user'}
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
