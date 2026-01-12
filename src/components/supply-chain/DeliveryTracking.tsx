
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Truck, MapPin, Clock, Package, CheckCircle, AlertTriangle } from "lucide-react";

interface Delivery {
  id: string;
  poNumber: string;
  supplier: string;
  items: string;
  status: 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Delayed' | 'Failed';
  trackingNumber: string;
  dispatchDate: string;
  expectedDate: string;
  actualDate?: string;
  currentLocation: string;
  estimatedArrival: string;
  deliveryPerson?: string;
  contactNumber?: string;
}

export function DeliveryTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const deliveries: Delivery[] = [
    {
      id: "DEL-001",
      poNumber: "PO-2024-001",
      supplier: "MedSupply Corporation",
      items: "Surgical Masks, Gloves, Syringes",
      status: "In Transit",
      trackingNumber: "MS2024001TR",
      dispatchDate: "2024-01-22",
      expectedDate: "2024-01-25",
      currentLocation: "Mumbai Distribution Center",
      estimatedArrival: "2024-01-25 14:00",
      deliveryPerson: "Rajesh Kumar",
      contactNumber: "+91 98765 43210"
    },
    {
      id: "DEL-002",
      poNumber: "PO-2024-002",
      supplier: "PharmaCo Limited",
      items: "Antibiotics, Pain Relievers",
      status: "Dispatched",
      trackingNumber: "PC2024002TR",
      dispatchDate: "2024-01-23",
      expectedDate: "2024-01-28",
      currentLocation: "Delhi Warehouse",
      estimatedArrival: "2024-01-28 10:00",
      deliveryPerson: "Amit Sharma",
      contactNumber: "+91 87654 32109"
    },
    {
      id: "DEL-003",
      poNumber: "PO-2024-003",
      supplier: "EquipTech Solutions",
      items: "X-Ray Film, Ultrasound Gel",
      status: "Delivered",
      trackingNumber: "ET2024003TR",
      dispatchDate: "2024-01-19",
      expectedDate: "2024-01-22",
      actualDate: "2024-01-21",
      currentLocation: "Delivered - Hospital Reception",
      estimatedArrival: "Completed",
      deliveryPerson: "Priya Patel",
      contactNumber: "+91 76543 21098"
    },
    {
      id: "DEL-004",
      poNumber: "PO-2024-004",
      supplier: "LabChem Industries",
      items: "Blood Test Reagents, Analysis Strips",
      status: "Out for Delivery",
      trackingNumber: "LC2024004TR",
      dispatchDate: "2024-01-23",
      expectedDate: "2024-01-24",
      currentLocation: "Out for Delivery - Local Facility",
      estimatedArrival: "2024-01-24 16:30",
      deliveryPerson: "Neha Singh",
      contactNumber: "+91 65432 10987"
    },
    {
      id: "DEL-005",
      poNumber: "PO-2024-005",
      supplier: "SurgiTools Pvt Ltd",
      items: "Surgical Forceps, Scalpel Blades",
      status: "Delayed",
      trackingNumber: "ST2024005TR",
      dispatchDate: "2024-01-20",
      expectedDate: "2024-01-23",
      currentLocation: "Chennai Hub - Delayed due to weather",
      estimatedArrival: "2024-01-26 12:00",
      deliveryPerson: "Vikram Rao",
      contactNumber: "+91 54321 09876"
    }
  ];

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || delivery.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Out for Delivery': return 'bg-blue-100 text-blue-800';
      case 'In Transit': return 'bg-indigo-100 text-indigo-800';
      case 'Dispatched': return 'bg-yellow-100 text-yellow-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="h-4 w-4" />;
      case 'Out for Delivery': return <Truck className="h-4 w-4" />;
      case 'In Transit': return <Package className="h-4 w-4" />;
      case 'Dispatched': return <Clock className="h-4 w-4" />;
      case 'Delayed': return <AlertTriangle className="h-4 w-4" />;
      case 'Failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const stats = {
    total: deliveries.length,
    inTransit: deliveries.filter(d => ['Dispatched', 'In Transit', 'Out for Delivery'].includes(d.status)).length,
    delivered: deliveries.filter(d => d.status === 'Delivered').length,
    delayed: deliveries.filter(d => d.status === 'Delayed').length
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Delivery Tracking</h2>
        <Button variant="outline">
          <Package className="mr-2 h-4 w-4" />
          Track New Shipment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Active tracking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">On the way</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <p className="text-xs text-muted-foreground">Successfully received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.delayed}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
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
                  placeholder="Search by PO number, supplier, or tracking number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Dispatched">Dispatched</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Tracking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Live Delivery Tracking</CardTitle>
          <CardDescription>Real-time status of all shipments and deliveries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tracking Number</TableHead>
                  <TableHead>Current Location</TableHead>
                  <TableHead>Expected Arrival</TableHead>
                  <TableHead>Delivery Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.poNumber}</TableCell>
                    <TableCell>{delivery.supplier}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{delivery.items}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(delivery.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(delivery.status)}
                          {delivery.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{delivery.trackingNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{delivery.currentLocation}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {delivery.status === 'Delivered' ? (
                          <span className="text-green-600">
                            Delivered on {new Date(delivery.actualDate!).toLocaleDateString()}
                          </span>
                        ) : (
                          delivery.estimatedArrival
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {delivery.deliveryPerson && (
                        <div className="text-sm">
                          <div>{delivery.deliveryPerson}</div>
                          <div className="text-muted-foreground">{delivery.contactNumber}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Track</Button>
                        {delivery.status === 'Out for Delivery' && (
                          <Button size="sm">Confirm Receipt</Button>
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
    </div>
  );
}
