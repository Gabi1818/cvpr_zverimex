import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    try {
        const uploadResponse = await cloudinary.uploader.upload(dataUri, {
            folder: "school-animal-posters", // optional folder name
        });

        return NextResponse.json({ url: uploadResponse.secure_url });
    } catch (err) {
        console.error("Upload failed:", err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
