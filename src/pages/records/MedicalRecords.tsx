import { useState, useEffect } from "react";
import { fetchMedicalRecords, fetchPatientsList, createMedicalRecord } from "@/services/medicalRecordService";
import { MedicalRecord } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  FileText,
  PlusCircle,
  Loader2
} from "lucide-react";

export function MedicalRecords() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterDoctor, setFilterDoctor] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [patients, setPatients] = useState<{ id: string, name: string }[]>([]);

  // New record form state
  const [newRecord, setNewRecord] = useState<Omit<MedicalRecord, "id" | "created_at" | "updated_at">>({
    patient_id: "",
    record_date: new Date().toISOString().split('T')[0],
    diagnosis: "",
    symptoms: "",
    treatment: "",
    medication: "",
    notes: "",
    doctor: "",
    department: ""
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch medical records
  useEffect(() => {
    async function loadRecords() {
      setLoading(true);
      try {
        const recordsPerPage = 10;
        const filterOptions = {
          department: filterDepartment || undefined,
          doctor: filterDoctor || undefined,
        };
        const response = await fetchMedicalRecords(
          currentPage,
          recordsPerPage,
          debouncedSearchTerm,
          filterOptions
        );
        
        setRecords(response.records);
        setTotalRecords(response.count);
      } catch (error) {
        console.error("Error loading medical records:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load medical records. Please try again."
        });
      } finally {
        setLoading(false);
      }
    }

    loadRecords();
  }, [currentPage, debouncedSearchTerm, filterDepartment, filterDoctor, toast]);

  // Fetch patients list for the dropdown
  useEffect(() => {
    async function loadPatients() {
      try {
        const patientList = await fetchPatientsList();
        setPatients(patientList);
      } catch (error) {
        console.error("Error loading patients:", error);
      }
    }

    if (isAddDialogOpen) {
      loadPatients();
    }
  }, [isAddDialogOpen]);

  const handleAddRecord = async () => {
    try {
      const result = await createMedicalRecord(newRecord);
      
      if (result.success) {
        toast({
          title: "Record Added",
          description: "Medical record has been successfully created"
        });
        
        // Reset form and refresh records
        setNewRecord({
          patient_id: "",
          record_date: new Date().toISOString().split('T')[0],
          diagnosis: "",
          symptoms: "",
          treatment: "",
          medication: "",
          notes: "",
          doctor: "",
          department: ""
        });
        setIsAddDialogOpen(false);
        
        // Refresh records
        const response = await fetchMedicalRecords(
          currentPage, 
          10, 
          debouncedSearchTerm, 
          {
            department: filterDepartment || undefined,
            doctor: filterDoctor || undefined,
          }
        );
        setRecords(response.records);
        setTotalRecords(response.count);
      } else {
        throw new Error(result.error || "Failed to create record");
      }
    } catch (error) {
      console.error("Error adding record:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add record"
      });
    }
  };

  const handleInputChange = (field: keyof typeof newRecord, value: string) => {
    setNewRecord(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalRecords / 10);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(page => 
    page === 1 || 
    page === totalPages || 
    Math.abs(page - currentPage) < 3
  ).sort((a, b) => a - b);

  // Render list with pagination
  const renderRecords = () => {
    if (loading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: 6 }).map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-6" />
            </TableCell>
          ))}
        </TableRow>
      ));
    }

    if (records.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-10">
            <div className="flex flex-col items-center justify-center space-y-2">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="text-lg font-medium">No records found</p>
              <p className="text-sm text-muted-foreground">
                {debouncedSearchTerm || filterDepartment || filterDoctor
                  ? "Try adjusting your search or filters"
                  : "Get started by adding a new record"}
              </p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return records.map((record) => (
      <TableRow key={record.id} className="hover:bg-muted/50 cursor-pointer">
        <TableCell>{record.record_date}</TableCell>
        <TableCell>{`Patient ${record.patient_id.split('-')[1]}`}</TableCell>
        <TableCell>{record.diagnosis || "—"}</TableCell>
        <TableCell>{record.doctor}</TableCell>
        <TableCell>{record.department || "—"}</TableCell>
        <TableCell className="text-right">
          <Button size="sm" variant="ghost">View</Button>
        </TableCell>
      </TableRow>
    ));
  };

  // Render pagination
  const renderPagination = () => {
    if (totalRecords <= 10) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
            />
          </PaginationItem>

          {visiblePages.map((page, index) => {
            // Add ellipsis
            if (index > 0 && visiblePages[index - 1] !== page - 1) {
              return (
                <PaginationItem key={`ellipsis-${page}`}>
                  <PaginationLink>...</PaginationLink>
                </PaginationItem>
              );
            }
            
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Medical Records</h1>
        
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Record
        </Button>
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search records..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by Department" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_departments">All Departments</SelectItem>
            <SelectItem value="Cardiology">Cardiology</SelectItem>
            <SelectItem value="Neurology">Neurology</SelectItem>
            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
            <SelectItem value="Dermatology">Dermatology</SelectItem>
            <SelectItem value="Oncology">Oncology</SelectItem>
            <SelectItem value="Emergency">Emergency</SelectItem>
            <SelectItem value="General Medicine">General Medicine</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterDoctor} onValueChange={setFilterDoctor}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by Doctor" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_doctors">All Doctors</SelectItem>
            <SelectItem value="Dr. Muhammad Iqbal">Dr. Muhammad Iqbal</SelectItem>
            <SelectItem value="Dr. Fatima Shah">Dr. Fatima Shah</SelectItem>
            <SelectItem value="Dr. Ahmed Ali">Dr. Ahmed Ali</SelectItem>
            <SelectItem value="Dr. Ayesha Khan">Dr. Ayesha Khan</SelectItem>
            <SelectItem value="Dr. Hassan Malik">Dr. Hassan Malik</SelectItem>
            <SelectItem value="Dr. Zainab Ahmed">Dr. Zainab Ahmed</SelectItem>
            <SelectItem value="Dr. Usman Tariq">Dr. Usman Tariq</SelectItem>
            <SelectItem value="Dr. Sana Hussain">Dr. Sana Hussain</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Records table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderRecords()}
            </TableBody>
          </Table>
          
          {renderPagination()}
        </CardContent>
      </Card>

      {/* Add record dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Medical Record</DialogTitle>
            <DialogDescription>
              Enter the details for the new medical record.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select 
                value={newRecord.patient_id} 
                onValueChange={value => handleInputChange('patient_id', value)}
              >
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="record-date">Record Date</Label>
              <Input 
                id="record-date" 
                type="date" 
                value={newRecord.record_date} 
                onChange={e => handleInputChange('record_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              <Select 
                value={newRecord.doctor} 
                onValueChange={value => handleInputChange('doctor', value)}
              >
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Muhammad Iqbal">Dr. Muhammad Iqbal</SelectItem>
                  <SelectItem value="Dr. Fatima Shah">Dr. Fatima Shah</SelectItem>
                  <SelectItem value="Dr. Ahmed Ali">Dr. Ahmed Ali</SelectItem>
                  <SelectItem value="Dr. Ayesha Khan">Dr. Ayesha Khan</SelectItem>
                  <SelectItem value="Dr. Hassan Malik">Dr. Hassan Malik</SelectItem>
                  <SelectItem value="Dr. Zainab Ahmed">Dr. Zainab Ahmed</SelectItem>
                  <SelectItem value="Dr. Usman Tariq">Dr. Usman Tariq</SelectItem>
                  <SelectItem value="Dr. Sana Hussain">Dr. Sana Hussain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={newRecord.department || "General Medicine"} 
                onValueChange={value => handleInputChange('department', value)}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="Dermatology">Dermatology</SelectItem>
                  <SelectItem value="Oncology">Oncology</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="General Medicine">General Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input 
                id="diagnosis" 
                value={newRecord.diagnosis || ""} 
                onChange={e => handleInputChange('diagnosis', e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="symptoms">Symptoms</Label>
              <Textarea 
                id="symptoms" 
                value={newRecord.symptoms || ""} 
                onChange={e => handleInputChange('symptoms', e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="treatment">Treatment</Label>
              <Textarea 
                id="treatment" 
                value={newRecord.treatment || ""} 
                onChange={e => handleInputChange('treatment', e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="medication">Medication</Label>
              <Input 
                id="medication" 
                value={newRecord.medication || ""} 
                onChange={e => handleInputChange('medication', e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea 
                id="notes" 
                value={newRecord.notes || ""} 
                onChange={e => handleInputChange('notes', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddRecord}>Add Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MedicalRecords;
