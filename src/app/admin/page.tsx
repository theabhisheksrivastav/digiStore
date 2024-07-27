import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import db from "@/db/db";
import { formatNumber, formatCurrency } from "@/lib/formatters";

async function getSalesData(){
    const data = await db.order.aggregate({
        _sum : {pricePaidInPaise : true},
        _count : true
    })
    // await new Promise(resolve => setTimeout(resolve, 2000))
    return  {
        amount : (data._sum.pricePaidInPaise || 0) / 100,
        numberOfSales : data._count
    }
}

async function getUserData(){
    const [userCount, orderData] = await Promise.all([
        db.user.count(),
        db.order.aggregate({
            _sum : {pricePaidInPaise : true}
        })
    ])
    return {
    userCount,
    averageValuePeerUser : userCount === 0 ? 0 : (orderData._sum.pricePaidInPaise || 0) / userCount / 100
    }
}

async function getProductData(){
    const [activeProductCount, inactiveProductCount] = await Promise.all([
        db.product.count({where : {isAvailable : true}}),
        db.product.count({where : {isAvailable : false}})
    ])
    return {
        activeProductCount,
        inactiveProductCount
    }
}


export default async function AdminDashboard(){
    const [salesData, userData, productData] = await Promise.all([getSalesData(), getUserData(), getProductData()]);
    return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AdminDashboardCard title="Customers" subtitle={`${formatCurrency(userData.averageValuePeerUser)} Average Value`} body={formatNumber(userData.userCount)} />
                    
                    
                    <AdminDashboardCard title="Total number of orders" subtitle={`${productData.activeProductCount + productData.inactiveProductCount} total products`} body={formatNumber(productData.activeProductCount)}/>
                    
                    
                    <AdminDashboardCard title="Sales" subtitle={`${formatNumber(salesData.numberOfSales)} Orders`} body={formatCurrency(salesData.amount)} />
                </div>
            </>
    )
}

type AdminDashboardProps = {
    title : string;
    subtitle : string;
    body : string;
}

function AdminDashboardCard({title, subtitle, body} : AdminDashboardProps){
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                {body}
            </CardContent>
        </Card>
    )
}

