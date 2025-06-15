"use client";

import {SessionProvider, useSession} from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

type Animal = {
    id: string;
    name: string;
    price: number;
    age: number;
    category: string;
    available: boolean;
    image?: string | null;
};

function DashBoardPage() {
    const { data: session } = useSession();
    const [animals, setAnimals] = useState<Animal[]>([]);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const res = await fetch("/api/animals", { method: "GET" });

                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }

                const data = await res.json();
                setAnimals(data);
            } catch (err) {
                console.error("Failed to fetch animals:", err);
            }
        };

        void fetchAnimals();
    }, []);


    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <Link href="/profile">Go to Profile</Link>
                <Link href="/cart">View Cart</Link>
                {session?.user?.isAdmin && (
                    <Link href="/admin/add-animal">Create Animal Poster</Link>
                )}

                {session?.user?.isAdmin && (
                    <Link href="/admin/delete-animal">Delete Animal Poster</Link>
                )}


            </nav>

            <ul className="animal-list">
                {animals.map((animal) => (
                    <li key={animal.id} className="animal-item">
                        <Link href={`/animals/${animal.id}`} className="animal-link">
                            {animal.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Page() {
    return (
        <SessionProvider>
            <DashBoardPage/>
        </SessionProvider>
    );
}

