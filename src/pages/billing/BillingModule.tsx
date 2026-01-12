
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import MainLayout from "@/components/layout/MainLayout";
import { CreateInvoiceForm } from "@/components/billing/CreateInvoiceForm";
import { DollarSign, CreditCard, FileText, TrendingUp, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateBillingData } from "@/services/systemService";

const BillingModule = () => {
  const [billingData, setBillingData] = useState(generateBillingData());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const { toast } = useToast();

  const filteredBills = billingData.filter(bill => {
    const matchesSearch = bill.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || bill.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Partial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateInvoice = () => {
    setIsCreateInvoiceOpen(true);
  };

  const handleInvoiceCreated = (newInvoice: any) => {
    setBillingData(prev => [newInvoice, ...prev]);
  };

  const handleProcessPayment = (billId: string) => {
    setBillingData(prev => prev.map(bill => 
      bill.id === billId ? { ...bill, status: 'Paid', paid_amount: bill.amount } : bill
    ));
    toast({
      title: "Payment Processed",
      description: "Payment has been successfully processed.",
    });
  };

  const totalRevenue = billingData.reduce((sum, bill) => sum + bill.paid_amount, 0);
  const pendingAmount = billingData.filter(b => b.status === 'Pending').reduce((sum, bill) => sum + (bill.amount - bill.paid_amount), 0);

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Billing & Finance</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage invoices, payments, and financial reports
            </p>
          </div>
          <Button onClick={handleCreateInvoice} className="w-full sm:w-auto">
            <FileText className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. {pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {billingData.filter(b => b.status === 'Pending').length} invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{billingData.length}</div>
              <p className="text-xs text-muted-foreground">
                Total invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((billingData.filter(b => b.status === 'Paid').length / billingData.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Payment collection
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search invoices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                      <SelectItem value="Partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Invoices Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Manage patient billing and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBills.slice(0, 10).map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell className="font-medium">{bill.invoice_number}</TableCell>
                          <TableCell>{bill.patient_name}</TableCell>
                          <TableCell>Rs. {bill.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(bill.status)}>
                              {bill.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(bill.due_date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">View</Button>
                              {bill.status !== 'Paid' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleProcessPayment(bill.id)}
                                >
                                  Process Payment
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
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Processing</CardTitle>
                <CardDescription>Process and track payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Payment processing interface will be displayed here</p>
                  <Button className="mt-4">Process New Payment</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>View detailed financial analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Financial reports and analytics will be displayed here</p>
                  <Button className="mt-4">Generate Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <CreateInvoiceForm
          open={isCreateInvoiceOpen}
          onOpenChange={setIsCreateInvoiceOpen}
          onInvoiceCreated={handleInvoiceCreated}
        />
      </div>
    </MainLayout>
  );
};

export default BillingModule;
