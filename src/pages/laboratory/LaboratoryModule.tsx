
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MainLayout from "@/components/layout/MainLayout";
import { TestTube, Plus, Search, Clock, CheckCircle, AlertCircle, ChevronRight, TrendingUp, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateLabTestData, generateSystemPatients } from "@/services/systemService";
import { OrderNewTestForm } from "@/components/laboratory/OrderNewTestForm";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const LaboratoryModule = () => {
  const [labTests, setLabTests] = useState(generateLabTestData());
  const [patients] = useState(generateSystemPatients());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [activeTab, setActiveTab] = useState("tests");
  const { toast } = useToast();

  const menuItems = [
    { value: "tests", label: "Lab Orders", icon: <TestTube className="w-4 h-4" /> },
    { value: "results", label: "Diagnostics", icon: <CheckCircle className="w-4 h-4" /> },
    { value: "reports", label: "Analysis", icon: <Clock className="w-4 h-4" /> },
  ];

  const filteredTests = labTests.filter(test => {
    const patient = patients.find(p => p.id === test.patient_id);
    const patientName = patient ? patient.name : 'Unknown Patient';
    const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.test_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || test.status === filterStatus;
    const matchesType = filterType === "all" || test.test_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'STAT': return 'bg-red-100 text-red-800 font-black';
      case 'Urgent': return 'bg-orange-100 text-orange-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOrderTest = () => {
    setShowOrderForm(true);
  };

  const handleTestOrdered = (newTest: any) => {
    setLabTests(prev => [newTest, ...prev]);
    toast({
      title: "Test Ordered",
      description: `${newTest.test_type} has been successfully ordered.`,
    });
  };

  const handleUpdateTestStatus = (testId: string, newStatus: string) => {
    setLabTests(prev => prev.map(test =>
      test.id === testId ? { ...test, status: newStatus } : test
    ));
    toast({
      title: "Status Updated",
      description: `Test updated to ${newStatus}`,
    });
  };

  const handleAddResults = (testId: string) => {
    setLabTests(prev => prev.map(test =>
      test.id === testId ? {
        ...test,
        status: 'Completed',
        results: 'Test results have been added and reviewed by lab technician'
      } : test
    ));
    toast({
      title: "Results Published",
      description: "Diagnostic report is now available.",
    });
  };

  const completedTests = labTests.filter(test => test.status === 'Completed').length;
  const pendingTests = labTests.filter(test => test.status === 'Pending').length;
  const inProgressTests = labTests.filter(test => test.status === 'In Progress').length;
  const testTypes = Array.from(new Set(labTests.map(test => test.test_type)));

  return (
    <MainLayout noPadding>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50/50">
        {/* Column 2: Laboratory Submenu panel */}
        <aside className="w-72 flex-shrink-0 bg-white border-r shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 hidden md:flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Laboratory</h2>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    activeTab === item.value
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 rounded-l-none"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      activeTab === item.value ? "bg-blue-100" : "bg-slate-100/50 group-hover:bg-slate-100"
                    )}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {activeTab === item.value && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Button onClick={handleOrderTest} className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 shadow-md h-11 rounded-xl font-bold">
                <Plus className="h-4 w-4" />
                Order New Test
              </Button>
            </div>
          </div>

          <div className="mt-auto p-4 m-4 rounded-2xl bg-blue-600 text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-wider font-bold opacity-80">Lab Efficiency</p>
              <h3 className="text-lg font-bold mt-1">TAT Optimized</h3>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[92%]"></div>
                </div>
                <span className="text-[10px] font-bold">92%</span>
              </div>
            </div>
            <FlaskConical className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
          </div>
        </aside>

        {/* Column 3: Main Content area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {activeTab === 'tests' ? 'Laboratory Orders' :
                    activeTab === 'results' ? 'Pathology results' :
                      'Analytics Board'}
                </h1>
                <p className="text-slate-500 font-medium">
                  Diagnostic test life-cycle management and clinical reporting.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Tests</CardTitle>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                      <TestTube className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">{labTests.length}</div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter tracking-widest">Active Database</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-yellow-600">Pending</CardTitle>
                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg group-hover:scale-110 transition-transform">
                      <Clock className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-yellow-600">{pendingTests}</div>
                    <p className="text-[10px] text-yellow-600/60 font-bold mt-1 uppercase tracking-widest italic">Awaiting Prep</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-blue-600">Processing</CardTitle>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-blue-600">{inProgressTests}</div>
                    <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase tracking-widest">In analyzer</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-green-600">Released</CardTitle>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-green-600">{completedTests}</div>
                    <p className="text-[10px] text-green-600 font-bold mt-1 uppercase tracking-widest">Live Reports</p>
                  </CardContent>
                </Card>
              </div>

              {activeTab === 'tests' && (
                <div className="space-y-4">
                  <Card className="bg-white border-white shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="Search tests, patient MRN or names..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 h-11 border-slate-100 bg-slate-50/50 focus:bg-white rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-[150px] h-11 rounded-xl border-slate-100">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Progress">Processing</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
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
                          <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">ID / MRN</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Patient</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Diagnostic</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">Status</TableHead>
                          <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">Priority</TableHead>
                          <TableHead className="text-right font-black uppercase text-[10px] tracking-widest text-slate-500 pr-6">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTests.slice(0, 15).map((test) => {
                          const patient = patients.find(p => p.id === test.patient_id);
                          return (
                            <TableRow key={test.id} className="hover:bg-slate-50/30 border-slate-50 transition-colors">
                              <TableCell className="py-4 font-mono text-[10px] font-bold text-blue-600">{test.id}</TableCell>
                              <TableCell className="font-bold text-slate-800">{patient ? patient.name : 'Unknown'}</TableCell>
                              <TableCell className="font-medium text-slate-600">{test.test_type}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className={cn("border-0 font-bold px-3 py-1 rounded-full text-[10px]", getStatusColor(test.status))}>
                                  {test.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={cn("border-0 rounded-lg text-[10px] h-5", getPriorityColor(test.priority))}>
                                  {test.priority}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right pr-6">
                                <div className="flex justify-end gap-2">
                                  {test.status === 'Pending' && (
                                    <Button size="sm" variant="outline" className="h-8 rounded-lg text-[10px] font-bold border-slate-100 hover:bg-blue-50 hover:text-blue-600" onClick={() => handleUpdateTestStatus(test.id, 'In Progress')}>
                                      ACKNOWLEDGE
                                    </Button>
                                  )}
                                  {test.status === 'In Progress' && (
                                    <Button size="sm" className="h-8 rounded-lg text-[10px] font-bold bg-blue-600 hover:bg-blue-700" onClick={() => handleAddResults(test.id)}>
                                      INPUT DATA
                                    </Button>
                                  )}
                                  {test.status === 'Completed' && (
                                    <Button size="sm" variant="ghost" className="h-8 font-black text-[10px] uppercase text-blue-600 hover:bg-blue-50">
                                      VIEW PDF
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              )}

              {activeTab === 'results' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {labTests
                      .filter(test => test.status === 'Completed' && test.results)
                      .slice(0, 8)
                      .map((test) => {
                        const patient = patients.find(p => p.id === test.patient_id);
                        return (
                          <Card key={test.id} className="bg-white border-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="p-0">
                              <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                                    <CheckCircle className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-black text-slate-900 tracking-tight uppercase leading-none">{test.test_type}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{patient ? patient.name : 'Unknown'}</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="border-0 bg-green-50 text-green-700 font-bold text-[10px] rounded-full">FINAL</Badge>
                              </div>
                              <div className="p-5 bg-slate-50/20">
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm min-h-[80px]">
                                  <p className="text-sm text-slate-600 leading-relaxed italic font-medium">"{test.results}"</p>
                                </div>
                                <div className="mt-4 flex justify-end gap-2">
                                  <Button variant="ghost" size="sm" className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Archive</Button>
                                  <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-4 font-bold text-[10px]">VERIFY & RELEASE</Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <Card className="bg-white border-white shadow-sm overflow-hidden rounded-2xl h-[400px]">
                  <CardContent className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                      <TrendingUp className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Analyzer Engine</h3>
                    <p className="text-slate-500 max-w-sm mt-3 font-medium">
                      Compiling historical TAT data and clinical accuracy metrics. Report generation scheduled in 4m.
                    </p>
                    <Button className="mt-8 rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200 border-0 font-bold px-8" variant="outline">Force Sync</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </main>
      </div>

      <OrderNewTestForm
        open={showOrderForm}
        onOpenChange={setShowOrderForm}
        onTestOrdered={handleTestOrdered}
      />
    </MainLayout>
  );
};

export default LaboratoryModule;
