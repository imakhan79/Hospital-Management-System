
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { fetchInventoryItems } from "@/services/inventoryService";
import { InventoryItem } from "@/types";

interface InventoryListProps {
  searchQuery: string;
}

export function InventoryList({ searchQuery }: InventoryListProps) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function loadInventoryItems() {
      try {
        setLoading(true);
        const data = await fetchInventoryItems();
        setItems(data);
      } catch (error) {
        console.error("Error loading inventory items:", error);
      } finally {
        setLoading(false);
      }
    }

    loadInventoryItems();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.category_name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
      setFilteredItems(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, items]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const getStockStatus = (current: number, minimum: number) => {
    const ratio = current / minimum;
    if (ratio < 0.5) return { label: "Low", variant: "destructive" };
    if (ratio < 1) return { label: "Warning", variant: "warning" };
    return { label: "Good", variant: "success" };
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
                    <TableHead>Item Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Purchase Price</TableHead>
                    <TableHead className="text-right">Selling Price</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((item) => {
                      const stockStatus = getStockStatus(item.current_stock, item.minimum_stock);
                      
                      return (
                        <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.category_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{item.current_stock}</span>
                              <Badge variant={stockStatus.label === "Good" ? "outline" : stockStatus.label === "Warning" ? "secondary" : "destructive"} className="text-xs">
                                {stockStatus.label}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell className="text-right">${item.purchase_price?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell className="text-right">${item.selling_price?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>
                            {item.expiry_date ? (
                              new Date(item.expiry_date) < new Date() ? (
                                <span className="text-destructive">{new Date(item.expiry_date).toLocaleDateString()}</span>
                              ) : (
                                new Date(item.expiry_date).toLocaleDateString()
                              )
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        No items found.
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
