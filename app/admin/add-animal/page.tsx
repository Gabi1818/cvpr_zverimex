"use client";

import { useState, useEffect } from "react";
import {SessionProvider, useSession} from "next-auth/react";
import { useRouter } from "next/navigation";

function AddAnimalPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        age: "",
        available: true,
    });

    useEffect(() => {
        if (status === "loading") return;
        if (!session?.user?.isAdmin) {
            router.push("/");
        }
    }, [session, status, router]);

    if (status === "loading") return <p>Loading...</p>;
    if (!session?.user?.isAdmin) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/animals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            alert("Animal added successfully!");
        } else {
            alert("Failed to add animal.");
        }
    }

    return (
        <div>
            <h1>Add Animal Poster</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Category"
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Age"
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    required
                />
                <label>
                    Available:
                    <input
                        type="checkbox"
                        checked={form.available}
                        onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    />
                </label>
                <button type="submit">Add Animal</button>
            </form>
        </div>
    );
}

export default function Page() {
    return (
        <SessionProvider>
            <AddAnimalPage/>
        </SessionProvider>
    );
}