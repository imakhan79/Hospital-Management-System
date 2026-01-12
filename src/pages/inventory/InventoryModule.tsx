
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MainLayout from "@/components/layout/MainLayout";
import { Package, Plus, Search, AlertTriangle, TrendingDown, BarChart, ChevronRight, PieChart, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateInventoryData } from "@/services/systemService";
import { AddInventoryItemForm } from "@/components/inventory/AddInventoryItemForm";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const InventoryModule = () => {
  const [activeTab, setActiveTab] = useState("all-stock");
  const [inventoryData, setInventoryData] = useState(generateInventoryData());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  const menuItems = [
    { value: "all-stock", label: "Stock Registry", icon: <Package className="w-4 h-4" /> },
    { value: "alerts", label: "Procurement", icon: <AlertTriangle className="w-4 h-4" /> },
    { value: "reports", label: "Inventory Logic", icon: <Layers className="w-4 h-4" /> },
  ];

  const filteredItems = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Low Stock': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
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
      title: "Stock Reconciled",
      description: `${newItem.name} added to repository.`,
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
      title: "Inventory Synced",
      description: "Item quantities updated successfully.",
    });
  };

  const lowStockItems = inventoryData.filter(item => item.status === 'Low Stock');
  const totalValue = inventoryData.reduce((sum, item) => sum + (item.current_stock * item.unit_price), 0);
  const categories = Array.from(new Set(inventoryData.map(item => item.category)));

  return (
    <MainLayout noPadding>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50/50">
        {/* Column 2: Inventory Submenu panel */}
        <aside className="w-72 flex-shrink-0 bg-white border-r shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 hidden md:flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Inventory</h2>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    activeTab === item.value
                      ? "bg-slate-100 text-slate-900 border-l-4 border-slate-900 rounded-l-none"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      activeTab === item.value ? "bg-white shadow-sm" : "bg-slate-100/50 group-hover:bg-slate-100"
                    )}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {activeTab === item.value && <ChevronRight className="w-4 h-4 opacity-50" />}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Button onClick={handleAddItem} variant="outline" className="w-full justify-start gap-2 border-slate-200 hover:bg-slate-50 shadow-sm h-11 rounded-xl font-bold text-xs">
                <Plus className="h-4 w-4" />
                CREATE ENTRY
              </Button>
            </div>
          </div>

          <div className="mt-auto p-4 m-4 rounded-2xl bg-zinc-900 text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-wider font-bold opacity-60">Supply Chain</p>
              <h3 className="text-lg font-bold mt-1">Audit Status</h3>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[100%]"></div>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Verified</span>
              </div>
            </div>
            <Package className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 rotate-12 text-white" />
          </div>
        </aside>

        {/* Column 3: Main Content area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                  {activeTab === 'all-stock' ? 'Global Registry' :
                    activeTab === 'alerts' ? 'Supply Shortages' :
                      'Logistics Dashboard'}
                </h1>
                <p className="text-slate-500 font-medium">
                  Real-time medical supply tracking and procurement optimization.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live SKUs</CardTitle>
                    <div className="p-2 bg-slate-50 text-slate-600 rounded-lg group-hover:scale-110 transition-transform">
                      <Package className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">{inventoryData.length}</div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Active Database</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-red-500">Stock Alerts</CardTitle>
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:scale-110 transition-transform">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-red-600">{lowStockItems.length}</div>
                    <p className="text-[10px] text-red-400 font-bold mt-1 uppercase tracking-widest italic font-bold">Require restock</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Asset Value</CardTitle>
                    <div className="p-2 bg-slate-50 text-slate-600 rounded-lg group-hover:scale-110 transition-transform">
                      <BarChart className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">Rs. {totalValue.toLocaleString()}</div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Total Valuation</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Classifications</CardTitle>
                    <div className="p-2 bg-slate-50 text-slate-600 rounded-lg group-hover:scale-110 transition-transform">
                      <TrendingDown className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">{categories.length}</div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Unique Groups</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {activeTab === 'all-stock' && (
                  <>
                    <Card className="bg-white border-white shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="Filter items by serial number or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11 border-slate-100 bg-slate-50/50 focus:bg-white rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Select value={filterCategory} onValueChange={setFilterCategory}>
                              <SelectTrigger className="w-full sm:w-[180px] h-11 border-slate-100 rounded-xl">
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Groups</SelectItem>
                                {categories.map(category => (
                                  <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                              <SelectTrigger className="w-full sm:w-[150px] h-11 border-slate-100 rounded-xl">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Any Status</SelectItem>
                                <SelectItem value="In Stock">In Stock</SelectItem>
                                <SelectItem value="Low Stock">Low Stock</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-white shadow-sm overflow-hidden rounded-2xl">
                      <Table>
                        <TableHeader className="bg-slate-50/50">
                          <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Designation</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Category</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">Available</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">Threshold</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">Status</TableHead>
                            <TableHead className="text-right font-black uppercase text-[10px] tracking-widest text-slate-500 pr-6">Cost / Unit</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.slice(0, 15).map((item) => (
                            <TableRow key={item.id} className="hover:bg-slate-50/30 border-slate-50 transition-colors">
                              <TableCell className="py-4 font-black text-slate-800 uppercase tracking-tight text-sm">{item.name}</TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-0 text-[10px] rounded-lg h-5 font-bold">{item.category}</Badge>
                              </TableCell>
                              <TableCell className="text-center font-bold text-slate-900">{item.current_stock}</TableCell>
                              <TableCell className="text-center text-slate-400 font-medium">{item.minimum_stock}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className={cn("border-0 font-bold px-3 py-1 rounded-full text-[10px]", getStatusColor(item.status))}>
                                  {item.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right pr-6 font-mono text-xs font-bold text-slate-500">Rs. {item.unit_price}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </>
                )}

                {activeTab === 'alerts' && (
                  <div className="grid gap-4">
                    {lowStockItems.map((item) => (
                      <Card key={item.id} className="bg-white border-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden rounded-2xl group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                        <CardContent className="p-6 flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                              <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{item.name}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Current: <span className="text-red-600">{item.current_stock}</span> / REQ: {item.minimum_stock}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" className="h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] tracking-widest px-6 shadow-lg" onClick={() => handleUpdateStock(item.id, item.minimum_stock + 20)}>RESTOCK REQUISITION</Button>
                        </CardContent>
                      </Card>
                    ))}
                    {lowStockItems.length === 0 && (
                      <div className="text-center py-12 bg-white rounded-2xl border-white shadow-sm">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">All stock levels optimized. No pending alerts.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reports' && (
                  <Card className="bg-white border-white shadow-sm overflow-hidden rounded-2xl h-[400px]">
                    <CardContent className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-20 h-20 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6">
                        <PieChart className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Supply Chain Intelligence</h3>
                      <p className="text-slate-500 max-w-sm mt-3 font-medium text-sm">
                        Predictive restock algorithms and consumption trend analysis is currently being updated for the current fiscal period.
                      </p>
                      <Button className="mt-8 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 border-0 font-bold px-8 h-12 text-[10px] tracking-widest">INITIALIZE AUDIT</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>

      <AddInventoryItemForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onItemAdded={handleItemAdded}
      />
    </MainLayout>
  );
};

export default InventoryModule;
