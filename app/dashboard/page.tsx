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
};

function DashBoardPage() {
    const { data: session } = useSession();
    const [animals, setAnimals] = useState<Animal[]>([]);


    useEffect(() => {
        const fetchAnimals = async () => {
            const res = await fetch("/api/animals", { method: "GET" });
            const data = await res.json();
            setAnimals(data);
        };

        void fetchAnimals();
    }, []);



    return (
        <div>
            <p><Link href="/profile">Go to Profile</Link></p>
            <p><Link href="/cart">View Cart</Link></p>


            {session?.user?.isAdmin && (
                <div>
                    <a href="/admin/add-animal">Create Animal Poster</a>
                </div>
            )}

            <h2>Animals</h2>
            <ul>
                {animals.map((animal) => (
                    <li key={animal.id}>
                        <Link href={`/animals/${animal.id}`}>
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

