import db from "@/db/db";
import { notFound } from "next/navigation";
import { CheckoutForm } from "./_components/CheckoutForm";

export default async function PurchasePage({params: {id}}: {params: {id: string}}) {
    const product = await db.product.findUnique({
        where: { id },
        select: { id: true, name: true, priceInPaise: true, description: true, isAvailable: true, imagePath: true },
    });
    console.log(product);
    if (!product || !product.isAvailable) {
        return notFound();
    }

    return (
        <>
            <CheckoutForm product={product} />
        </>
    );
}