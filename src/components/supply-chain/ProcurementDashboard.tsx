
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, FileText, Calendar, DollarSign, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NewPurchaseOrderForm } from "./NewPurchaseOrderForm";

interface PurchaseOrder {
  id: string;
  supplier: string;
  items: string[];
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Confirmed' | 'Received' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  orderDate: string;
  expectedDate: string;
  actualDate?: string;
  requestedBy: string;
  department: string;
}

export function ProcurementDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const { toast } = useToast();

  const purchaseOrders: PurchaseOrder[] = [
    {
      id: "PO-2024-001",
      supplier: "MedSupply Corporation",
      items: ["Surgical Masks (5000 pcs)", "Nitrile Gloves (2000 pairs)", "Disposable Syringes (1000 pcs)"],
      totalAmount: 45000,
      status: "Confirmed",
      priority: "High",
      orderDate: "2024-01-20",
      expectedDate: "2024-01-25",
      requestedBy: "Dr. Amit Sharma",
      department: "Surgery"
    },
    {
      id: "PO-2024-002",
      supplier: "PharmaCo Limited",
      items: ["Amoxicillin 500mg (500 tablets)", "Paracetamol 500mg (1000 tablets)", "Omeprazole 20mg (200 capsules)"],
      totalAmount: 125000,
      status: "Sent",
      priority: "Medium",
      orderDate: "2024-01-19",
      expectedDate: "2024-01-28",
      requestedBy: "Dr. Priya Patel",
      department: "Pharmacy"
    },
    {
      id: "PO-2024-003",
      supplier: "EquipTech Solutions",
      items: ["X-Ray Film (100 sheets)", "Ultrasound Gel (20 bottles)", "ECG Electrodes (500 pcs)"],
      totalAmount: 85000,
      status: "Completed",
      priority: "Low",
      orderDate: "2024-01-15",
      expectedDate: "2024-01-22",
      actualDate: "2024-01-21",
      requestedBy: "Dr. Rajesh Kumar",
      department: "Radiology"
    },
    {
      id: "PO-2024-004",
      supplier: "LabChem Industries",
      items: ["Blood Test Reagents", "Urine Analysis Strips (500 pcs)", "Microscope Slides (1000 pcs)"],
      totalAmount: 67000,
      status: "Received",
      priority: "High",
      orderDate: "2024-01-18",
      expectedDate: "2024-01-26",
      actualDate: "2024-01-24",
      requestedBy: "Dr. Neha Singh",
      department: "Laboratory"
    },
    {
      id: "PO-2024-005",
      supplier: "SurgiTools Pvt Ltd",
      items: ["Surgical Forceps (10 sets)", "Scalpel Blades (100 pcs)", "Suture Materials"],
      totalAmount: 95000,
      status: "Draft",
      priority: "Urgent",
      orderDate: "2024-01-22",
      expectedDate: "2024-01-30",
      requestedBy: "Dr. Vikram Rao",
      department: "Surgery"
    }
  ];

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesPriority = filterPriority === "all" || order.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Received': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-indigo-100 text-indigo-800';
      case 'Sent': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'Received': return <FileText className="h-4 w-4" />;
      case 'Confirmed': return <Calendar className="h-4 w-4" />;
      case 'Sent': return <Clock className="h-4 w-4" />;
      case 'Draft': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const stats = {
    totalOrders: purchaseOrders.length,
    totalValue: purchaseOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    pending: purchaseOrders.filter(o => ['Draft', 'Sent', 'Confirmed'].includes(o.status)).length,
    completed: purchaseOrders.filter(o => o.status === 'Completed').length
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
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Procurement Dashboard</h2>
        <Button onClick={() => setShowNewOrderForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search purchase orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>Manage procurement requests and orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Expected Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.supplier}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium">{order.items.length} items</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {order.items[0]}
                          {order.items.length > 1 && ` +${order.items.length - 1} more`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.department}</TableCell>
                    <TableCell className="text-right">PKR {order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(order.expectedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        {order.status === 'Draft' && (
                          <Button size="sm">Send</Button>
                        )}
                        {order.status === 'Received' && (
                          <Button size="sm">Complete</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Purchase Order Form Modal */}
      {showNewOrderForm && (
        <NewPurchaseOrderForm
          onClose={() => setShowNewOrderForm(false)}
          onSave={handleNewPurchaseOrder}
        />
      )}
    </div>
  );
}
