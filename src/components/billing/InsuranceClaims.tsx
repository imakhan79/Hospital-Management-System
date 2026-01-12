
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, RotateCw, AlertOctagon } from "lucide-react";

interface Claim {
  id: string;
  claimNumber: string;
  patientName: string;
  provider: string;
  amount: number;
  submissionDate: string;
  status: string;
  rejectionReason: string | null;
}

interface InsuranceClaimsProps {
  searchQuery: string;
}

export function InsuranceClaims({ searchQuery }: InsuranceClaimsProps) {
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const claimsPerPage = 10;

  // Sample data
  const mockClaims: Claim[] = Array.from({ length: 50 }, (_, i) => {
    const status = ["Approved", "Pending", "Rejected", "In Review"][i % 4];
    return {
      id: `claim-${i + 1}`,
      claimNumber: `CLM-${20000 + i}`,
      patientName: `Patient ${i + 1}`,
      provider: ["BlueCross", "Aetna", "UnitedHealth", "Medicare", "Medicaid", "Kaiser", "Cigna", "Humana"][i % 8],
      amount: Math.round((Math.random() * 2000 + 200) * 100) / 100,
      submissionDate: new Date(Date.now() - Math.floor(Math.random() * 45 * 24 * 60 * 60 * 1000)).toISOString(),
      status,
      rejectionReason: status === "Rejected" ? 
        ["Missing information", "Service not covered", "Prior authorization required", "Duplicate claim", "Coding error"][i % 5] : 
        null
    };
  });

  // Filter based on search query
  const filteredClaims = searchQuery.trim() === ''
    ? mockClaims
    : mockClaims.filter(claim => 
        claim.claimNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Pagination
  const totalPages = Math.ceil(filteredClaims.length / claimsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  const startIndex = (currentPage - 1) * claimsPerPage;
  const paginatedClaims = filteredClaims.slice(startIndex, startIndex + claimsPerPage);

  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return { label: "Approved", variant: "success" };
      case 'pending':
        return { label: "Pending", variant: "secondary" };
      case 'rejected':
        return { label: "Rejected", variant: "destructive" };
      case 'in review':
        return { label: "In Review", variant: "warning" };
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
                    <TableHead>Claim #</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Insurance Provider</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClaims.length > 0 ? (
                    paginatedClaims.map((claim) => {
                      const statusStyle = getStatusStyle(claim.status);
                      const submissionDate = new Date(claim.submissionDate);
                      
                      return (
                        <TableRow key={claim.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">{claim.claimNumber}</TableCell>
                          <TableCell>{claim.patientName}</TableCell>
                          <TableCell>{claim.provider}</TableCell>
                          <TableCell className="text-right">${claim.amount.toFixed(2)}</TableCell>
                          <TableCell>{submissionDate.toLocaleDateString()}</TableCell>
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
                          <TableCell className="max-w-xs">
                            {claim.rejectionReason ? (
                              <div className="flex items-center text-red-500">
                                <AlertOctagon className="h-3 w-3 mr-1" />
                                <span className="truncate" title={claim.rejectionReason}>{claim.rejectionReason}</span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" title="View Claim">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {(claim.status === "Rejected" || claim.status === "Pending") && (
                                <Button variant="ghost" size="icon" title="Resubmit Claim">
                                  <RotateCw className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No claims found.
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
