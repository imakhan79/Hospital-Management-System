
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Calendar, FileText, TestTube, Pill } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateSystemPatients, generateLabTestData } from "@/services/systemService";
import { CreateUnifiedOrderForm } from "./CreateUnifiedOrderForm";

interface UnifiedOrder {
  id: string;
  patient_id: string;
  patient_name: string;
  order_type: 'lab' | 'pharmacy';
  item_name: string;
  status: 'Pending' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';
  priority: 'Normal' | 'Urgent' | 'STAT';
  ordered_date: string;
  ordered_by: string;
  department: string;
  notes?: string;
  quantity?: number;
  dosage?: string;
  instructions?: string;
}

export function IntegratedOrderManagement() {
  const [orders, setOrders] = useState<UnifiedOrder[]>([]);
  const [patients] = useState(generateSystemPatients());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  // Generate mock unified orders
  useEffect(() => {
    const labTests = generateLabTestData();
    const pharmacyOrders = generatePharmacyOrders();
    
    const unifiedOrders: UnifiedOrder[] = [
      ...labTests.map(test => ({
        id: test.id,
        patient_id: test.patient_id,
        patient_name: test.patient_name,
        order_type: 'lab' as const,
        item_name: test.test_type,
        status: test.status as any,
        priority: test.priority as any,
        ordered_date: test.ordered_date,
        ordered_by: test.requested_by,
        department: 'Laboratory',
        notes: test.special_instructions || undefined
      })),
      ...pharmacyOrders
    ];

    setOrders(unifiedOrders.sort((a, b) => new Date(b.ordered_date).getTime() - new Date(a.ordered_date).getTime()));
  }, []);

  const generatePharmacyOrders = (): UnifiedOrder[] => {
    const medications = [
      'Paracetamol 500mg', 'Amoxicillin 250mg', 'Metformin 500mg', 'Lisinopril 10mg',
      'Atorvastatin 20mg', 'Omeprazole 20mg', 'Aspirin 75mg', 'Insulin Rapid'
    ];
    const statuses: UnifiedOrder['status'][] = ['Pending', 'Processing', 'Ready', 'Completed'];
    const priorities: UnifiedOrder['priority'][] = ['Normal', 'Urgent', 'STAT'];
    const doctors = ['Dr. Ahmed Ali', 'Dr. Fatima Shah', 'Dr. Hassan Malik', 'Dr. Ayesha Khan'];

    return Array.from({ length: 25 }, (_, i) => {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 14));

      return {
        id: `pharmacy-${i + 1}`,
        patient_id: patient.id,
        patient_name: patient.name,
        order_type: 'pharmacy',
        item_name: medications[Math.floor(Math.random() * medications.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        ordered_date: orderDate.toISOString(),
        ordered_by: doctors[Math.floor(Math.random() * doctors.length)],
        department: 'Pharmacy',
        quantity: Math.floor(Math.random() * 30) + 1,
        dosage: ['1 tablet daily', '2 tablets twice daily', '1 tablet morning', '1 tablet evening'][Math.floor(Math.random() * 4)],
        instructions: Math.random() > 0.5 ? 'Take with food' : 'Take on empty stomach'
      };
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.ordered_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesType = filterType === "all" || order.order_type === filterType;
    const matchesPriority = filterPriority === "all" || order.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Ready': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'STAT': return 'bg-red-100 text-red-800';
      case 'Urgent': return 'bg-orange-100 text-orange-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateOrder = (newOrder: Omit<UnifiedOrder, 'id'>) => {
    const order: UnifiedOrder = {
      ...newOrder,
      id: `order-${Date.now()}`
    };
    
    setOrders(prev => [order, ...prev]);
    toast({
      title: "Order Created",
      description: `${order.order_type === 'lab' ? 'Lab test' : 'Medication'} order created successfully.`,
    });
  };

  const handleUpdateStatus = (orderId: string, newStatus: UnifiedOrder['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast({
      title: "Status Updated",
      description: `Order status updated to ${newStatus}`,
    });
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    ready: orders.filter(o => o.status === 'Ready').length,
    lab: orders.filter(o => o.order_type === 'lab').length,
    pharmacy: orders.filter(o => o.order_type === 'pharmacy').length
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrated Order Management</h1>
          <p className="text-muted-foreground">
            Unified management for laboratory tests and pharmacy orders
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create New Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.processing}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready</CardTitle>
            <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.ready}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Orders</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.lab}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pharmacy Orders</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.pharmacy}</div>
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
                  placeholder="Search orders, patients, or doctors..."
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lab">Laboratory</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="STAT">STAT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Unified view of laboratory and pharmacy orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Item/Test</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Ordered By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.slice(0, 20).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.patient_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {order.order_type === 'lab' ? (
                          <TestTube className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Pill className="h-4 w-4 text-purple-600" />
                        )}
                        <span className="capitalize">{order.order_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.item_name}</div>
                        {order.quantity && (
                          <div className="text-sm text-muted-foreground">
                            Qty: {order.quantity} {order.dosage && `| ${order.dosage}`}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.ordered_by}</TableCell>
                    <TableCell>{new Date(order.ordered_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {order.status === 'Pending' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUpdateStatus(order.id, 'Processing')}
                          >
                            Start
                          </Button>
                        )}
                        {order.status === 'Processing' && (
                          <Button 
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, order.order_type === 'lab' ? 'Completed' : 'Ready')}
                          >
                            {order.order_type === 'lab' ? 'Complete' : 'Ready'}
                          </Button>
                        )}
                        {order.status === 'Ready' && order.order_type === 'pharmacy' && (
                          <Button 
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, 'Completed')}
                          >
                            Dispense
                          </Button>
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

      {/* Create Order Form */}
      <CreateUnifiedOrderForm 
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onOrderCreated={handleCreateOrder}
        patients={patients}
      />
    </div>
  );
}
