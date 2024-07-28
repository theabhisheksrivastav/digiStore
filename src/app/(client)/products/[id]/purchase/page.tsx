import db from "@/db/db";
import { notFound } from "next/navigation";
import { CheckoutForm } from "./_components/CheckoutForm";

export default async function PurchasePage({params: {id}}: {params: {id: string}}) {
    const product = await db.product.findUnique({where: {id}});
    if (!product) {
        return notFound();
    }

    return (
        <>
            <CheckoutForm product={product} />
        </>
    );
}