
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { InventoryTransaction } from "@/types";
import { fetchInventoryTransactions } from "@/services/inventoryService";

interface InventoryTransactionsProps {
  searchQuery: string;
}

export function InventoryTransactions({ searchQuery }: InventoryTransactionsProps) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<InventoryTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const data = await fetchInventoryTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching inventory transactions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = transactions.filter(transaction => 
        transaction.item_name.toLowerCase().includes(query) ||
        transaction.transaction_type.toLowerCase().includes(query) ||
        transaction.reference_number.toLowerCase().includes(query) ||
        transaction.created_by.toLowerCase().includes(query) ||
        (transaction.notes && transaction.notes.toLowerCase().includes(query))
      );
      setFilteredTransactions(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, transactions]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);

  const getTransactionTypeStyle = (type: string) => {
    switch(type.toLowerCase()) {
      case 'purchase':
        return { label: "Purchase", variant: "success" };
      case 'sale':
        return { label: "Sale", variant: "destructive" };
      case 'return':
        return { label: "Return", variant: "warning" };
      case 'adjustment':
        return { label: "Adjustment", variant: "secondary" };
      case 'transfer':
        return { label: "Transfer", variant: "outline" };
      default:
        return { label: type, variant: "default" };
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
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead>Reference #</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((transaction) => {
                      const typeStyle = getTransactionTypeStyle(transaction.transaction_type);
                      const date = new Date(transaction.transaction_date);
                      
                      return (
                        <TableRow key={transaction.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>
                            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </TableCell>
                          <TableCell className="font-medium">{transaction.item_name}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                typeStyle.variant === "success" ? "default" : 
                                typeStyle.variant === "destructive" ? "destructive" : 
                                typeStyle.variant === "warning" ? "secondary" : 
                                "outline"
                              }
                            >
                              {typeStyle.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {transaction.transaction_type.toLowerCase() === 'sale' ? '-' : '+'}{transaction.quantity}
                          </TableCell>
                          <TableCell>{transaction.reference_number}</TableCell>
                          <TableCell>{transaction.created_by}</TableCell>
                          <TableCell className="max-w-xs truncate" title={transaction.notes}>
                            {transaction.notes || '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No transactions found.
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
