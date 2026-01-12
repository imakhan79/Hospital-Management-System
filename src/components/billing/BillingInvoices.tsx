
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Printer, Send } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  patientName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: string;
}

interface BillingInvoicesProps {
  searchQuery: string;
}

export function BillingInvoices({ searchQuery }: BillingInvoicesProps) {
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 10;

  // Sample data
  const mockInvoices: Invoice[] = Array.from({ length: 50 }, (_, i) => ({
    id: `invoice-${i + 1}`,
    invoiceNumber: `INV-${10000 + i}`,
    patientName: `Patient ${i + 1}`,
    amount: Math.round((Math.random() * 1000 + 100) * 100) / 100,
    issueDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    dueDate: new Date(Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    status: ["Paid", "Pending", "Overdue", "Partial"][i % 4]
  }));

  // Filter based on search query
  const filteredInvoices = searchQuery.trim() === ''
    ? mockInvoices
    : mockInvoices.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.patientName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  const startIndex = (currentPage - 1) * invoicesPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + invoicesPerPage);

  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'paid':
        return { label: "Paid", variant: "success" };
      case 'pending':
        return { label: "Pending", variant: "secondary" };
      case 'overdue':
        return { label: "Overdue", variant: "destructive" };
      case 'partial':
        return { label: "Partial", variant: "warning" };
      default:
        return { label: status, variant: "default" };
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvoices.length > 0 ? (
                    paginatedInvoices.map((invoice) => {
                      const statusStyle = getStatusStyle(invoice.status);
                      const issueDate = new Date(invoice.issueDate);
                      const dueDate = new Date(invoice.dueDate);
                      const isOverdue = dueDate < new Date() && invoice.status.toLowerCase() !== 'paid';
                      
                      return (
                        <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                          <TableCell>{invoice.patientName}</TableCell>
                          <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                          <TableCell>{issueDate.toLocaleDateString()}</TableCell>
                          <TableCell className={isOverdue ? "text-red-500 font-medium" : ""}>
                            {dueDate.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                statusStyle.variant === "success" ? "default" : 
                                statusStyle.variant === "destructive" ? "destructive" : 
                                statusStyle.variant === "warning" ? "secondary" : 
                                "outline"
                              }
                            >
                              {statusStyle.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" title="View Invoice">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Print Invoice">
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Email Invoice">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No invoices found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="py-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {pageNumbers.map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
