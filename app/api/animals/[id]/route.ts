import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    //{ params }: { params: { id: string } }
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    try {
        const animal = await prisma.animal.findUnique({
            where: { id },
        });

        if (!animal) {
            return NextResponse.json({ error: "Animal not found" }, { status: 404 });
        }

        return NextResponse.json(animal);
    } catch (error) {
        console.error("Error fetching animal:", error);
        return NextResponse.json({ error: "Failed to fetch animal" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    try {
        await prisma.animal.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting animal:", error);
        return NextResponse.json({ error: "Failed to delete animal" }, { status: 500 });
    }
}