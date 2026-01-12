
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, AlertTriangle, Plus, Minus, Search, Filter } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  available: number;
  total: number;
  reserved: number;
  status: "available" | "low" | "critical" | "out-of-stock";
  location: string;
  minThreshold: number;
}

export const SurgicalInventory = () => {
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: "SI-001",
      name: "Laparoscopic Instruments Set",
      category: "Surgical Instruments",
      available: 8,
      total: 10,
      reserved: 2,
      status: "available",
      location: "OT Sterilization",
      minThreshold: 3
    },
    {
      id: "SI-002",
      name: "Cardiac Surgery Kit",
      category: "Specialized Equipment",
      available: 2,
      total: 3,
      reserved: 1,
      status: "low",
      location: "OT-2 Storage",
      minThreshold: 2
    },
    {
      id: "SI-003",
      name: "General Surgery Tools",
      category: "Surgical Instruments",
      available: 15,
      total: 20,
      reserved: 5,
      status: "available",
      location: "Central Supply",
      minThreshold: 5
    },
    {
      id: "SI-004",
      name: "Orthopedic Implants",
      category: "Implants",
      available: 0,
      total: 5,
      reserved: 3,
      status: "critical",
      location: "Secured Storage",
      minThreshold: 2
    },
    {
      id: "SI-005",
      name: "Suture Materials",
      category: "Consumables",
      available: 200,
      total: 250,
      reserved: 50,
      status: "available",
      location: "Supply Room",
      minThreshold: 50
    }
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    total: "",
    location: "",
    minThreshold: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "default";
      case "low": return "secondary";
      case "critical": return "destructive";
      case "out-of-stock": return "outline";
      default: return "outline";
    }
  };

  const getAvailabilityPercentage = (available: number, total: number) => {
    return Math.round((available / total) * 100);
  };

  const updateItemQuantity = (id: string, change: number) => {
    setInventoryItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newAvailable = Math.max(0, item.available + change);
          const newTotal = Math.max(newAvailable + item.reserved, item.total);
          let newStatus: InventoryItem['status'] = "available";
          
          if (newAvailable === 0) {
            newStatus = "critical";
          } else if (newAvailable <= item.minThreshold) {
            newStatus = "low";
          }
          
          return {
            ...item,
            available: newAvailable,
            total: newTotal,
            status: newStatus
          };
        }
        return item;
      })
    );
  };

  const handleAddItem = () => {
    const item: InventoryItem = {
      id: `SI-${String(inventoryItems.length + 1).padStart(3, '0')}`,
      name: newItem.name,
      category: newItem.category,
      available: parseInt(newItem.total),
      total: parseInt(newItem.total),
      reserved: 0,
      status: "available",
      location: newItem.location,
      minThreshold: parseInt(newItem.minThreshold)
    };
    setInventoryItems([...inventoryItems, item]);
    setIsAddItemDialogOpen(false);
    setNewItem({
      name: "",
      category: "",
      total: "",
      location: "",
      minThreshold: ""
    });
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    totalItems: inventoryItems.reduce((sum, item) => sum + item.total, 0),
    availableItems: inventoryItems.reduce((sum, item) => sum + item.available, 0),
    lowStockItems: inventoryItems.filter(item => item.status === "low").length,
    criticalItems: inventoryItems.filter(item => item.status === "critical").length
  };

  const categories = [...new Set(inventoryItems.map(item => item.category))];

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Surgical Inventory</h2>
          <p className="text-sm text-muted-foreground">
            Track surgical instruments, equipment, and supplies
          </p>
        </div>
        <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
              <DialogDescription>
                Add a new item to the surgical inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  placeholder="Enter item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Surgical Instruments">Surgical Instruments</SelectItem>
                    <SelectItem value="Specialized Equipment">Specialized Equipment</SelectItem>
                    <SelectItem value="Implants">Implants</SelectItem>
                    <SelectItem value="Consumables">Consumables</SelectItem>
                    <SelectItem value="Monitoring Equipment">Monitoring Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="total">Total Quantity</Label>
                  <Input
                    id="total"
                    type="number"
                    placeholder="0"
                    value={newItem.total}
                    onChange={(e) => setNewItem({...newItem, total: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="threshold">Min Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    placeholder="0"
                    value={newItem.minThreshold}
                    onChange={(e) => setNewItem({...newItem, minThreshold: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Storage location"
                  value={newItem.location}
                  onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={handleAddItem} className="w-full">
              Add Item to Inventory
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Inventory Overview */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Now</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.availableItems}</div>
            <p className="text-xs text-muted-foreground">
              Ready for use
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Requires restocking
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.criticalItems}</div>
            <p className="text-xs text-muted-foreground">
              Immediate attention needed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {(stats.criticalItems > 0 || stats.lowStockItems > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Critical Inventory Alerts</CardTitle>
            <CardDescription className="text-sm">Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventoryItems
                .filter(item => item.status === "critical")
                .map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-red-900">
                        {item.name} - {item.available === 0 ? "Out of Stock" : "Critical Level"}
                      </div>
                      <div className="text-xs text-red-700">
                        {item.available} available, {item.reserved} reserved
                      </div>
                      <Button size="sm" variant="destructive" className="mt-2">
                        Emergency Order
                      </Button>
                    </div>
                  </div>
                ))}
              
              {inventoryItems
                .filter(item => item.status === "low")
                .slice(0, 2)
                .map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-yellow-900">
                        {item.name} - Low Stock
                      </div>
                      <div className="text-xs text-yellow-700">
                        {item.available} available, below minimum threshold of {item.minThreshold}
                      </div>
                      <Button size="sm" variant="outline" className="mt-2">
                        Reorder
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">Search & Filter Inventory</CardTitle>
              <CardDescription className="text-sm">Find specific items in inventory</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-48"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Inventory Items Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Surgical Inventory Items</CardTitle>
          <CardDescription className="text-sm">
            Detailed view of all surgical instruments and supplies ({filteredItems.length} items)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Item ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="hidden md:table-cell">Total</TableHead>
                  <TableHead className="hidden lg:table-cell">Reserved</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden xl:table-cell">Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{item.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{item.available}</span>
                        <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${
                              getAvailabilityPercentage(item.available, item.total) > 50 ? 'bg-green-600' :
                              getAvailabilityPercentage(item.available, item.total) > 20 ? 'bg-yellow-600' :
                              'bg-red-600'
                            }`}
                            style={{width: `${getAvailabilityPercentage(item.available, item.total)}%`}}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{item.total}</TableCell>
                    <TableCell className="hidden lg:table-cell">{item.reserved}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">{item.location}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, -1)}
                          disabled={item.available === 0}
                        >
                          <Minus className="h-3 w-3" />
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

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Quick Reserve</CardTitle>
            <CardDescription className="text-sm">Reserve items for upcoming surgeries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start text-sm">
              Reserve for Emergency Surgery
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              Reserve for Scheduled Procedure
            </Button>
            <Button variant="outline" className="w-full justify-start text-sm">
              View All Reservations
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Sterilization Status</CardTitle>
            <CardDescription className="text-sm">Track instrument sterilization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span>In Sterilization</span>
              <Badge variant="secondary">12 items</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Ready for Use</span>
              <Badge>45 items</Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Awaiting Sterilization</span>
              <Badge variant="outline">8 items</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Maintenance Schedule</CardTitle>
            <CardDescription className="text-sm">Upcoming equipment maintenance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <div className="font-medium">This Week</div>
              <div className="text-muted-foreground">Laparoscope calibration</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Next Week</div>
              <div className="text-muted-foreground">Cardiac monitor service</div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
