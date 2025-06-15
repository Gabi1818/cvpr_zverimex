"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md space-y-6">
                <h1 className="text-2xl font-semibold text-center">Sign In</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/signup" className="text-blue-600 hover:underline">
                        Sign up here
                    </Link>
                </p>

                <Button
                    variant="outline"
                    className="w-full text-black"
                    onClick={() => signIn("google", { redirect: true })}
                    disabled={loading}
                >
                    Sign in with Google
                </Button>
            </div>
        </div>
    );
}
