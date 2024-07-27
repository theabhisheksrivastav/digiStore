"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/formatters"
import { useState } from "react"
import { addProduct, updateProduct } from "../../_actions/products"
import { useFormState, useFormStatus } from "react-dom"
import { Product } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

export function ProductForm({product}: {product?: Product | null}) {
    const [priceInPaise, setPriceInPaise] = useState<number>(product?.priceInPaise || 0)
    const [error, action] = useFormState(product == null ? addProduct : updateProduct.bind(null, product.id), {})

    return (
        <form action={action} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" required defaultValue={product?.name || ""}/>
                {error.name && <div className="text-destructive">{error.name}</div>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="priceInPaise">Price In Paise</Label>
                <Input type="number" id="priceInPaise" name="priceInPaise" required value={priceInPaise} onChange={e => setPriceInPaise(Number(e.target.value) || 0)} />
                <div className="text-muted-foreground">{formatCurrency((priceInPaise || 0)/ 100)}</div>
                {error.priceInPaise && <div className="text-destructive">{error.priceInPaise}</div>}

            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required defaultValue={product?.description || ""}/>
                {error.description && <div className="text-destructive">{error.description}</div>}

            </div>
            <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input type="file" id="file" name="file" required={product == null} />
                {product != null && <div className="text-muted-foreground">Leave empty to keep the existing file - {product.filePath.split('-').pop()}</div>}
                {error.file && <div className="text-destructive">{error.file}</div>}

            </div>
            <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input type="file" id="image" name="image" required={product == null} />
                {product != null && <Image src={product.imagePath} width={300} height={300} alt="product-image"/>}
                {error.image && <div className="text-destructive">{error.image}</div>}

            </div>
            <ProductFormActions />
        </form>
    )
}

function ProductFormActions() {
    const {pending} = useFormStatus()
    return (
        <div className="flex justify-end gap-4">
            <Button type="submit" disabled= {pending}>{pending ? "Saving..." : "Save"}</Button>
            <Button type="reset" disabled= {pending} asChild>
                <Link href="/admin/products"> Cancel</Link>
            </Button>
        </div>
    )
}