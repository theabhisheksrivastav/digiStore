import db from "@/db/db"
import { Product } from "@prisma/client"
import {Button} from "@/components/ui/button"
import Link from "next/link"
import {ArrowRight} from "lucide-react"
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import { Suspense } from "react"


function getMostPopularProducts() {
    return db.product.findMany({where: {isAvailable: true}, orderBy:{ orders:{_count: 'desc'}}, take: 6})

}

function getNewestProducts() {
    return db.product.findMany({where: {isAvailable: true}, orderBy: {createdAt: 'desc'}, take: 6})
}

export default function HomePage() {
    return (
        <main className="space-y-12">
            <ProductGridSection productsFetcher={getMostPopularProducts} title="Most Popular" />
            <ProductGridSection productsFetcher={getNewestProducts} title="Newest"/>
        </main>
    )
}

type ProductGridSectionProps = {
    title: string
    productsFetcher: () => Promise<Product[]>
}

function ProductGridSection({productsFetcher, title}: ProductGridSectionProps) {
    

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <h2 className="text-3xl font-bold">{title}</h2>
                <Button variant="outline" asChild>
                    <Link href="/products" className="space-x-2"> <span>View All</span>
                    <ArrowRight className="size-4"/></Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Suspense fallback= {
                    <>
                        <ProductCardSkeleton/>
                        <ProductCardSkeleton/>
                        <ProductCardSkeleton/>
                    </>
                }>
                    <ProductsSuspense productsFetcher={productsFetcher}/>
                </Suspense>

            </div>
        </div>
    )

}

async function ProductsSuspense({productsFetcher}: {productsFetcher: () => Promise<Product[]>}) {
 return (await productsFetcher()).map(product => (
    <ProductCard key={Number(product.id)} {...product}/>
)) 
}