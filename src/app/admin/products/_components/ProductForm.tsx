"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/formatters"
import { useState } from "react"
import { addProduct } from "../../_actions/products"
import { useFormState, useFormStatus } from "react-dom"

export function ProductForm() {
    const [priceInPaise, setPriceInPaise] = useState<number>()
    const [error, action] = useFormState(addProduct, {})

    return (
        <form action={action} className="space-y-8">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" required />
                {error.name && <div className="text-destructive">{error.name}</div>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="priceInPaise">Price In Paise</Label>
                <Input type="number" id="priceInPaise" name="priceInPaise" required value={priceInPaise} onChange={e => setPriceInPaise(Number(e.target.value) || undefined)} />
                <div className="text-muted-foreground">{formatCurrency((priceInPaise || 0)/ 100)}</div>
                {error.priceInPaise && <div className="text-destructive">{error.priceInPaise}</div>}

            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
                {error.description && <div className="text-destructive">{error.description}</div>}

            </div>
            <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input type="file" id="file" name="file" required />
                {error.file && <div className="text-destructive">{error.file}</div>}

            </div>
            <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input type="file" id="image" name="image" required />
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
            <Button type="reset" disabled= {pending}>Cancel</Button>
        </div>
    )
}