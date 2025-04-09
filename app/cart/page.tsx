"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";

export default function CartPage() {
    const { cart, removeFromCart } = useCart();

    return (
        <div>
            <h1>Your Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cart.map((animal) => (
                        <li key={animal.id}>
                            <strong>{animal.name}</strong> - ${animal.price}
                            <button onClick={() => removeFromCart(animal.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <Link href="/dashboard">Back to shop</Link>
        </div>
    );
}
