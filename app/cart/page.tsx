"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";



export default function CartPage() {
    const { cart, removeFromCart } = useCart();

    return (
        <div className="cart-container">
            <h1 className="cart-header">Your Cart</h1>

            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul className="cart-list">
                    {cart.map((animal) => (
                        <li key={animal.id} className="cart-item">
                            <div><strong>{animal.name}</strong></div>
                            <div className="cart-actions">
                                <div>${animal.price}</div>
                                <button className="cart-remove" onClick={() => removeFromCart(animal.id)}>
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="cart-links">
                <Link href="/order">Finish Order</Link>
                <Link href="/dashboard">Back to Shop</Link>
            </div>
        </div>
    );
}