"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';


interface Animal {
    id: string;
    name: string;
    price: number;
    category: string;
    age: number;
    available: boolean;
    image?: string;
}

export default function AnimalPage() {
    const { addToCart } = useCart();
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [animal, setAnimal] = useState<Animal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnimal() {
            if (!id) return;
            try {
                const res = await fetch(`/api/animals/${id}`);
                const data = await res.json();
                setAnimal(data);
            } catch (err) {
                console.error("Failed to fetch animal", err);
            } finally {
                setLoading(false);
            }
        }

        fetchAnimal();
    }, [id]);

    if (loading) return <p className="p-4">Loading...</p>;
    if (!animal) return <p className="p-4 text-red-500">Animal not found.</p>;

    return (
        <div className="max-w-md mx-auto min-h-screen flex items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle>{animal.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {animal.image && (
                        <Image
                            src={animal.image}
                            alt={animal.name}
                            width={400} // or whatever width you want
                            height={256} // adjust this to your layout
                            className="w-full object-cover rounded-md mb-4"
                        />
                    )}

                    <p><strong>Price:</strong> ${animal.price}</p>
                    <p><strong>Age:</strong> {animal.age}</p>
                    <p><strong>Category:</strong> {animal.category}</p>
                    <p><strong>Status:</strong> {animal.available ? "Available" : "Reserved"}</p>

                    {animal.available && (
                        <Button onClick={() => addToCart(animal)} className="w-full">
                            Add to Cart
                        </Button>
                    )}
                    <Button variant="secondary" asChild className="w-full">
                        <Link href="/dashboard">Back to Shop</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
