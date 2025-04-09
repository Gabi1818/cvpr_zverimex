"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Animal = {
    id: string;
    name: string;
    price: number;
    age: number;
    category: string;
    available: boolean;
};

type CartContextType = {
    cart: Animal[];
    addToCart: (animal: Animal) => void;
    removeFromCart: (id: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Animal[]>([]);

    const addToCart = (animal: Animal) => {
        setCart((prev) => [...prev, animal]);
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}
