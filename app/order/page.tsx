"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

export default function OrderPage() {
    const { cart, setCart } = useCart() as any;
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        payment: "cash",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, cart }),
        });

        if (res.ok) {
            alert("Order placed successfully!");
            setCart([]);
            router.push("/");
        } else {
            const error = await res.json();
            alert("Failed to place order: " + error.error);
        }
    };

    return (
        <div>
            <h1>Complete Your Order</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
                <input type="text" name="address" placeholder="Address" required onChange={handleChange} />
                <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleChange} />
                <select name="payment" onChange={handleChange} value={form.payment}>
                    <option value="cash">Cash</option>
                </select>
                <button type="submit">Submit Order</button>
            </form>
        </div>
    );
}
