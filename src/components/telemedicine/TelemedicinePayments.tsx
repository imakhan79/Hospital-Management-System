import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  Download, 
  Send, 
  Eye, 
  RefreshCw,
  Search,
  Filter,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

interface Payment {
  id: string;
  consultationId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'processing';
  paymentMethod: 'card' | 'bank_transfer' | 'digital_wallet' | 'insurance';
  transactionId?: string;
  date: Date;
  dueDate: Date;
  consultationType: 'video' | 'audio' | 'chat';
  description: string;
  tax: number;
  insuranceClaim?: {
    claimId: string;
    provider: string;
    status: 'submitted' | 'approved' | 'denied' | 'processing';
    coveredAmount: number;
  };
}

interface PaymentStats {
  totalRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  failedPayments: number;
  refundedAmount: number;
}

export const TelemedicinePayments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      consultationId: 'c1',
      patientId: 'p1',
      patientName: 'John Doe',
      doctorId: 'd1',
      doctorName: 'Dr. Smith',
      amount: 150.00,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'card',
      transactionId: 'txn_1234567890',
      date: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      consultationType: 'video',
      description: 'Cardiology consultation - follow-up',
      tax: 15.00,
      insuranceClaim: {
        claimId: 'ins_001',
        provider: 'Blue Cross',
        status: 'approved',
        coveredAmount: 120.00
      }
    },
    {
      id: '2',
      consultationId: 'c2',
      patientId: 'p2',
      patientName: 'Jane Smith',
      doctorId: 'd2',
      doctorName: 'Dr. Davis',
      amount: 75.00,
      currency: 'USD',
      status: 'pending',
      paymentMethod: 'card',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      consultationType: 'video',
      description: 'General consultation',
      tax: 7.50
    },
    {
      id: '3',
      consultationId: 'c3',
      patientId: 'p3',
      patientName: 'Mike Johnson',
      doctorId: 'd1',
      doctorName: 'Dr. Smith',
      amount: 100.00,
      currency: 'USD',
      status: 'failed',
      paymentMethod: 'card',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      consultationType: 'audio',
      description: 'Cardiology consultation - initial',
      tax: 10.00
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesPaymentMethod = filterPaymentMethod === 'all' || payment.paymentMethod === filterPaymentMethod;
    const matchesSearch = payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPaymentMethod && matchesSearch;
  });

  const stats: PaymentStats = {
    totalRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    completedPayments: payments.filter(p => p.status === 'completed').length,
    failedPayments: payments.filter(p => p.status === 'failed').length,
    refundedAmount: payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'refunded': return <RefreshCw className="h-4 w-4 text-purple-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return '💳';
      case 'bank_transfer': return '🏦';
      case 'digital_wallet': return '📱';
      case 'insurance': return '🏥';
      default: return '💰';
    }
  };

  const handleProcessPayment = async (paymentId: string) => {
    try {
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'processing' as const }
          : payment
      ));

      toast({
        title: "Processing Payment",
        description: "Payment is being processed...",
      });

      // Simulate payment processing
      setTimeout(() => {
        setPayments(prev => prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: 'completed' as const, transactionId: `txn_${Date.now()}` }
            : payment
        ));
        
        toast({
          title: "Payment Completed",
          description: "Payment has been processed successfully",
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to process payment",
        variant: "destructive"
      });
    }
  };

  const handleRefundPayment = async (paymentId: string) => {
    try {
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'refunded' as const }
          : payment
      ));

      toast({
        title: "Payment Refunded",
        description: "Payment has been refunded successfully",
      });
    } catch (error) {
      toast({
        title: "Refund Failed",
        description: "Failed to process refund",
        variant: "destructive"
      });
    }
  };

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      toast({
        title: "Download Started",
        description: "Receipt is being generated...",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download receipt",
        variant: "destructive"
      });
    }
  };

  const handleSendReceipt = async (paymentId: string) => {
    try {
      toast({
        title: "Receipt Sent",
        description: "Receipt has been sent to patient's email",
      });
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Failed to send receipt",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
          Payment Management
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage payments and billing for telemedicine consultations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingPayments}
            </div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.completedPayments}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.failedPayments}
            </div>
            <p className="text-xs text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              ${stats.refundedAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Refunded</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPaymentMethod} onValueChange={setFilterPaymentMethod}>
              <SelectTrigger className="w-full sm:w-48">
                <CreditCard className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Credit Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map(payment => (
          <Card key={payment.id}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="text-lg font-semibold">{payment.patientName}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={getStatusColor(payment.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                      </Badge>
                      <Badge variant="outline">
                        {getPaymentMethodIcon(payment.paymentMethod)} {payment.paymentMethod.replace('_', ' ')}
                      </Badge>
                      <Badge variant="secondary">
                        {payment.consultationType}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Dr: {payment.doctorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {payment.date.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      ${payment.amount.toFixed(2)} {payment.currency}
                    </span>
                    {payment.transactionId && (
                      <span className="flex items-center gap-1">
                        <Receipt className="h-3 w-3" />
                        {payment.transactionId}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {payment.description}
                  </p>
                  
                  {payment.insuranceClaim && (
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">Insurance Claim</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <span>Provider: {payment.insuranceClaim.provider}</span>
                        <span>Status: {payment.insuranceClaim.status}</span>
                        <span>Covered: ${payment.insuranceClaim.coveredAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[200px]">
                  {payment.status === 'pending' && (
                    <Button 
                      onClick={() => handleProcessPayment(payment.id)}
                      className="flex-1 lg:w-full"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Process Payment</span>
                      <span className="sm:hidden">Process</span>
                    </Button>
                  )}
                  
                  {payment.status === 'failed' && (
                    <Button 
                      onClick={() => handleProcessPayment(payment.id)}
                      variant="outline"
                      className="flex-1 lg:w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Retry Payment</span>
                      <span className="sm:hidden">Retry</span>
                    </Button>
                  )}
                  
                  {payment.status === 'completed' && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => handleDownloadReceipt(payment.id)}
                        className="flex-1 lg:w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Download Receipt</span>
                        <span className="sm:hidden">Download</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleSendReceipt(payment.id)}
                        className="flex-1 lg:w-full"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Send Receipt</span>
                        <span className="sm:hidden">Send</span>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleRefundPayment(payment.id)}
                        className="flex-1 lg:w-full"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Refund</span>
                        <span className="sm:hidden">Refund</span>
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedPayment(payment);
                      setIsPaymentDialogOpen(true);
                    }}
                    className="flex-1 lg:w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">Details</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredPayments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No payments found</h3>
              <p className="text-muted-foreground">
                {payments.length === 0 
                  ? "No payments recorded yet." 
                  : "No payments match your current filters."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payment Details Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Payment Information</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>ID: {selectedPayment.id}</p>
                    <p>Amount: ${selectedPayment.amount.toFixed(2)} {selectedPayment.currency}</p>
                    <p>Tax: ${selectedPayment.tax.toFixed(2)}</p>
                    <p>Total: ${(selectedPayment.amount + selectedPayment.tax).toFixed(2)}</p>
                    <p>Method: {selectedPayment.paymentMethod.replace('_', ' ')}</p>
                    <p>Status: {selectedPayment.status}</p>
                    {selectedPayment.transactionId && (
                      <p>Transaction ID: {selectedPayment.transactionId}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium">Consultation Details</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Patient: {selectedPayment.patientName}</p>
                    <p>Doctor: {selectedPayment.doctorName}</p>
                    <p>Type: {selectedPayment.consultationType}</p>
                    <p>Date: {selectedPayment.date.toLocaleDateString()}</p>
                    <p>Due Date: {selectedPayment.dueDate.toLocaleDateString()}</p>
                    <p>Description: {selectedPayment.description}</p>
                  </div>
                </div>
              </div>
              
              {selectedPayment.insuranceClaim && (
                <div>
                  <h4 className="font-medium">Insurance Claim</h4>
                  <div className="space-y-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                    <p>Claim ID: {selectedPayment.insuranceClaim.claimId}</p>
                    <p>Provider: {selectedPayment.insuranceClaim.provider}</p>
                    <p>Status: {selectedPayment.insuranceClaim.status}</p>
                    <p>Covered Amount: ${selectedPayment.insuranceClaim.coveredAmount.toFixed(2)}</p>
                    <p>Patient Responsibility: ${(selectedPayment.amount - selectedPayment.insuranceClaim.coveredAmount).toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};