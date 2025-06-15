"use client";

import { useState, useEffect } from "react";
import {SessionProvider, useSession} from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

function AddAnimalPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);


    const [form, setForm] = useState({
        name: "",
        price: "",
        category: "",
        age: "",
        available: true,
        image: null,
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

        // Upload the image to Cloudinary
        const imageUrl = await handleImageUpload();
        if (!imageUrl) {
            alert("Image upload failed.");
            return;
        }

        // Submit the full animal data with image URL
        const res = await fetch("/api/animals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, image: imageUrl }),
        });

        if (res.ok) {
            alert("Animal added successfully!");
            setForm({ name: "", price: "", category: "", age: "", available: true, image: null });
            setFile(null);
        } else {
            alert("Failed to add animal.");
        }
    }


    const handleImageUpload = async () => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        return data.url;
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardContent className="p-6 space-y-4">
                    <h1 className="text-2xl font-semibold text-center">Add Animal Poster</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Animal Name"
                                required
                                onChange={(e) => setForm({...form, name: e.target.value})}
                            />
                        </div>

                        <div>
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="Price"
                                required
                                onChange={(e) => setForm({...form, price: e.target.value})}
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                type="text"
                                placeholder="Category"
                                required
                                onChange={(e) => setForm({...form, category: e.target.value})}
                            />
                        </div>

                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                placeholder="Age"
                                required
                                onChange={(e) => setForm({...form, age: e.target.value})}
                            />
                        </div>

                        <div>
                            <Label htmlFor="image">Animal Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between border p-3 rounded-md">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="available"
                                    checked={form.available}
                                    onCheckedChange={(checked) => setForm({...form, available: !!checked})}
                                />

                            </div>
                            <span
                                className={`text-sm font-medium ${
                                    form.available ? "text-green-600" : "text-red-600"
                                }`}
                            >
                            {form.available ? "Available" : "Not Available"}
                            </span>
                        </div>

                        <Button type="submit" className="w-full">
                            Add Animal
                        </Button>

                        <Link href="/dashboard" className="text-center text-blue-600 hover:underline block">
                            Back to Shop
                        </Link>
                    </form>
                </CardContent>
            </Card>
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