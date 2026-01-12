import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MainLayout from "@/components/layout/MainLayout";
import { TestTube, Plus, Search, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateLabTestData, generateSystemPatients } from "@/services/systemService";
import { OrderNewTestForm } from "@/components/laboratory/OrderNewTestForm";

const LaboratoryModule = () => {
  const [labTests, setLabTests] = useState(generateLabTestData());
  const [patients] = useState(generateSystemPatients());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [activeTab, setActiveTab] = useState("tests");
  const { toast } = useToast();

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
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
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

  const handleOrderTest = () => {
    setShowOrderForm(true);
  };

  const handleTestOrdered = (newTest: any) => {
    setLabTests(prev => [newTest, ...prev]);
    toast({
      title: "Test Ordered",
      description: `${newTest.test_type} has been successfully ordered for ${newTest.patient_name}.`,
    });
  };

  const handleUpdateTestStatus = (testId: string, newStatus: string) => {
    setLabTests(prev => prev.map(test =>
      test.id === testId ? { ...test, status: newStatus } : test
    ));
    toast({
      title: "Test Status Updated",
      description: `Test status updated to ${newStatus}`,
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
      title: "Results Added",
      description: "Test results have been successfully added.",
    });
  };

  const completedTests = labTests.filter(test => test.status === 'Completed').length;
  const pendingTests = labTests.filter(test => test.status === 'Pending').length;
  const inProgressTests = labTests.filter(test => test.status === 'In Progress').length;
  const testTypes = Array.from(new Set(labTests.map(test => test.test_type)));

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Left Sidebar Menu */}
        <aside className="w-full lg:w-64 flex-shrink-0 border-r bg-slate-50/50 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="h-full flex flex-col">
            <div className="p-4">
              <div className="flex items-center gap-2 px-2 mb-4">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <TestTube className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="font-semibold text-lg">Laboratory</h2>
              </div>

              <TabsList className="flex flex-col h-auto bg-transparent space-y-1 w-full p-0">
                <TabsTrigger value="tests" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <TestTube className="w-4 h-4 mr-2" /> Lab Tests
                </TabsTrigger>
                <TabsTrigger value="results" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <CheckCircle className="w-4 h-4 mr-2" /> Results
                </TabsTrigger>
                <TabsTrigger value="reports" className="w-full justify-start px-3 py-2 h-9 text-left font-medium rounded-md hover:bg-slate-100 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Clock className="w-4 h-4 mr-2" /> Analysis
                </TabsTrigger>
              </TabsList>

              <div className="mt-8 px-2">
                <Button onClick={handleOrderTest} className="w-full justify-start gap-2 shadow-sm">
                  <Plus className="h-4 w-4" />
                  Order New Test
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
                {activeTab === 'tests' ? 'Laboratory Orders' :
                  activeTab === 'results' ? 'Diagnostics Results' :
                    'Analytics & Reports'}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage lab tests, results, and patient diagnostics
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                  <TestTube className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{labTests.length}</div>
                  <p className="text-xs text-muted-foreground">All time tests</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingTests}</div>
                  <p className="text-xs text-muted-foreground">Awaiting processing</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{inProgressTests}</div>
                  <p className="text-xs text-muted-foreground">Currently processing</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{completedTests}</div>
                  <p className="text-xs text-muted-foreground">Results available</p>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} className="mt-0">
              <TabsContent value="tests" className="mt-0 space-y-4">
                {/* Filters */}
                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search tests or patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Test Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {testTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tests Table */}
                <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead>Test ID</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Test Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Ordered Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTests.slice(0, 15).map((test) => {
                          const patient = patients.find(p => p.id === test.patient_id);
                          return (
                            <TableRow key={test.id} className="hover:bg-slate-50/50">
                              <TableCell className="font-medium text-blue-600">{test.id}</TableCell>
                              <TableCell className="font-medium text-slate-900">{patient ? patient.name : 'Unknown Patient'}</TableCell>
                              <TableCell>{test.test_type}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(test.status)}>
                                  {test.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={getPriorityColor(test.priority)}>
                                  {test.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(test.ordered_date).toLocaleDateString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {test.status === 'Pending' && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8"
                                      onClick={() => handleUpdateTestStatus(test.id, 'In Progress')}
                                    >
                                      Process
                                    </Button>
                                  )}
                                  {test.status === 'In Progress' && (
                                    <Button
                                      size="sm"
                                      className="h-8"
                                      onClick={() => handleAddResults(test.id)}
                                    >
                                      Add Result
                                    </Button>
                                  )}
                                  {test.status === 'Completed' && (
                                    <Button size="sm" variant="outline" className="h-8">
                                      View Result
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="mt-0 space-y-4">
                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle>Recent Completed Results</CardTitle>
                    <CardDescription>Review and manage completed test results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {labTests
                        .filter(test => test.status === 'Completed' && test.results)
                        .slice(0, 10)
                        .map((test) => {
                          const patient = patients.find(p => p.id === test.patient_id);
                          return (
                            <div key={test.id} className="border rounded-lg p-4 bg-slate-50/30">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-slate-900">{test.test_type}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Patient: {patient ? patient.name : 'Unknown'} |
                                    ID: {test.id} |
                                    Date: {new Date(test.ordered_date).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant="default" className="bg-green-600">
                                  Final Result
                                </Badge>
                              </div>
                              <div className="mt-3 p-3 bg-white border border-slate-200 rounded-md">
                                <p className="text-sm text-slate-700 leading-relaxed font-medium">{test.results}</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="mt-0">
                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle>Laboratory Analytics</CardTitle>
                    <CardDescription>View detailed lab performance and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">Analytics Dashboard</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                        Detailed laboratory reports and efficiency metrics are being generated in real-time.
                      </p>
                      <Button className="mt-6" variant="outline">Refresh Data</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Order Test Form */}
      <OrderNewTestForm
        open={showOrderForm}
        onOpenChange={setShowOrderForm}
        onTestOrdered={handleTestOrdered}
      />
    </MainLayout>
  );
};

export default LaboratoryModule;
