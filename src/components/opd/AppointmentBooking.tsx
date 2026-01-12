
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Video,
  CreditCard,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  UserPlus,
  QrCode
} from "lucide-react";
import { fetchDepartments, getAvailableSlots, createAppointment, Department, TimeSlot, Doctor } from "@/services/opdService";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { WalkInRegistration } from "./WalkInRegistration";

export const AppointmentBooking = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<'online' | 'walk-in'>('online');
  const [consultationType, setConsultationType] = useState<'physical' | 'video'>('physical');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [appointmentNumber, setAppointmentNumber] = useState<string>("");

  // Form data
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    patientId: '',
    symptoms: '',
    notes: '',
    emergencyContact: '',
    address: '',
    age: '',
    gender: ''
  });

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment && selectedDoctor && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDepartment, selectedDoctor, selectedDate]);

  const loadDepartments = async () => {
    try {
      const depts = await fetchDepartments();
      setDepartments(depts);
    } catch (error) {
      console.error('Error loading departments:', error);
      toast.error('Failed to load departments');
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedDepartment || !selectedDoctor || !selectedDate) return;

    setLoading(true);
    try {
      const slots = await getAvailableSlots(
        selectedDepartment,
        selectedDoctor,
        format(selectedDate, 'yyyy-MM-dd')
      );
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading slots:', error);
      toast.error('Failed to load available slots');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedDepartment || !selectedDoctor) {
      toast.error('Please select department and doctor');
      return;
    }

    if (appointmentType === 'online' && (!selectedDate || !selectedSlot)) {
      toast.error('Please select date and time for online booking');
      return;
    }

    if (!formData.patientName || !formData.patientPhone) {
      toast.error('Patient name and phone are required');
      return;
    }

    setLoading(true);
    try {
      const selectedDept = departments.find(d => d.id === selectedDepartment);
      const selectedDoc = selectedDept?.doctors.find(d => d.id === selectedDoctor);

      const appointmentData = {
        patientName: formData.patientName,
        patientPhone: formData.patientPhone,
        patientEmail: formData.patientEmail,
        patientId: formData.patientId || `P${Date.now()}`,
        department: selectedDept?.name,
        doctor: selectedDoc?.name,
        appointmentDate: appointmentType === 'walk-in' ? format(new Date(), 'yyyy-MM-dd') : format(selectedDate!, 'yyyy-MM-dd'),
        appointmentTime: appointmentType === 'walk-in' ? format(new Date(), 'HH:mm') : selectedSlot,
        appointmentType,
        consultationType,
        symptoms: formData.symptoms,
        notes: formData.notes
      };

      const newAppointment = await createAppointment(appointmentData);
      setAppointmentNumber(newAppointment.appointmentNumber);
      setShowSuccess(true);

      if (appointmentType === 'walk-in') {
        toast.success(`Walk-in registered successfully! Queue number: ${Math.floor(Math.random() * 20) + 1}`);
      } else {
        toast.success('Appointment booked successfully!');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDepartment('');
    setSelectedDoctor('');
    setSelectedDate(new Date());
    setSelectedSlot('');
    setFormData({
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      patientId: '',
      symptoms: '',
      notes: '',
      emergencyContact: '',
      address: '',
      age: '',
      gender: ''
    });
    setShowSuccess(false);
    setAppointmentNumber('');
  };

  const selectedDept = departments.find(d => d.id === selectedDepartment);
  const selectedDoc = selectedDept?.doctors.find(d => d.id === selectedDoctor);

  // Success Screen
  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <div>
                <h3 className="text-2xl font-bold text-green-900 mb-2">
                  {appointmentType === 'walk-in' ? 'Walk-in Registered Successfully!' : 'Appointment Booked Successfully!'}
                </h3>
                <p className="text-green-700 mb-4">
                  {appointmentType === 'walk-in'
                    ? 'Patient has been registered and added to the queue'
                    : 'Your appointment has been confirmed. You will receive a confirmation message shortly.'
                  }
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Appointment Number:</span>
                  <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">{appointmentNumber}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-medium">{formData.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">{selectedDept?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-medium">{selectedDoc?.name}</span>
                </div>
                {appointmentType === 'walk-in' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Queue Number:</span>
                    <Badge variant="outline" className="text-lg">{Math.floor(Math.random() * 20) + 1}</Badge>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={resetForm} size="lg" className="flex-1 sm:flex-none">
                  {appointmentType === 'walk-in' ? 'Register Another Patient' : 'Book Another Appointment'}
                </Button>
                <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                  <QrCode className="h-4 w-4 mr-2" />
                  Show QR Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            Book Appointment
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Schedule online appointments or register walk-in patients
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={appointmentType} onValueChange={(value) => setAppointmentType(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
              <TabsTrigger value="online" className="text-sm sm:text-base py-2 sm:py-3">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Online Booking
              </TabsTrigger>
              <TabsTrigger value="walk-in" className="text-sm sm:text-base py-2 sm:py-3">
                <UserPlus className="h-4 w-4 mr-2" />
                Walk-in Registration
              </TabsTrigger>
            </TabsList>

            <TabsContent value="online" className="mt-0">
              {/* ... Online Booking Content (kept as is) ... */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column - Selection */}
                <div className="space-y-6">
                  {/* Department & Doctor Selection */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        Select Department & Doctor
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-sm font-medium">Department *</Label>
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose department" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border shadow-lg z-50">
                            {departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id} className="cursor-pointer">
                                <div className="flex flex-col py-1">
                                  <span className="font-medium">{dept.name}</span>
                                  <span className="text-xs text-muted-foreground">{dept.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedDepartment && (
                        <div className="space-y-2">
                          <Label htmlFor="doctor" className="text-sm font-medium">Doctor *</Label>
                          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose doctor" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-lg z-50">
                              {selectedDept?.doctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id} className="cursor-pointer">
                                  <div className="flex flex-col py-1">
                                    <span className="font-medium">{doctor.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {doctor.qualification} • {doctor.experience} years • ₹{doctor.consultationFee}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {selectedDoc && (
                        <div className="p-4 border rounded-lg bg-muted/30 mt-4">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-white">★ {selectedDoc.rating}</Badge>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">₹{selectedDoc.consultationFee}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {selectedDoc.qualification} • {selectedDoc.experience} years experience
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Date & Time Selection */}
                  {selectedDoctor && (
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                          Select Date & Time
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Appointment Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal h-10",
                                  !selectedDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {selectedDate && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Available Time Slots *</Label>
                            {loading ? (
                              <div className="text-center py-4">Loading slots...</div>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {availableSlots.filter(slot => slot.available).map((slot) => (
                                  <Button
                                    key={slot.time}
                                    variant={selectedSlot === slot.time ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedSlot(slot.time)}
                                    className="text-xs h-8"
                                  >
                                    {slot.time}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Consultation Type</Label>
                          <RadioGroup value={consultationType} onValueChange={(value) => setConsultationType(value as any)} className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="physical" id="physical" />
                              <Label htmlFor="physical" className="flex items-center gap-2 text-sm cursor-pointer">
                                <MapPin className="h-4 w-4" />
                                In-person consultation
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="video" id="video" />
                              <Label htmlFor="video" className="flex items-center gap-2 text-sm cursor-pointer">
                                <Video className="h-4 w-4" />
                                Video consultation
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right Column - Patient Information */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        Patient Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patientName" className="text-sm font-medium">Full Name *</Label>
                          <Input
                            id="patientName"
                            value={formData.patientName}
                            onChange={(e) => handleInputChange('patientName', e.target.value)}
                            placeholder="Enter patient name"
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientId" className="text-sm font-medium">Patient ID</Label>
                          <Input
                            id="patientId"
                            value={formData.patientId}
                            onChange={(e) => handleInputChange('patientId', e.target.value)}
                            placeholder="Auto-generated"
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="patientPhone" className="text-sm font-medium">Phone Number *</Label>
                          <Input
                            id="patientPhone"
                            value={formData.patientPhone}
                            onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                            placeholder="+92 300 1234567"
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientEmail" className="text-sm font-medium">Email</Label>
                          <Input
                            id="patientEmail"
                            type="email"
                            value={formData.patientEmail}
                            onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                            placeholder="patient@email.com"
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age" className="text-sm font-medium">Age</Label>
                          <Input
                            id="age"
                            value={formData.age}
                            onChange={(e) => handleInputChange('age', e.target.value)}
                            placeholder="25"
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border shadow-lg z-50">
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="symptoms" className="text-sm font-medium">Chief Complaint / Symptoms</Label>
                        <Textarea
                          id="symptoms"
                          value={formData.symptoms}
                          onChange={(e) => handleInputChange('symptoms', e.target.value)}
                          placeholder="Describe the main symptoms or reason for visit"
                          rows={3}
                          className="resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          placeholder="Any additional information"
                          rows={2}
                          className="resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Booking Summary */}
                  {selectedDepartment && selectedDoctor && selectedDate && selectedSlot && (
                    <Card className="border-2 border-primary/20">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                          Booking Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-muted-foreground">Department:</span>
                          <span className="font-medium text-sm">{selectedDept?.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-muted-foreground">Doctor:</span>
                          <span className="font-medium text-sm">{selectedDoc?.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-muted-foreground">Date & Time:</span>
                          <span className="font-medium text-sm">
                            {format(selectedDate, "MMM dd, yyyy")} at {selectedSlot}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-muted-foreground">Type:</span>
                          <span className="font-medium text-sm capitalize">{consultationType}</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Consultation Fee:</span>
                            <span className="font-bold text-lg sm:text-xl text-green-600">₹{selectedDoc?.consultationFee}</span>
                          </div>
                        </div>

                        <Button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="w-full mt-4 h-10 sm:h-12"
                          size="lg"
                        >
                          {loading ? "Booking..." : "Book Appointment"}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="walk-in" className="mt-0 h-[600px]">
              <WalkInRegistration />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
