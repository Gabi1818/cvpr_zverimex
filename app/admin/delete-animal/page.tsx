"use client";

import { useEffect, useState } from "react";
import {SessionProvider, useSession} from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type Animal = {
    id: string;
    name: string;
    price: number;
    age: number;
    category: string;
    available: boolean;
};

function DeleteAnimalPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const [animals, setAnimals] = useState<Animal[]>([]);

    // Redirect if not admin
    useEffect(() => {
        if (status === "loading") return;
        if (!session?.user?.isAdmin) {
            router.push("/");
        }
    }, [session, status, router]);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const res = await fetch("/api/animals");
                const data = await res.json();
                setAnimals(data);
            } catch (err) {
                console.error("Failed to fetch animals:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnimals();
    }, []);

    const handleDelete = async (id: string) => {
        const confirm = window.confirm("Are you sure you want to delete this animal?");
        if (!confirm) return;

        try {
            const res = await fetch(`/api/animals/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setAnimals((prev) => prev.filter((animal) => animal.id !== id));
            } else {
                alert("Failed to delete animal.");
            }
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Error occurred while deleting.");
        }
    };

    if (status === "loading" || loading) return <p className="text-center mt-10">Loading...</p>;
    if (!session?.user?.isAdmin) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
            <div className="max-w-2xl w-full space-y-6">
                <h1 className="text-2xl font-semibold text-center">Delete Animal Posters</h1>
                <Link href="/dashboard" className="text-center text-blue-600 hover:underline block">
                    Back to Shop
                </Link>

                {animals.length === 0 ? (
                    <p className="text-center text-gray-500">No animals to delete.</p>
                ) : (
                    <div className="space-y-4">
                        {animals.map((animal) => (
                            <Card key={animal.id}>
                                <CardContent className="flex justify-between items-center p-4">
                                    <span>{animal.name}</span>
                                    <Button variant="destructive" onClick={() => handleDelete(animal.id)}>
                                        Delete
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <SessionProvider>
            <DeleteAnimalPage/>
        </SessionProvider>
    );
}
