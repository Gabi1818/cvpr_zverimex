"use client";

import { useState } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function ProfilePage() {
    const { data: session } = useSession();
    const router = useRouter();
    console.log(router);

    const [email, setEmail] = useState(session?.user?.email || "");
    const [name, setName] = useState(session?.user?.name || "");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/profile", {
            method: "POST",
            body: JSON.stringify({ email, name, password }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (res.ok) {
            setMessage("Profile updated successfully!");
        } else {
            setMessage(data.error || "Something went wrong.");
        }
    };


    return (
        <div>
            <h1>Update Profile</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>New Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Update Profile</button>
            </form>
            <Link href="/dashboard">Back to Home</Link>
        </div>
    );
}

export default function Profile() {
    return (
        <SessionProvider>
            <ProfilePage />
        </SessionProvider>
    );
}
