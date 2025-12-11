'use client';

import { useState } from 'react';
import Link from 'next/link';

type Recipe = {
    id: number;
    name: string;
    owner: string;
    createdAt: Date | string;
    tags: string[];
};

type Props = {
    recipes: Recipe[];
};

export default function RecipeManager({ recipes }: Props) {
    const [recipeList, setRecipeList] = useState(recipes);
    const [loading, setLoading] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

    const executeDelete = async (recipeId: number, recipeName: string) => {
        setLoading(recipeId);
        setConfirmingDelete(null);
        setMessage(null);

        try {
            const response = await fetch(`/api/recipes/${recipeId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete recipe');
            }

            setRecipeList((prev) => prev.filter((r) => r.id !== recipeId));
            setMessage({ type: 'success', text: `Successfully deleted "${recipeName}"` });
        } catch (error) {
            setMessage({ type: 'error', text: `Failed to delete recipe: ${error}` });
        } finally {
            setLoading(null);
        }
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div>
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
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Owner</th>
                            <th className="px-4 py-3">Tags</th>
                            <th className="px-4 py-3">Created</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {recipeList.map((recipe) => (
                            <tr key={recipe.id}>
                                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{recipe.id}</td>
                                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                                    <Link
                                        href={`/recipes/${recipe.id}`}
                                        className="hover:text-indigo-600 hover:underline"
                                    >
                                        {recipe.name}
                                    </Link>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{recipe.owner}</td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {recipe.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {recipe.tags.length > 3 && (
                                            <span className="text-xs text-slate-400">+{recipe.tags.length - 3}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                                    {formatDate(recipe.createdAt)}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3">
                                    {confirmingDelete === recipe.id ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-rose-600">Delete?</span>
                                            <button
                                                type="button"
                                                onClick={() => executeDelete(recipe.id, recipe.name)}
                                                disabled={loading === recipe.id}
                                                className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
                                            >
                                                {loading === recipe.id ? 'Deleting...' : 'Yes'}
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
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/recipes/${recipe.id}/edit`}
                                                className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => setConfirmingDelete(recipe.id)}
                                                disabled={loading === recipe.id}
                                                className="rounded-lg bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-100 disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {recipeList.length === 0 && (
                <div className="py-8 text-center text-slate-500">No recipes found.</div>
            )}
        </div>
    );
}
