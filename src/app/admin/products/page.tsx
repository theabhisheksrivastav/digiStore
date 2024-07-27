import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from 'next/link';
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropdownMenuItem } from "./_components/ProductActions";

export default function AdminProductsPage() {
    return (
        <>
            <div className="flex justify-between items-center gap-4">
                <PageHeader>Products</PageHeader>
                <Button asChild>
                    <Link href="/admin/products/new">Add New Product</Link>
                </Button>
            </div>
            <ProductTable />
        </>
    );
}

async function ProductTable() {
    const products = await db.product.findMany({select: {id: true, name: true, priceInPaise: true, isAvailable: true, _count: {select: {orders: true}}},
    orderBy: {name: 'asc'}});

    
    if(products.length === 0) {
        return <div>No products found</div>
    }

    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-0">
                    <span className="sr-only">Available For Purchase</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="w-0">
                    <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {products.map(product => (
                <TableRow key={product.id}>
                    <TableCell>
                        {product.isAvailable ?( <>
                            <span className="sr-only"> Available </ span> ✅
                        </>)
                        : ( <>
                            <span className="sr-only"> Not Available </ span> ❌
                        </>)}
                    </TableCell>
                    <TableCell>
                        {product.name}
                    </TableCell>
                    <TableCell>
                        {formatCurrency(product.priceInPaise / 100)}
                    </TableCell>
                    <TableCell>
                        {formatNumber(product._count.orders)}
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreVertical />
                                <span className="sr-only">Actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <a href={`/admin/products/${product.id}/download`}>
                                    Download
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                                </DropdownMenuItem>
                                <ActiveToggleDropdownItem id={product.id} isAvailable={product.isAvailable} />
                                <DropdownMenuSeparator />
                                <DeleteDropdownMenuItem id={product.id} disabled={product._count.orders > 0} />
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
}