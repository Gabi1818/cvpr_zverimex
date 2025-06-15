import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Animal = {
    id: string;
    name: string;
    price: number;
    age: number;
    category: string;
    available: boolean;
};

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { name, address, phone, payment, cart } = body;

    if (!name || !address || !phone || !payment || !cart || cart.length === 0) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    try {
        const order = await prisma.order.create({
            data: {
                name,
                address,
                phone,
                payment,
                items: {
                    create: cart.map((animal: Animal) => ({
                        animalId: animal.id,
                        name: animal.name,
                        price: animal.price,
                    })),
                },
            },
        });

        return NextResponse.json({ message: "Order placed", order });
    } catch (err) {
        console.error("Order creation error:", err);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
