
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, FileDown, AlertCircle } from "lucide-react";

interface LabResult {
  id: string;
  resultId: string;
  patientName: string;
  testName: string;
  resultDate: string;
  performedBy: string;
  abnormal: boolean;
  status: string;
}

interface LabResultsProps {
  searchQuery: string;
}

export function LabResults({ searchQuery }: LabResultsProps) {
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Sample data
  const mockLabResults: LabResult[] = Array.from({ length: 50 }, (_, i) => ({
    id: `result-${i + 1}`,
    resultId: `LR-${2000 + i}`,
    patientName: `Patient ${i + 1}`,
    testName: [
      "Complete Blood Count",
      "Comprehensive Metabolic Panel",
      "Lipid Panel",
      "Thyroid Function Test",
      "Urinalysis",
      "Hemoglobin A1C",
      "Liver Function Test",
      "X-Ray",
      "MRI Scan",
      "CT Scan"
    ][i % 10],
    resultDate: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString(),
    performedBy: `Lab Tech ${["Adams", "Baker", "Clark", "Davis", "Evans"][i % 5]}`,
    abnormal: i % 3 === 0,
    status: ["Preliminary", "Final", "Amended"][i % 3]
  }));

  // Filter based on search query
  const filteredResults = searchQuery.trim() === ''
    ? mockLabResults
    : mockLabResults.filter(result => 
        result.resultId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.performedBy.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + resultsPerPage);

  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'preliminary':
        return { label: "Preliminary", variant: "warning" };
      case 'final':
        return { label: "Final", variant: "success" };
      case 'amended':
        return { label: "Amended", variant: "secondary" };
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
                    <TableHead>Result ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length > 0 ? (
                    paginatedResults.map((result) => {
                      const statusStyle = getStatusStyle(result.status);
                      const date = new Date(result.resultDate);
                      
                      return (
                        <TableRow key={result.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{result.resultId}</TableCell>
                          <TableCell>{result.patientName}</TableCell>
                          <TableCell>{result.testName}</TableCell>
                          <TableCell>{date.toLocaleDateString()}</TableCell>
                          <TableCell>{result.performedBy}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                statusStyle.variant === "success" ? "default" : 
                                statusStyle.variant === "warning" ? "secondary" : 
                                "outline"
                              }
                            >
                              {statusStyle.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {result.abnormal && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                <span>Abnormal</span>
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" title="View Results">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Download Report">
                                <FileDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No results found.
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
