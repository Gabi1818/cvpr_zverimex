"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";


import Link from "next/link";

export default function OrderPage() {
    const { cart } = useCart();
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
            router.push("/");
        } else {
            const error = await res.json();
            alert("Failed to place order: " + error.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-xl p-6 w-full max-w-4xl space-y-6"
            >
                <h1 className="text-2xl font-semibold mb-4">Complete Your Order</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input name="name" value={form.name} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input name="address" value={form.address} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
                    </div>

                    <div>
                        <Label htmlFor="payment">Payment</Label>
                        <Select
                            onValueChange={(value) => setForm({ ...form, payment: value })}
                            defaultValue={form.payment}
                        >
                            <SelectTrigger className="text-black">
                                <SelectValue placeholder="Select payment" />
                            </SelectTrigger>
                            <SelectContent className="text-black">
                                <SelectItem value="cash">Cash</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
                    <Button type="submit">Submit Order</Button>
                    <Link href="/dashboard">
                        Back to Shop
                    </Link>
                </div>
            </form>
        </div>
    );
}
