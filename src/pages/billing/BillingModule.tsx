
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
import { DollarSign, CreditCard, FileText, TrendingUp, Search, Filter, ChevronRight, PieChart, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateBillingData } from "@/services/systemService";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const BillingModule = () => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [billingData, setBillingData] = useState(generateBillingData());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const { toast } = useToast();

  const menuItems = [
    { value: "invoices", label: "Invoice History", icon: <FileText className="w-4 h-4" /> },
    { value: "payments", label: "Process Payment", icon: <Wallet className="w-4 h-4" /> },
    { value: "reports", label: "Fiscal Reports", icon: <PieChart className="w-4 h-4" /> },
  ];

  const filteredBills = billingData.filter(bill => {
    const matchesSearch = bill.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || bill.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Overdue': return 'bg-red-50 text-red-700 border-red-200';
      case 'Partial': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleCreateInvoice = () => {
    setIsCreateInvoiceOpen(true);
  };

  const handleInvoiceCreated = (newInvoice: any) => {
    setBillingData(prev => [newInvoice, ...prev]);
    toast({
      title: "Invoice Generated",
      description: `Invoice ${newInvoice.invoice_number} has been created.`,
    });
  };

  const handleProcessPayment = (billId: string) => {
    setBillingData(prev => prev.map(bill =>
      bill.id === billId ? { ...bill, status: 'Paid', paid_amount: bill.amount } : bill
    ));
    toast({
      title: "Payment Processed",
      description: "Transaction confirmed successfully.",
    });
  };

  const totalRevenue = billingData.reduce((sum, bill) => sum + bill.paid_amount, 0);
  const pendingAmount = billingData.filter(b => b.status === 'Pending').reduce((sum, bill) => sum + (bill.amount - bill.paid_amount), 0);

  return (
    <MainLayout noPadding>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50/50">
        {/* Column 2: Billing Submenu panel */}
        <aside className="w-72 flex-shrink-0 bg-white border-r shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 hidden md:flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-6">Finance Dept</h2>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    activeTab === item.value
                      ? "bg-slate-900 text-white rounded-xl"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      activeTab === item.value ? "bg-white/10" : "bg-slate-100/50 group-hover:bg-slate-100"
                    )}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {activeTab === item.value && <ChevronRight className="w-4 h-4 opacity-50" />}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <Button onClick={handleCreateInvoice} className="w-full justify-start gap-2 bg-slate-900 hover:bg-slate-800 shadow-xl h-11 rounded-xl font-bold text-xs uppercase tracking-widest">
                <FileText className="h-4 w-4" />
                New Invoice
              </Button>
            </div>
          </div>

          <div className="mt-auto p-4 m-4 rounded-2xl bg-indigo-600 text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-wider font-bold opacity-80">Fiscal Summary</p>
              <h3 className="text-lg font-bold mt-1">Collections</h3>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[78%]"></div>
                </div>
                <span className="text-[10px] font-bold">78%</span>
              </div>
            </div>
            <DollarSign className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
          </div>
        </aside>

        {/* Column 3: Main Content area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                  {activeTab === 'invoices' ? 'Billing History' :
                    activeTab === 'payments' ? 'Cashier Terminal' :
                      'Revenue Analytics'}
                </h1>
                <p className="text-slate-500 font-medium">
                  Financial transactions, ledger management and revenue reconciliation.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="bg-white border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gross Revenue</CardTitle>
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                      <DollarSign className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">Rs. {totalRevenue.toLocaleString()}</div>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-widest">+12.4% MONTHly</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-white shadow-[0_4px_20_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-red-500">Unpaid Balance</CardTitle>
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:scale-110 transition-transform">
                      <CreditCard className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-red-600">Rs. {pendingAmount.toLocaleString()}</div>
                    <p className="text-[10px] text-red-400 font-bold mt-1 uppercase tracking-widest">{billingData.filter(b => b.status === 'Pending').length} PENDING INVOICES</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-white shadow-[0_4px_20_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Transaction Count</CardTitle>
                    <div className="p-2 bg-slate-50 text-slate-600 rounded-lg group-hover:scale-110 transition-transform">
                      <FileText className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">{billingData.length}</div>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Invoices Generated</p>
                  </CardContent>
                </Card>

                <Card className="bg-white border-white shadow-[0_4px_20_rgba(0,0,0,0.03)] group transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Collection Rate</CardTitle>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-slate-900">
                      {Math.round((billingData.filter(b => b.status === 'Paid').length / billingData.length) * 100)}%
                    </div>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-widest tracking-tighter">EFficiency Score</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {activeTab === 'invoices' && (
                  <>
                    <Card className="bg-white border-white shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="Search by Patient MRN, Name or Invoice ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11 border-slate-100 bg-slate-50/50 focus:bg-white rounded-xl"
                              />
                            </div>
                          </div>

                          <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full sm:w-[180px] h-11 border-slate-100 rounded-xl">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Overdue">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-white shadow-sm overflow-hidden rounded-2xl">
                      <Table>
                        <TableHeader className="bg-slate-50/50">
                          <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-500">Invoice ID</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Patient</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-right">Amount</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500 text-center">Status</TableHead>
                            <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Due Date</TableHead>
                            <TableHead className="text-right font-black uppercase text-[10px] tracking-widest text-slate-500 pr-6">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBills.slice(0, 15).map((bill) => (
                            <TableRow key={bill.id} className="hover:bg-slate-50/30 border-slate-50 transition-colors">
                              <TableCell className="py-4 font-mono text-[10px] font-bold text-slate-900 tracking-tighter">{bill.invoice_number}</TableCell>
                              <TableCell className="font-black text-slate-800 text-sm uppercase tracking-tight">{bill.patient_name}</TableCell>
                              <TableCell className="text-right font-black text-slate-900">Rs. {bill.amount.toLocaleString()}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className={cn("border-0 font-bold px-3 py-1 rounded-full text-[10px]", getStatusColor(bill.status))}>
                                  {bill.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs font-bold text-slate-400">{new Date(bill.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                              <TableCell className="text-right pr-6">
                                <div className="flex justify-end gap-2">
                                  <Button size="sm" variant="ghost" className="h-8 font-black text-[10px] uppercase text-slate-400 hover:text-slate-900">View</Button>
                                  {bill.status !== 'Paid' && (
                                    <Button
                                      size="sm"
                                      className="h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] px-4 shadow-md"
                                      onClick={() => handleProcessPayment(bill.id)}
                                    >
                                      COLLECT
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  </>
                )}

                {activeTab === 'payments' && (
                  <Card className="bg-white border-white shadow-sm overflow-hidden rounded-2xl h-[400px]">
                    <CardContent className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                        <Wallet className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Terminal Ready</h3>
                      <p className="text-slate-500 max-w-sm mt-3 font-medium text-sm">
                        Integrated payment gateway active. Scan QR code or swipe card to initiate secure transaction.
                      </p>
                      <Button className="mt-8 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold px-8 h-12 shadow-xl uppercase tracking-widest text-xs">Awaiting Input</Button>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'reports' && (
                  <Card className="bg-white border-white shadow-sm overflow-hidden rounded-2xl h-[400px]">
                    <CardContent className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                        <PieChart className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Financial Intelligence</h3>
                      <p className="text-slate-500 max-w-sm mt-3 font-medium text-sm">
                        Data aggregation in progress. Annual revenue forecasting and department EBITDA reports will be available shortly.
                      </p>
                      <Button className="mt-8 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold px-8 h-12 shadow-xl uppercase tracking-widest text-xs">Run Audit</Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>

      <CreateInvoiceForm
        open={isCreateInvoiceOpen}
        onOpenChange={setIsCreateInvoiceOpen}
        onInvoiceCreated={handleInvoiceCreated}
      />
    </MainLayout>
  );
};

export default BillingModule;
