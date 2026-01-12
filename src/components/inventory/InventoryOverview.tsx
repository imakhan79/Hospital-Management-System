
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Package, Loader2 } from "lucide-react";
import { fetchInventoryItems } from "@/services/inventoryService";

export function InventoryOverview() {
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<any[]>([]);
  const [inventorySummary, setInventorySummary] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStockCount: 0,
    expiringCount: 0
  });

  useEffect(() => {
    async function fetchInventoryData() {
      try {
        // Fetch inventory items from the service
        const items = await fetchInventoryItems();

        // Process category counts
        const categoryMap = new Map();
        items.forEach(item => {
          const category = item.category_name;
          if (!categoryMap.has(category)) {
            categoryMap.set(category, 0);
          }
          categoryMap.set(category, categoryMap.get(category) + 1);
        });
        
        const catCounts = Array.from(categoryMap.entries()).map(([name, count]) => ({
          name,
          count
        }));
        
        // Calculate totals
        const totalValue = items.reduce((sum, item) => {
          return sum + (item.current_stock * (item.purchase_price || 0));
        }, 0);

        const lowStockCount = items.filter(item => item.current_stock < item.minimum_stock).length;
        
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);
        
        const expiringCount = items.filter(item => {
          if (!item.expiry_date) return false;
          const expiryDate = new Date(item.expiry_date);
          return expiryDate <= thirtyDaysFromNow && expiryDate >= now;
        }).length;

        // Set the low stock items
        const lowStockItemsData = items
          .filter(item => item.current_stock < item.minimum_stock)
          .slice(0, 5)
          .map(item => ({
            name: item.name,
            current: item.current_stock,
            minimum: item.minimum_stock,
            percentage: Math.max(0, Math.min(100, (item.current_stock / item.minimum_stock) * 100))
          }));

        setLowStockItems(lowStockItemsData);
        setCategoryCounts(catCounts.sort((a, b) => b.count - a.count).slice(0, 8));
        setInventorySummary({
          totalItems: items.length,
          totalValue: totalValue,
          lowStockCount,
          expiringCount
        });
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInventoryData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57'];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <div className="text-2xl font-bold">{inventorySummary.totalItems.toLocaleString()}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <div className="text-2xl font-bold">${inventorySummary.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 6h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <div className="text-2xl font-bold text-amber-500">{inventorySummary.lowStockCount}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <div className="text-2xl font-bold text-red-500">{inventorySummary.expiringCount}</div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Items by Category</CardTitle>
          <CardDescription>Distribution of inventory items across categories</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryCounts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>Number of items in each category</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Low Stock Items</CardTitle>
          <CardDescription>Items below minimum stock level</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : lowStockItems.length > 0 ? (
            <div className="space-y-5">
              {lowStockItems.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground">{item.current} / {item.minimum} units</div>
                  </div>
                  <Progress 
                    value={item.percentage} 
                    className="h-2" 
                    indicatorClassName={item.percentage < 50 ? "bg-red-500" : item.percentage < 75 ? "bg-amber-500" : "bg-green-500"} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">No low stock items found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
