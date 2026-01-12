
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Truck, 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Users,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SupplierManagement } from "@/components/supply-chain/SupplierManagement";
import { ProcurementDashboard } from "@/components/supply-chain/ProcurementDashboard";
import { DeliveryTracking } from "@/components/supply-chain/DeliveryTracking";
import { NewPurchaseOrderForm } from "@/components/supply-chain/NewPurchaseOrderForm";

interface SupplyChainStats {
  totalSuppliers: number;
  activePurchaseOrders: number;
  pendingDeliveries: number;
  totalValue: number;
  onTimeDeliveryRate: number;
  criticalSupplies: number;
}

const SupplyChainModule = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const { toast } = useToast();

  const stats: SupplyChainStats = {
    totalSuppliers: 45,
    activePurchaseOrders: 12,
    pendingDeliveries: 8,
    totalValue: 2450000,
    onTimeDeliveryRate: 92.5,
    criticalSupplies: 3
  };

  const recentOrders = [
    {
      id: "PO-001",
      supplier: "MedSupply Corp",
      items: "Surgical Masks, Gloves",
      amount: 45000,
      status: "In Transit",
      expectedDate: "2024-01-25"
    },
    {
      id: "PO-002", 
      supplier: "PharmaCo Ltd",
      items: "Antibiotics, Pain Relievers",
      amount: 125000,
      status: "Processing",
      expectedDate: "2024-01-28"
    },
    {
      id: "PO-003",
      supplier: "EquipTech Solutions",
      items: "X-Ray Film, Lab Reagents", 
      amount: 85000,
      status: "Delivered",
      expectedDate: "2024-01-22"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewPurchaseOrder = (order: any) => {
    console.log('New purchase order created:', order);
    toast({
      title: "Purchase Order Created",
      description: `Purchase order ${order.id} has been created successfully`,
    });
    setShowNewOrderForm(false);
  };

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Supply Chain Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Comprehensive supplier and procurement management system
            </p>
          </div>
          <Button 
            className="w-full sm:w-auto"
            onClick={() => setShowNewOrderForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Purchase Order
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
              <p className="text-xs text-muted-foreground">
                Active partnerships
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active POs</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activePurchaseOrders}</div>
              <p className="text-xs text-muted-foreground">
                Purchase orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Deliveries</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingDeliveries}</div>
              <p className="text-xs text-muted-foreground">
                In transit
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">PKR {stats.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Monthly procurement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.onTimeDeliveryRate}%</div>
              <p className="text-xs text-muted-foreground">
                Delivery performance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Supplies</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.criticalSupplies}</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="procurement">Procurement</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Recent Purchase Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Purchase Orders</CardTitle>
                  <CardDescription>Latest procurement activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{order.id}</div>
                          <div className="text-sm text-muted-foreground">{order.supplier}</div>
                          <div className="text-xs text-muted-foreground">{order.items}</div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-medium">PKR {order.amount.toLocaleString()}</div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Critical Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Supply Chain Alerts</CardTitle>
                  <CardDescription>Items requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <div className="font-medium text-red-800">Oxygen Cylinders Low Stock</div>
                        <div className="text-sm text-red-600">Only 5 units remaining</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="font-medium text-yellow-800">Delayed Delivery</div>
                        <div className="text-sm text-yellow-600">PO-004 from MedTech Solutions</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <MapPin className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="font-medium text-orange-800">Supplier Review Required</div>
                        <div className="text-sm text-orange-600">Annual assessment due for 3 suppliers</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <SupplierManagement />
          </TabsContent>

          <TabsContent value="procurement" className="space-y-4">
            <ProcurementDashboard />
          </TabsContent>

          <TabsContent value="tracking" className="space-y-4">
            <DeliveryTracking />
          </TabsContent>
        </Tabs>

        {/* New Purchase Order Form Modal */}
        {showNewOrderForm && (
          <NewPurchaseOrderForm
            onClose={() => setShowNewOrderForm(false)}
            onSave={handleNewPurchaseOrder}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default SupplyChainModule;
