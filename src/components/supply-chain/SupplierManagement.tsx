
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Star, MapPin, Phone, Mail, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: string;
  name: string;
  category: string;
  location: string;
  contact: string;
  email: string;
  rating: number;
  status: 'Active' | 'Inactive' | 'Pending';
  totalOrders: number;
  totalValue: number;
  lastOrder: string;
}

export function SupplierManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  const suppliers: Supplier[] = [
    {
      id: "SUP-001",
      name: "MedSupply Corporation",
      category: "Medical Supplies",
      location: "Mumbai, Maharashtra",
      contact: "+91 98765 43210",
      email: "orders@medsupply.com",
      rating: 4.8,
      status: "Active",
      totalOrders: 156,
      totalValue: 2450000,
      lastOrder: "2024-01-20"
    },
    {
      id: "SUP-002",
      name: "PharmaCo Limited",
      category: "Pharmaceuticals",
      location: "Delhi, NCR",
      contact: "+91 87654 32109",
      email: "supply@pharmaco.in",
      rating: 4.6,
      status: "Active",
      totalOrders: 89,
      totalValue: 1850000,
      lastOrder: "2024-01-18"
    },
    {
      id: "SUP-003",
      name: "EquipTech Solutions",
      category: "Medical Equipment",
      location: "Bangalore, Karnataka",
      contact: "+91 76543 21098",
      email: "sales@equiptech.com",
      rating: 4.9,
      status: "Active",
      totalOrders: 45,
      totalValue: 3200000,
      lastOrder: "2024-01-15"
    },
    {
      id: "SUP-004",
      name: "LabChem Industries",
      category: "Laboratory Supplies",
      location: "Pune, Maharashtra",
      contact: "+91 65432 10987",
      email: "orders@labchem.co.in",
      rating: 4.3,
      status: "Active",
      totalOrders: 67,
      totalValue: 980000,
      lastOrder: "2024-01-12"
    },
    {
      id: "SUP-005",
      name: "SurgiTools Pvt Ltd",
      category: "Surgical Instruments",
      location: "Chennai, Tamil Nadu",
      contact: "+91 54321 09876",
      email: "info@surgitools.com",
      rating: 4.7,
      status: "Pending",
      totalOrders: 12,
      totalValue: 560000,
      lastOrder: "2024-01-08"
    }
  ];

  const categories = Array.from(new Set(suppliers.map(s => s.category)));

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || supplier.category === filterCategory;
    const matchesStatus = filterStatus === "all" || supplier.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Supplier Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Supplier
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Directory</CardTitle>
          <CardDescription>Manage your supplier relationships and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-sm text-muted-foreground">{supplier.category}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {supplier.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {supplier.contact}
                        </div>
                        <div className="text-sm flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {supplier.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderStarRating(supplier.rating)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(supplier.status)}>
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{supplier.totalOrders}</TableCell>
                    <TableCell className="text-right">₹{supplier.totalValue.toLocaleString()}</TableCell>
                    <TableCell>{new Date(supplier.lastOrder).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
