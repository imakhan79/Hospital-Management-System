
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ClipboardList, ClipboardCheck } from "lucide-react";

interface LabTest {
  id: string;
  testId: string;
  patientName: string;
  testName: string;
  requestedBy: string;
  requestedDate: string;
  priority: string;
  status: string;
}

interface LabTestsProps {
  searchQuery: string;
}

export function LabTests({ searchQuery }: LabTestsProps) {
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 10;

  // Sample data
  const mockLabTests: LabTest[] = Array.from({ length: 50 }, (_, i) => ({
    id: `test-${i + 1}`,
    testId: `LT-${1000 + i}`,
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
    requestedBy: `Dr. ${["Smith", "Johnson", "Williams", "Jones", "Brown"][i % 5]}`,
    requestedDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    priority: ["Routine", "Urgent", "STAT"][i % 3],
    status: ["Pending", "Collected", "In Process"][i % 3]
  }));

  // Filter based on search query
  const filteredTests = searchQuery.trim() === ''
    ? mockLabTests
    : mockLabTests.filter(test => 
        test.testId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.requestedBy.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Pagination
  const totalPages = Math.ceil(filteredTests.length / testsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  const startIndex = (currentPage - 1) * testsPerPage;
  const paginatedTests = filteredTests.slice(startIndex, startIndex + testsPerPage);

  const getPriorityStyle = (priority: string) => {
    switch(priority.toLowerCase()) {
      case 'stat':
        return { label: "STAT", variant: "destructive" };
      case 'urgent':
        return { label: "Urgent", variant: "warning" };
      default:
        return { label: "Routine", variant: "outline" };
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'in process':
        return { label: "In Process", variant: "secondary" };
      case 'collected':
        return { label: "Collected", variant: "success" };
      default:
        return { label: "Pending", variant: "outline" };
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
                    <TableHead>Test ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTests.length > 0 ? (
                    paginatedTests.map((test) => {
                      const priorityStyle = getPriorityStyle(test.priority);
                      const statusStyle = getStatusStyle(test.status);
                      const date = new Date(test.requestedDate);
                      
                      return (
                        <TableRow key={test.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{test.testId}</TableCell>
                          <TableCell>{test.patientName}</TableCell>
                          <TableCell>{test.testName}</TableCell>
                          <TableCell>{test.requestedBy}</TableCell>
                          <TableCell>{date.toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                priorityStyle.variant === "destructive" ? "destructive" : 
                                priorityStyle.variant === "warning" ? "secondary" : 
                                "outline"
                              }
                            >
                              {priorityStyle.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                statusStyle.variant === "success" ? "default" : 
                                statusStyle.variant === "secondary" ? "secondary" : 
                                "outline"
                              }
                            >
                              {statusStyle.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" title="View Details">
                                <ClipboardList className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" title="Enter Results">
                                <ClipboardCheck className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No tests found.
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
