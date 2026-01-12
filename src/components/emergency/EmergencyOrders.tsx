import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Plus, FileText, TestTube, Pill, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EROrder {
  id: string;
  erPatientId: string;
  patientName: string;
  erNumber: string;
  orderType: string;
  orderCategory?: string;
  orderDetails: string;
  urgency: string;
  orderedBy: string;
  orderedTime: string;
  status: string;
  results?: string;
  completedTime?: string;
  notes?: string;
}

export function EmergencyOrders() {
  const { toast } = useToast();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [orderType, setOrderType] = useState("");
  const [newOrder, setNewOrder] = useState({
    orderCategory: "",
    orderDetails: "",
    urgency: "routine",
    notes: ""
  });

  // Mock patients in ER
  const erPatients = [
    { id: "1", erNumber: "ER-001", name: "Ahmad Hassan", bedNumber: "ER-T1" },
    { id: "2", erNumber: "ER-002", name: "Fatima Ali", bedNumber: "ER-T2" },
    { id: "3", erNumber: "ER-003", name: "Hassan Ali", bedNumber: "ER-G1" }
  ];

  // Mock orders data
  const orders: EROrder[] = [
    {
      id: "1",
      erPatientId: "1",
      patientName: "Ahmad Hassan",
      erNumber: "ER-001",
      orderType: "lab",
      orderCategory: "blood_work",
      orderDetails: "CBC, Electrolytes, Cardiac Enzymes (Troponin I, CK-MB)",
      urgency: "stat",
      orderedBy: "Dr. Sarah Ahmed",
      orderedTime: "2024-01-04 14:50",
      status: "completed",
      results: "Troponin I elevated at 2.8 ng/mL (Normal: <0.04), CBC normal, Na 138, K 4.2",
      completedTime: "2024-01-04 15:30",
      notes: "Consistent with myocardial infarction"
    },
    {
      id: "2",
      erPatientId: "1",
      patientName: "Ahmad Hassan",
      erNumber: "ER-001",
      orderType: "radiology",
      orderCategory: "xray",
      orderDetails: "Chest X-ray (PA & Lateral)",
      urgency: "urgent",
      orderedBy: "Dr. Sarah Ahmed",
      orderedTime: "2024-01-04 14:55",
      status: "completed",
      results: "No acute cardiopulmonary abnormalities. Heart size normal. No pleural effusion.",
      completedTime: "2024-01-04 15:15"
    },
    {
      id: "3",
      erPatientId: "2",
      patientName: "Fatima Ali",
      erNumber: "ER-002",
      orderType: "radiology",
      orderCategory: "ct",
      orderDetails: "CT Abdomen/Pelvis with contrast",
      urgency: "urgent",
      orderedBy: "Dr. Ahmed Khan",
      orderedTime: "2024-01-04 15:00",
      status: "in_progress",
      notes: "Rule out appendicitis, bowel obstruction"
    },
    {
      id: "4",
      erPatientId: "2",
      patientName: "Fatima Ali",
      erNumber: "ER-002",
      orderType: "lab",
      orderCategory: "blood_work",
      orderDetails: "CBC with differential, CMP, Lipase, Pregnancy test",
      urgency: "urgent",
      orderedBy: "Dr. Ahmed Khan",
      orderedTime: "2024-01-04 14:55",
      status: "pending"
    },
    {
      id: "5",
      erPatientId: "1",
      patientName: "Ahmad Hassan",
      erNumber: "ER-001",
      orderType: "medication",
      orderDetails: "Nitroglycerin 0.4mg sublingual PRN chest pain (max 3 doses)",
      urgency: "stat",
      orderedBy: "Dr. Sarah Ahmed",
      orderedTime: "2024-01-04 14:45",
      status: "completed",
      completedTime: "2024-01-04 14:50",
      notes: "Patient reports pain relief after 1 dose"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "secondary";
      case "in_progress": return "default";
      case "completed": return "default";
      case "cancelled": return "outline";
      default: return "outline";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "stat": return "destructive";
      case "urgent": return "secondary";
      case "routine": return "outline";
      default: return "outline";
    }
  };

  const getOrderIcon = (orderType: string) => {
    switch (orderType) {
      case "lab": return <TestTube className="h-4 w-4" />;
      case "radiology": return <FileText className="h-4 w-4" />;
      case "medication": return <Pill className="h-4 w-4" />;
      case "procedure": return <Zap className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleOrderSubmit = () => {
    const selectedPatientData = erPatients.find(p => p.id === selectedPatient);
    
    toast({
      title: "Order Submitted",
      description: `${orderType} order placed for ${selectedPatientData?.name} (${selectedPatientData?.erNumber})`,
    });

    // Reset form
    setNewOrder({
      orderCategory: "",
      orderDetails: "",
      urgency: "routine",
      notes: ""
    });
    setSelectedPatient("");
    setOrderType("");
    setShowOrderForm(false);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    toast({
      title: "Order Status Updated",
      description: `Order status updated to ${newStatus.replace("_", " ")}`,
    });
  };

  // Order categories by type
  const orderCategories = {
    lab: [
      { value: "blood_work", label: "Blood Work" },
      { value: "urinalysis", label: "Urinalysis" },
      { value: "microbiology", label: "Microbiology" },
      { value: "toxicology", label: "Toxicology" }
    ],
    radiology: [
      { value: "xray", label: "X-Ray" },
      { value: "ct", label: "CT Scan" },
      { value: "mri", label: "MRI" },
      { value: "ultrasound", label: "Ultrasound" }
    ],
    medication: [],
    procedure: [
      { value: "cardiac", label: "Cardiac Procedure" },
      { value: "respiratory", label: "Respiratory Procedure" },
      { value: "wound_care", label: "Wound Care" },
      { value: "minor_surgery", label: "Minor Surgery" }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Emergency Orders Management</h2>
        <Button onClick={() => setShowOrderForm(!showOrderForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">STAT Orders</p>
                <p className="text-2xl font-bold text-red-500">
                  {orders.filter(o => o.urgency === "stat" && o.status !== "completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-500">
                  {orders.filter(o => o.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TestTube className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-500">
                  {orders.filter(o => o.status === "in_progress").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold text-green-500">
                  {orders.filter(o => o.status === "completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Form */}
      {showOrderForm && (
        <Card>
          <CardHeader>
            <CardTitle>Place New Emergency Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {erPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} ({patient.erNumber}) - {patient.bedNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Order Type</Label>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose order type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab">Laboratory Tests</SelectItem>
                    <SelectItem value="radiology">Radiology/Imaging</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="procedure">Procedure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {orderType && orderCategories[orderType as keyof typeof orderCategories].length > 0 && (
                <div className="space-y-2">
                  <Label>Order Category</Label>
                  <Select value={newOrder.orderCategory} onValueChange={(value) => setNewOrder({ ...newOrder, orderCategory: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderCategories[orderType as keyof typeof orderCategories].map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Urgency Level</Label>
                <Select value={newOrder.urgency} onValueChange={(value) => setNewOrder({ ...newOrder, urgency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stat">STAT - Immediate</SelectItem>
                    <SelectItem value="urgent">Urgent - Within 1 hour</SelectItem>
                    <SelectItem value="routine">Routine - Within 24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Order Details</Label>
                <Textarea
                  value={newOrder.orderDetails}
                  onChange={(e) => setNewOrder({ ...newOrder, orderDetails: e.target.value })}
                  placeholder="Detailed description of the order..."
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Clinical Notes</Label>
                <Textarea
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  placeholder="Additional clinical information, indications, special instructions..."
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleOrderSubmit} disabled={!selectedPatient || !orderType || !newOrder.orderDetails} className="flex-1">
                Submit Order
              </Button>
              <Button variant="outline" onClick={() => setShowOrderForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Management */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Order Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Ordered By</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.filter(o => o.status !== "completed").map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{order.patientName}</p>
                          <p className="text-xs text-muted-foreground">{order.erNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getOrderIcon(order.orderType)}
                          <span className="capitalize">{order.orderType}</span>
                          {order.orderCategory && (
                            <Badge variant="outline" className="text-xs">
                              {order.orderCategory.replace("_", " ")}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{order.orderDetails}</p>
                        {order.notes && (
                          <p className="text-xs text-muted-foreground mt-1">{order.notes}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getUrgencyColor(order.urgency)}>
                          {order.urgency.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{order.orderedBy}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">{order.orderedTime.split(" ")[1]}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {order.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "in_progress")}
                            >
                              Start
                            </Button>
                          )}
                          {order.status === "in_progress" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, "completed")}
                            >
                              Complete
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="completed">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Order Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead>Completed Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.filter(o => o.status === "completed").map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{order.patientName}</p>
                          <p className="text-xs text-muted-foreground">{order.erNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getOrderIcon(order.orderType)}
                          <span className="capitalize">{order.orderType}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{order.orderDetails}</TableCell>
                      <TableCell>
                        <p className="text-sm">{order.results || "Results pending"}</p>
                      </TableCell>
                      <TableCell className="text-sm">{order.completedTime}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Results
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Order Results - {order.patientName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium">Order Details:</p>
                                <p className="text-sm text-muted-foreground">{order.orderDetails}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Results:</p>
                                <p className="text-sm">{order.results}</p>
                              </div>
                              {order.notes && (
                                <div>
                                  <p className="text-sm font-medium">Clinical Notes:</p>
                                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Print Results
                                </Button>
                                <Button variant="outline" size="sm">
                                  Add to EMR
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Order Type</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{order.patientName}</p>
                          <p className="text-xs text-muted-foreground">{order.erNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getOrderIcon(order.orderType)}
                          <span className="capitalize">{order.orderType}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{order.orderDetails}</TableCell>
                      <TableCell>
                        <Badge variant={getUrgencyColor(order.urgency)}>
                          {order.urgency.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{order.orderedTime}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}