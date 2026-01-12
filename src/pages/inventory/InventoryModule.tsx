import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MainLayout from "@/components/layout/MainLayout";
import { Package, Plus, Search, AlertTriangle, TrendingDown, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateInventoryData } from "@/services/systemService";
import { AddInventoryItemForm } from "@/components/inventory/AddInventoryItemForm";

const InventoryModule = () => {
  const [inventoryData, setInventoryData] = useState(generateInventoryData());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const filteredItems = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddItem = () => {
    setShowAddForm(true);
  };

  const handleItemAdded = (newItem: any) => {
    const inventoryItem = {
      ...newItem,
      category: newItem.category_name,
      unit_price: newItem.purchase_price,
      status: newItem.current_stock < newItem.minimum_stock ? 'Low Stock' : 'In Stock'
    };
    
    setInventoryData(prev => [inventoryItem, ...prev]);
    toast({
      title: "Item Added",
      description: `${newItem.name} has been successfully added to inventory.`,
    });
  };

  const handleUpdateStock = (itemId: string, newStock: number) => {
    setInventoryData(prev => prev.map(item => 
      item.id === itemId ? { 
        ...item, 
        current_stock: newStock,
        status: newStock < item.minimum_stock ? 'Low Stock' : 'In Stock'
      } : item
    ));
    toast({
      title: "Stock Updated",
      description: "Inventory stock has been updated successfully.",
    });
  };

  const lowStockItems = inventoryData.filter(item => item.status === 'Low Stock');
  const totalValue = inventoryData.reduce((sum, item) => sum + (item.current_stock * item.unit_price), 0);
  const categories = Array.from(new Set(inventoryData.map(item => item.category)));

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Track and manage medical supplies and equipment
            </p>
          </div>
          <Button onClick={handleAddItem} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add New Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryData.length}</div>
              <p className="text-xs text-muted-foreground">
                Active inventory items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
              <p className="text-xs text-muted-foreground">
                Items need restocking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. {totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Current inventory value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground">
                Item categories
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="In Stock">In Stock</SelectItem>
                        <SelectItem value="Low Stock">Low Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Table */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Items</CardTitle>
                <CardDescription>Manage your medical supplies and equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Min Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.slice(0, 15).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.current_stock}</TableCell>
                          <TableCell>{item.minimum_stock}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>Rs. {item.unit_price}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateStock(item.id, item.current_stock + 10)}
                              >
                                Restock
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Items that need immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current: {item.current_stock} | Minimum: {item.minimum_stock}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateStock(item.id, item.minimum_stock + 20)}
                      >
                        Restock Now
                      </Button>
                    </div>
                  ))}
                  {lowStockItems.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No low stock alerts at the moment</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Reports</CardTitle>
                <CardDescription>View detailed inventory analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Inventory reports and analytics will be displayed here</p>
                  <Button className="mt-4">Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Item Form */}
        <AddInventoryItemForm 
          open={showAddForm}
          onOpenChange={setShowAddForm}
          onItemAdded={handleItemAdded}
        />
      </div>
    </MainLayout>
  );
};

export default InventoryModule;
