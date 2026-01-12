
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
import { Search, Plus, Edit, Trash2, Pill, Package, AlertTriangle, TrendingUp, ShoppingCart, FileText, Clock, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const menuItems = [
    { value: "inventory", label: "Stock Inventory", icon: <Package className="w-4 h-4" /> },
    { value: "prescriptions", label: "Prescriptions", icon: <FileText className="w-4 h-4" /> },
    { value: "sales", label: "Sales & Revenue", icon: <TrendingUp className="w-4 h-4" /> },
  ];

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

  const getStatusColor = (status: string) => {
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

  const getStockLevel = (quantity: number, minStock: number) => {
    return Math.min(100, (quantity / minStock) * 100);
  };

  const totalValue = mockMedicines.reduce((sum, med) => sum + (med.price * med.quantity), 0);
  const lowStockCount = mockMedicines.filter(m => m.quantity < m.min_stock).length;

  return (
    <MainLayout noPadding>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50/50">
        {/* Column 2: Pharmacy Submenu panel */}
        <aside className="w-72 flex-shrink-0 bg-white border-r shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 hidden md:flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Pharmacy Menu</h2>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    activeTab === item.value
                      ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 rounded-l-none"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      activeTab === item.value ? "bg-emerald-100" : "bg-slate-100/50 group-hover:bg-slate-100"
                    )}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {activeTab === item.value && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>

            <div className="mt-8 space-y-2">
              <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" size="sm" className="w-full justify-start gap-2 bg-white border-emerald-100 text-emerald-700 hover:bg-emerald-50">
                <Plus className="h-4 w-4" />
                Add Medicine
              </Button>
              <Button onClick={() => setIsPrescriptionDialogOpen(true)} size="sm" className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-md">
                <ShoppingCart className="h-4 w-4" />
                New Dispense
              </Button>
            </div>
          </div>

          <div className="mt-auto p-4 m-4 rounded-2xl bg-emerald-600 text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-wider font-bold opacity-80">Inventory Status</p>
              <h3 className="text-lg font-bold mt-1">Stock Health</h3>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Available</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            <Pill className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
          </div>
        </aside>

        {/* Column 3: Main Content area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none mb-2">
                  {activeTab === 'inventory' ? 'Inventory' :
                    activeTab === 'prescriptions' ? 'Prescriptions' :
                      'Financials'}
                </h1>
                <p className="text-slate-500">
                  Manage drugstore operations, stock distribution and sales performance.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Medicines</CardTitle>
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
                      <Pill className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">{mockMedicines.length}</div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">In active inventory</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-red-500">Low Stock Items</CardTitle>
                    <div className="p-2 bg-red-50 rounded-lg text-red-600 group-hover:scale-110 transition-transform">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-red-600">{lowStockCount}</div>
                    <p className="text-[10px] text-red-400 mt-1 font-medium italic">Require immediate restocking</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Rx Today</CardTitle>
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                      <FileText className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">{mockPrescriptions.length}</div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Processed encounters</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-600">Revenue Today</CardTitle>
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">${totalValue.toLocaleString()}</div>
                    <p className="text-[10px] text-emerald-600 mt-1 font-bold">+12% from yesterday</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {activeTab === 'inventory' && (
                  <>
                    <Card className="bg-white border-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="Search by name, category or batch..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 border-slate-100 bg-slate-50/50 focus:bg-white transition-all rounded-xl"
                              />
                            </div>
                          </div>
                          <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-full sm:w-[200px] h-11 border-slate-100 rounded-xl">
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

                    <Card className="bg-white border-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden rounded-2xl">
                      <Table>
                        <TableHeader className="bg-slate-50/50">
                          <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="font-bold text-slate-900 py-4">Medicine Name</TableHead>
                            <TableHead className="font-bold text-slate-900">Category</TableHead>
                            <TableHead className="font-bold text-slate-900">Stock Level</TableHead>
                            <TableHead className="font-bold text-slate-900 text-center">Batch</TableHead>
                            <TableHead className="font-bold text-slate-900">Status</TableHead>
                            <TableHead className="text-right font-bold text-slate-900 pr-6">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMedicines.map((medicine) => (
                            <TableRow key={medicine.id} className="hover:bg-slate-50/30 border-slate-50 transition-colors">
                              <TableCell className="py-4">
                                <div>
                                  <div className="font-bold text-slate-900">{medicine.name}</div>
                                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">${medicine.price} / unit</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-0 rounded-lg">
                                  {medicine.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1.5 min-w-[140px]">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-700">{medicine.quantity} units</span>
                                    <span className="text-slate-400 font-medium">{getStockLevel(medicine.quantity, medicine.min_stock).toFixed(0)}%</span>
                                  </div>
                                  <Progress
                                    value={getStockLevel(medicine.quantity, medicine.min_stock)}
                                    className={cn(
                                      "h-1.5",
                                      medicine.quantity < medicine.min_stock ? "bg-red-50 [&>div]:bg-red-500" : "bg-emerald-50 [&>div]:bg-emerald-500"
                                    )}
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{medicine.batch_number}</span>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={cn("border-0 font-bold px-3 py-1 rounded-full", getStatusColor(medicine.status))}>
                                  {medicine.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </>
                )}

                {activeTab === 'prescriptions' && (
                  <div className="grid gap-4">
                    {mockPrescriptions.map((prescription) => (
                      <Card key={prescription.id} className="bg-white border-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden rounded-2xl group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="p-6 flex-1">
                              <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                  <div className="bg-emerald-50 p-3 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                                    <FileText className="h-5 w-5 text-emerald-600" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{prescription.prescription_id}</h3>
                                      <Badge variant="outline" className={cn("border-0 font-bold px-3 py-1 rounded-full text-[10px]", getStatusColor(prescription.status))}>
                                        {prescription.status}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">ISSUED: {prescription.date}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-8 mb-6">
                                <div className="space-y-1">
                                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest">Patient Name</p>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    <p className="font-bold text-slate-800">{prescription.patient_name}</p>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-[10px] uppercase text-slate-400 font-black tracking-widest">Prescribing Physician</p>
                                  <p className="font-bold text-slate-800">{prescription.doctor_name}</p>
                                </div>
                              </div>

                              <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
                                <div className="flex items-center gap-2 mb-4">
                                  <Pill className="w-4 h-4 text-emerald-600" />
                                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Prescribed Medications</h4>
                                </div>
                                <div className="space-y-3">
                                  {prescription.medications.map((med, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.01]">
                                      <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-emerald-50 flex items-center justify-center text-[10px] font-black text-emerald-600">{med.quantity}</div>
                                        <span className="font-bold text-slate-800 text-sm">{med.name}</span>
                                      </div>
                                      <span className="text-[11px] font-medium text-slate-500 italic mt-1 sm:mt-0">{med.instructions}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-50/30 p-6 border-t md:border-t-0 md:border-l border-slate-100 w-full md:w-56 flex flex-col justify-center gap-3">
                              <Button variant="outline" className="w-full bg-white border-slate-100 font-bold text-xs rounded-xl shadow-sm hover:bg-slate-50">View Session History</Button>
                              {prescription.status === "Pending" && (
                                <Button onClick={() => handleProcessPrescription(prescription.id)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-[0_4px_14px_rgba(16,185,129,0.3)]">
                                  Dispense Now
                                </Button>
                              )}
                              <Button variant="ghost" className="text-[10px] font-black uppercase text-slate-400 hover:text-emerald-600 transition-colors">Print Label</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === 'sales' && (
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-white border-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden">
                      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Daily Sales Snapshot</CardTitle>
                        <CardDescription>Transactional flow and performance metrics for today</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {[
                            { label: "Gross Sales", value: "$4,250.00", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Prescription Revenue", value: "$3,120.00", icon: Pill, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { label: "OTC Revenue", value: "$1,130.00", icon: ShoppingCart, color: "text-orange-600", bg: "bg-orange-50" },
                            { label: "Wait Time (Avg)", value: "14 mins", icon: Clock, color: "text-slate-600", bg: "bg-slate-50" }
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border border-slate-50 rounded-2xl bg-slate-50/30 group transition-all hover:bg-white hover:shadow-md hover:border-slate-100">
                              <div className="flex items-center gap-4">
                                <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", item.bg, item.color)}>
                                  <item.icon className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-bold text-slate-700">{item.label}</span>
                              </div>
                              <span className="font-black text-slate-900 text-lg">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden">
                      <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-tight">Top Sellers</CardTitle>
                        <CardDescription>Highest volume medications dispensed today</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-6">
                          {mockMedicines.slice(0, 3).map((medicine, index) => (
                            <div key={medicine.id} className="flex items-center justify-between group">
                              <div className="flex items-center gap-5">
                                <div className="text-4xl font-black text-slate-100 italic transition-colors group-hover:text-emerald-50">0{index + 1}</div>
                                <div>
                                  <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{medicine.name}</div>
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{medicine.category}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-black text-slate-900">{24 - index * 5} <span className="text-[10px] text-slate-400">units</span></div>
                                <Badge className="bg-emerald-50 text-emerald-600 border-0 text-[10px] px-2 py-0.5 mt-1">HIGH DEMAND</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl border-white p-0 overflow-hidden shadow-2xl">
          <div className="bg-slate-900 p-8 text-white relative">
            <DialogTitle className="text-2xl font-black text-white uppercase tracking-tight">Stock Registration</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">Add new pharmaceutical items to the active repository.</DialogDescription>
            <Package className="absolute right-6 top-8 w-16 h-16 opacity-10 rotate-12" />
          </div>
          <div className="p-8 space-y-6 bg-white">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-500">Medicine Designation</Label>
                <Input id="name" value={newMedicine.name} onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })} placeholder="e.g. Paracetamol 500mg" className="border-slate-100 bg-slate-50 h-10 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-slate-500">Classification</Label>
                  <Input id="category" value={newMedicine.category} onChange={(e) => setNewMedicine({ ...newMedicine, category: e.target.value })} className="border-slate-100 bg-slate-50 h-10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-slate-500">Unit Cost (USD)</Label>
                  <Input id="price" type="number" value={newMedicine.price} onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })} className="border-slate-100 bg-slate-50 h-10 rounded-xl" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 rounded-2xl h-12 border-slate-100 font-bold" onClick={() => setIsAddDialogOpen(false)}>Discard</Button>
              <Button onClick={handleAddMedicine} className="flex-[2] rounded-2xl h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl">Complete Registration</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default PharmacyModule;
