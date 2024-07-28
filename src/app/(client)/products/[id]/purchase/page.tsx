import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import { Check } from "lucide-react";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from 'razorpay'; 
import { CheckoutForm } from "./_components/CheckoutForm";

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
   });


export default async function PurchasePage({params: {id}}: {params: {id: string}}) {
    const product = await db.product.findUnique({where: {id}});
    if (!product) {
        return notFound();
    }

    const order = await razorpay.orders.create({
        amount: Math.round(product.priceInPaise / 100),
        currency: 'INR',
        receipt: product.id,
        payment_capture: true,
    });

    console.log(order);

    return (
        <>
            <CheckoutForm product={product} orderId={order.id} />
        </>
    );
}