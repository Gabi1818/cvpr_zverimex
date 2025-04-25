"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

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
    setCart: React.Dispatch<React.SetStateAction<Animal[]>>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Animal[]>([]);

    // Load cart from localStorage on initial render
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (animal: Animal) => {
        setCart((prev) => [...prev, animal]);
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, setCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
}
