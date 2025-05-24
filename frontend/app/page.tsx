"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

const API_URL = "http://localhost:8080/api/users";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

interface FormState {
  name: string;
  email: string;
  password: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "" });
  const [editId, setEditId] = useState<number | null>(null);

  const fetchUsers = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", email: "", password: "" });
    setEditId(null);
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setForm({ name: user.name, email: user.email, password: user.password });
    setEditId(user.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchUsers();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">User Management</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-10 grid md:grid-cols-3 gap-6">
          <div>
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
          </div>
          <div>
            <Label>Password</Label>
            <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          <div className="col-span-full flex gap-4">
            <Button type="submit" className="w-32">{editId ? "Update" : "Create"}</Button>
            {editId && (
              <Button variant="outline" onClick={() => { setForm({ name: "", email: "", password: "" }); setEditId(null); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        <section className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition duration-200">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-400">Created: {new Date(user.createdAt).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Updated: {new Date(user.updatedAt).toLocaleString()}</p>
                </div>
                <div className="mt-4 md:mt-0 flex gap-3">
                  <Button variant="secondary" onClick={() => handleEdit(user)} size="sm">
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(user.id)} size="sm">
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}