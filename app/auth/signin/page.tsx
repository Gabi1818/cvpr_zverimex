"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (response?.error) {
                setError(response.error);
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("An error occurred during sign-in:", error);
            setError("Something went wrong. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <p>
                Don&apos;t have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:underline">
                    Sign up here
                </Link>
            </p>

            <hr />

            <button
                onClick={() => signIn("google", { redirect: true })}
                disabled={loading}
            >
                Sign in with Google
            </button>
        </div>
    );
}
