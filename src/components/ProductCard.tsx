import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
    id: string
    name: string
    priceInPaise: number
    description: string
    imagePath: string
}

export function ProductCard ({id, name, priceInPaise, description, imagePath}: ProductCardProps) {
    return (
    <Card className="flex overflow-hidden flex-col">
        <div className="relative w-full h-auto aspect-video">
             <Image src={imagePath} fill alt={name} />
        </div>
        <CardHeader>
            <CardTitle>
                {name}
            </CardTitle>
            <CardDescription>
                {formatCurrency(priceInPaise / 100)}
            </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="line-clamp-4">{description}</p>
        </CardContent>
        <CardFooter>
            <Button asChild size="lg" className="w-full">
                <Link href={`/products/${id}/purchase`}>
                Purchase
                </Link>
            </Button>        
        </CardFooter>
    </Card>
    )
}

export function ProductCardSkeleton() {
    return (
        <Card className="flex overflow-hidden flex-col animate-pulse">
            <div className="relative w-full h-48 bg-gray-200 animate-pulse">
            </div>
            <CardHeader>
                <CardTitle>
                    <div className="w-3/4 h-6 bg-gray-200 animate-pulse"></div>
                </CardTitle>
                <CardDescription>
                    <div className="w-1/4 h-4 bg-gray-200 animate-pulse"></div>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="w-full h-12 bg-gray-200 animate-pulse"></div>
            </CardContent>
            <CardFooter>
                <Button asChild size="lg" className="w-full">
                    <div className="w-1/2 h-8 bg-gray-200 animate-pulse"></div>
                </Button>        
            </CardFooter>
        </Card>
    )
}