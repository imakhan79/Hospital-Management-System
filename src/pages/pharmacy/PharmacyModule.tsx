
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Search, Plus, Edit, Trash2, Pill, Package, AlertTriangle, TrendingUp, ShoppingCart, FileText, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PharmacyModule = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "",
    manufacturer: "",
    batchNumber: "",
    expiryDate: "",
    quantity: "",
    price: "",
    description: ""
  });

  const [newPrescription, setNewPrescription] = useState({
    patientId: "",
    patientName: "",
    doctorName: "",
    medications: [],
    instructions: "",
    prescriptionDate: ""
  });

  // Mock data
  const [mockMedicines, setMockMedicines] = useState([
    {
      id: "1",
      name: "Paracetamol 500mg",
      category: "Analgesic",
      manufacturer: "PharmaCorp",
      batch_number: "PCL2024001",
      quantity: 500,
      price: 0.25,
      expiry_date: "2025-12-31",
      status: "Available",
      min_stock: 100
    },
    {
      id: "2",
      name: "Amoxicillin 250mg",
      category: "Antibiotic",
      manufacturer: "MediLab",
      batch_number: "AMX2024002",
      quantity: 75,
      price: 0.85,
      expiry_date: "2025-06-30",
      status: "Low Stock",
      min_stock: 100
    },
    {
      id: "3",
      name: "Lisinopril 10mg",
      category: "Cardiovascular",
      manufacturer: "CardioMed",
      batch_number: "LIS2024003",
      quantity: 15,
      price: 1.20,
      expiry_date: "2024-12-31",
      status: "Critical",
      min_stock: 50
    }
  ]);

  const [mockPrescriptions, setMockPrescriptions] = useState([
    {
      id: "1",
      prescription_id: "RX001",
      patient_name: "John Doe",
      doctor_name: "Dr. Sarah Johnson",
      date: "2024-01-22",
      status: "Pending",
      medications: [
        { name: "Paracetamol 500mg", quantity: 20, instructions: "Take 1 tablet every 6 hours" }
      ]
    },
    {
      id: "2",
      prescription_id: "RX002",
      patient_name: "Mary Smith",
      doctor_name: "Dr. Michael Chen",
      date: "2024-01-22",
      status: "Dispensed",
      medications: [
        { name: "Amoxicillin 250mg", quantity: 21, instructions: "Take 1 capsule 3 times daily" },
        { name: "Paracetamol 500mg", quantity: 10, instructions: "Take as needed for pain" }
      ]
    }
  ]);

  const filteredMedicines = mockMedicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || medicine.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleAddMedicine = () => {
    toast({
      title: "Medicine Added",
      description: `${newMedicine.name} has been added to inventory.`,
    });
    setIsAddDialogOpen(false);
    setNewMedicine({
      name: "",
      category: "",
      manufacturer: "",
      batchNumber: "",
      expiryDate: "",
      quantity: "",
      price: "",
      description: ""
    });
  };

  const handleProcessPrescription = (id?: string) => {
    if (id) {
      setMockPrescriptions(prev => prev.map(p =>
        p.id === id ? { ...p, status: 'Dispensed' } : p
      ));
      toast({
        title: "Prescription Dispensed",
        description: "Medication has been successfully dispensed.",
      });
      return;
    }
    toast({
      title: "Prescription Processed",
      description: `Prescription for ${newPrescription.patientName} has been processed.`,
    });
    setIsPrescriptionDialogOpen(false);
    setNewPrescription({
      patientId: "",
      patientName: "",
      doctorName: "",
      medications: [],
      instructions: "",
      prescriptionDate: ""
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available": return "bg-green-100 text-green-800 border-green-200";
      case "low stock": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "out of stock": return "bg-slate-100 text-slate-800 border-slate-200";
      case "dispensed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStockLevel = (quantity, minStock) => {
    return Math.min(100, (quantity / minStock) * 100);
  };

  const totalValue = mockMedicines.reduce((sum, med) => sum + (med.price * med.quantity), 0);
  const lowStockCount = mockMedicines.filter(m => m.quantity < m.min_stock).length;

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left Sidebar Menu */}
        <aside className="w-full lg:w-64 flex-shrink-0 border-r bg-slate-50/50 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="h-full flex flex-col">
            <div className="p-4">
              <div className="flex items-center gap-2 px-2 mb-4">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <Pill className="h-5 w-5 text-emerald-600" />
                </div>
                <h2 className="font-semibold text-lg">Pharmacy</h2>
              </div>

              <TabsList className="flex flex-col h-auto bg-transparent space-y-1 w-full p-0">
                <TabsTrigger value="inventory" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Package className="w-4 h-4 mr-2" /> Stock Inventory
                </TabsTrigger>
                <TabsTrigger value="prescriptions" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <FileText className="w-4 h-4 mr-2" /> Prescriptions
                </TabsTrigger>
                <TabsTrigger value="sales" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <TrendingUp className="w-4 h-4 mr-2" /> Sales & Revenue
                </TabsTrigger>
              </TabsList>

              <div className="mt-8 px-2 space-y-2">
                <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" size="sm" className="w-full justify-start gap-2 bg-white">
                  <Plus className="h-4 w-4" />
                  Add Medicine
                </Button>
                <Button onClick={() => setIsPrescriptionDialogOpen(true)} size="sm" className="w-full justify-start gap-2 shadow-sm">
                  <FileText className="h-4 w-4" />
                  New Dispense
                </Button>
              </div>
            </div>
          </Tabs>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-slate-50/30 p-4 lg:p-6 h-full">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {activeTab === 'inventory' ? 'Pharmacy Inventory' :
                  activeTab === 'prescriptions' ? 'Prescription Management' :
                    'Financial Operations'}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage medications, dispense prescriptions, and track daily revenue
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
                  <Pill className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockMedicines.length}</div>
                  <p className="text-xs text-muted-foreground">In active inventory</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{lowStockCount}</div>
                  <p className="text-xs text-muted-foreground">Require restocking</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rx Today</CardTitle>
                  <FileText className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-emerald-600">{mockPrescriptions.length}</div>
                  <p className="text-xs text-muted-foreground">Processed encounters</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} className="mt-0">
              <TabsContent value="inventory" className="mt-0 space-y-4">
                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search by medicine name or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </div>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="analgesic">Analgesic</SelectItem>
                          <SelectItem value="antibiotic">Antibiotic</SelectItem>
                          <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead>Medicine Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Stock Level</TableHead>
                          <TableHead>Batch</TableHead>
                          <TableHead>Expiry</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMedicines.map((medicine) => (
                          <TableRow key={medicine.id} className="hover:bg-slate-50/50">
                            <TableCell>
                              <div>
                                <div className="font-semibold text-slate-900">{medicine.name}</div>
                                <div className="text-xs text-muted-foreground">${medicine.price} / unit</div>
                              </div>
                            </TableCell>
                            <TableCell>{medicine.category}</TableCell>
                            <TableCell>
                              <div className="space-y-1.5 min-w-[100px]">
                                <div className="text-sm font-medium">{medicine.quantity} units</div>
                                <Progress
                                  value={getStockLevel(medicine.quantity, medicine.min_stock)}
                                  className={`h-1.5 ${medicine.quantity < medicine.min_stock ? 'bg-red-100' : 'bg-slate-100'}`}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-slate-600">{medicine.batch_number}</TableCell>
                            <TableCell className="text-sm text-slate-600">{medicine.expiry_date}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(medicine.status)}>
                                {medicine.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="prescriptions" className="mt-0 space-y-4">
                <div className="grid gap-4">
                  {mockPrescriptions.map((prescription) => (
                    <Card key={prescription.id} className="bg-white border-slate-200 shadow-sm overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="p-6 flex-1">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="bg-emerald-100 p-2 rounded-full">
                                  <FileText className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-slate-900">{prescription.prescription_id}</h3>
                                  <p className="text-sm text-muted-foreground">Date: {prescription.date}</p>
                                </div>
                              </div>
                              <Badge className={getStatusColor(prescription.status)}>
                                {prescription.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs uppercase text-slate-400 font-bold">Patient</p>
                                <p className="font-semibold text-slate-700">{prescription.patient_name}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase text-slate-400 font-bold">Prescribing Physician</p>
                                <p className="font-semibold text-slate-700">{prescription.doctor_name}</p>
                              </div>
                            </div>

                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                              <h4 className="text-sm font-bold text-slate-700 mb-2">Medications</h4>
                              <div className="space-y-2">
                                {prescription.medications.map((med, index) => (
                                  <div key={index} className="flex justify-between text-sm italic text-slate-600">
                                    <span>• {med.name} (Qty: {med.quantity})</span>
                                    <span>{med.instructions}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="bg-slate-50/50 p-6 border-t md:border-t-0 md:border-l w-full md:w-48 flex flex-col justify-center gap-2">
                            <Button variant="outline" size="sm" className="w-full bg-white">View Details</Button>
                            {prescription.status === "Pending" && (
                              <Button size="sm" onClick={() => handleProcessPrescription(prescription.id)} className="w-full bg-emerald-600 hover:bg-emerald-700">
                                Dispense
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sales" className="mt-0 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader>
                      <CardTitle>Daily Sales Summary</CardTitle>
                      <CardDescription>Transactional overview for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { label: "Gross Sales", value: "$4,250.00", icon: TrendingUp, color: "text-blue-600" },
                          { label: "Prescription Revenue", value: "$3,120.00", icon: Pill, color: "text-emerald-600" },
                          { label: "OTC Revenue", value: "$1,130.00", icon: ShoppingCart, color: "text-orange-600" },
                          { label: "Wait Time (Avg)", value: "14 mins", icon: Clock, color: "text-slate-600" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50/50">
                            <div className="flex items-center gap-3">
                              <item.icon className={`h-4 w-4 ${item.color}`} />
                              <span className="text-sm font-medium text-slate-700">{item.label}</span>
                            </div>
                            <span className="font-bold text-slate-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader>
                      <CardTitle>Top Selling Medications</CardTitle>
                      <CardDescription>Most dispensed items by volume</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockMedicines.slice(0, 3).map((medicine, index) => (
                          <div key={medicine.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl font-black text-slate-100 italic">0{index + 1}</div>
                              <div>
                                <div className="font-bold text-slate-900">{medicine.name}</div>
                                <div className="text-xs text-muted-foreground">{medicine.category}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-black text-slate-900">{24 - index * 5} units</div>
                              <div className="text-xs text-emerald-600 font-bold">High Demand</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Medicine Name</Label>
              <Input
                id="name"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                placeholder="e.g. Paracetamol"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newMedicine.category}
                  onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newMedicine.price}
                  onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleAddMedicine} className="w-full">Save Medicine</Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PharmacyModule;
