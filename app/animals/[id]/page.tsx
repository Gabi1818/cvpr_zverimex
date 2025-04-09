"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Animal {
    id: string;
    name: string;
    price: number;
    category: string;
    age: number;
    available: boolean;
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

    if (loading) return <p>Loading...</p>;
    if (!animal) return <p>Animal not found.</p>;

    return (
        <div>
            <h1>{animal.name}</h1>
            <p>Price: ${animal.price}</p>
            <p>Age: {animal.age}</p>
            <p>Category: {animal.category}</p>
            <p>Status: {animal.available ? "Available" : "Reserved"}</p>

            {animal.available && (
                <button onClick={() => addToCart(animal)}>Add to Cart</button>
            )}
            <p><Link href="/dashboard">Back to shop</Link></p>
        </div>
    );
}

