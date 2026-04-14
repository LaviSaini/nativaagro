"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type UserRow = {
  _id: string;
  email: string;
  name?: string;
  role: string;
  disabled: boolean;
  createdAt: string | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const q = new URLSearchParams();
    if (search.trim()) q.set("search", search.trim());
    const res = await adminFetch(`/api/admin/users?${q.toString()}`);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Failed to load users");
      setUsers([]);
    } else {
      setUsers(await res.json());
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    void load();
  }, [load]);

  async function patchUser(id: string, body: { role?: string; disabled?: boolean }) {
    const res = await adminFetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Update failed");
      return;
    }
    const updated = await res.json();
    setUsers((list) => list.map((u) => (u._id === id ? { ...u, ...updated } : u)));
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete this user permanently?")) return;
    const res = await adminFetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error || "Delete failed");
      return;
    }
    setUsers((list) => list.filter((u) => u._id !== id));
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Users</h1>

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="user-search" className="mb-1 block text-sm font-medium text-zinc-700">
            Search
          </label>
          <input
            id="user-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Email or name"
            className="w-64 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Apply
        </button>
      </div>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-zinc-600">Loading users…</p>
      ) : users.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-8">
          <p className="text-zinc-600">No users found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-zinc-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-zinc-100">
                  <td className="px-4 py-3 font-medium text-zinc-900">{u.name || "—"}</td>
                  <td className="px-4 py-3 text-zinc-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => void patchUser(u._id, { role: e.target.value })}
                      className="rounded border border-zinc-300 px-2 py-1 text-sm"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void patchUser(u._id, { disabled: !u.disabled })}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        u.disabled
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {u.disabled ? "Disabled" : "Active"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => void deleteUser(u._id)}
                      className="text-sm text-red-600 hover:underline"
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
  );
}
