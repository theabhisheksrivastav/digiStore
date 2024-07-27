"use server"

import db from "@/db/db";
import fs from "fs/promises"
import { redirect } from "next/navigation";
import { z } from "zod";

const fileSchema = z.instanceof(File, {message: "File is required"});
const imageSchema = fileSchema.refine((file: File) => file.type.startsWith("image/"), {message: "File should be an image"});

const addSchema = z.object({
    name: z.string().min(3).max(255),
    description: z.string().min(3).max(255),
    priceInPaise: z.coerce.number().int().min(3).positive(),
    file: fileSchema.refine((file: File) => file.size < 1024 * 1024 * 5 && file.size > 0, {message: "File size should be less than 5MB and required"}),
    image: imageSchema.refine((file: File) => file.size < 1024 * 1024 * 5 && file.size > 0, {message: "Image size should be less than 5MB and required"}),
})

export async function addProduct(prevState : unknown, formData: FormData) {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!result.success) {
        return result.error.formErrors.fieldErrors;
    }
    const data = result.data;

    await fs.mkdir("products", {recursive: true});
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

    await fs.mkdir("public/products", {recursive: true});
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));

    db.product.create({
        data: {
            isAvailable: false,
            name: data.name,
            description: data.description,
            priceInPaise: data.priceInPaise,
            filePath,
            imagePath
        }
    })
    redirect("/admin/products");
    
}