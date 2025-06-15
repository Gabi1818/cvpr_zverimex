import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.isAdmin) {
        return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { name, price, category, age, available, image } = body;

        const animal = await prisma.animal.create({
            data: {
                name,
                price: Number(price),
                category,
                age: Number(age),
                available,
                image: image || null,
            },
        });

        return NextResponse.json(animal);
    } catch (error) {
        console.error("Error creating animal:", error);
        return NextResponse.json({ error: "Failed to create animal." }, { status: 500 });
    }
}
export async function GET() {
    try {
        const animals = await prisma.animal.findMany();
        return NextResponse.json(animals);
    } catch (error) {
        console.error("Error fetching animals:", error);
        return NextResponse.json({ error: "Failed to fetch animals" }, { status: 500 });
    }
}
