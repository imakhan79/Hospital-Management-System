
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, MapPin, Clock, GraduationCap, Calendar, Phone, Star, Award, Users } from "lucide-react";
import { toast } from "sonner";

interface Doctor {
  id: string;
  name: string;
  photo: string;
  specialty: string;
  qualifications: string[];
  locations: string[];
  availableDays: string[];
  timings: string;
  phone: string;
  gender: 'Male' | 'Female';
  rating: number;
  experience: number;
  consultationFee: number;
  about: string;
  languages: string[];
  totalPatients: number;
}

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Ahmed",
    photo: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face",
    specialty: "Cardiologist",
    qualifications: ["MBBS", "MD Cardiology", "Fellowship in Interventional Cardiology"],
    locations: ["Karachi Main Hospital", "Clifton Cardiac Center"],
    availableDays: ["Monday", "Tuesday", "Wednesday", "Friday"],
    timings: "9:00 AM - 5:00 PM",
    phone: "+92-21-1234567",
    gender: "Female",
    rating: 4.8,
    experience: 12,
    consultationFee: 3000,
    about: "Dr. Sarah Ahmed is a highly experienced cardiologist with expertise in interventional cardiology. She has performed over 1000 cardiac procedures and is known for her compassionate patient care.",
    languages: ["English", "Urdu", "Sindhi"],
    totalPatients: 2500
  },
  {
    id: "2",
    name: "Dr. Muhammad Hassan",
    photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face",
    specialty: "Pediatrician",
    qualifications: ["MBBS", "DCH", "FCPS Pediatrics"],
    locations: ["Lahore Children Hospital", "Model Town Clinic"],
    availableDays: ["Monday", "Tuesday", "Thursday", "Saturday"],
    timings: "10:00 AM - 6:00 PM",
    phone: "+92-42-9876543",
    gender: "Male",
    rating: 4.9,
    experience: 8,
    consultationFee: 2500,
    about: "Dr. Muhammad Hassan specializes in pediatric care with a focus on child development and vaccination programs. He is known for his gentle approach with children.",
    languages: ["English", "Urdu", "Punjabi"],
    totalPatients: 1800
  },
  {
    id: "3",
    name: "Dr. Fatima Khan",
    photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face",
    specialty: "Neurologist",
    qualifications: ["MBBS", "FCPS Neurology", "Fellowship in Epilepsy"],
    locations: ["Islamabad Neuro Center"],
    availableDays: ["Wednesday", "Thursday", "Friday", "Saturday"],
    timings: "2:00 PM - 8:00 PM",
    phone: "+92-51-5555555",
    gender: "Female",
    rating: 4.7,
    experience: 15,
    consultationFee: 4000,
    about: "Dr. Fatima Khan is a renowned neurologist specializing in epilepsy treatment and neurological disorders. She has published numerous research papers in international journals.",
    languages: ["English", "Urdu"],
    totalPatients: 3200
  },
  {
    id: "4",
    name: "Dr. Ali Raza",
    photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face",
    specialty: "Orthopedic Surgeon",
    qualifications: ["MBBS", "MS Orthopedics", "Fellowship in Joint Replacement"],
    locations: ["Karachi Orthopedic Hospital", "DHA Medical Center"],
    availableDays: ["Monday", "Wednesday", "Friday", "Sunday"],
    timings: "8:00 AM - 4:00 PM",
    phone: "+92-21-7777777",
    gender: "Male",
    rating: 4.6,
    experience: 18,
    consultationFee: 3500,
    about: "Dr. Ali Raza is an expert orthopedic surgeon with extensive experience in joint replacement surgeries and sports medicine.",
    languages: ["English", "Urdu"],
    totalPatients: 2800
  },
  {
    id: "5",
    name: "Dr. Ayesha Malik",
    photo: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face",
    specialty: "Dermatologist",
    qualifications: ["MBBS", "FCPS Dermatology", "Diploma in Cosmetic Dermatology"],
    locations: ["Lahore Skin Clinic", "Gulberg Medical Center"],
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    timings: "11:00 AM - 7:00 PM",
    phone: "+92-42-3333333",
    gender: "Female",
    rating: 4.5,
    experience: 10,
    consultationFee: 2800,
    about: "Dr. Ayesha Malik specializes in dermatology and cosmetic procedures, helping patients achieve healthy skin and confidence.",
    languages: ["English", "Urdu", "Punjabi"],
    totalPatients: 2100
  },
  {
    id: "6",
    name: "Dr. Omar Sheikh",
    photo: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face",
    specialty: "Psychiatrist",
    qualifications: ["MBBS", "FCPS Psychiatry", "Diploma in Psychotherapy"],
    locations: ["Karachi Mental Health Center"],
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    timings: "3:00 PM - 9:00 PM",
    phone: "+92-21-4444444",
    gender: "Male",
    rating: 4.8,
    experience: 14,
    consultationFee: 3200,
    about: "Dr. Omar Sheikh is a compassionate psychiatrist specializing in mental health treatment and psychotherapy for various psychological conditions.",
    languages: ["English", "Urdu"],
    totalPatients: 1950
  }
];

const specialties = [
  "All Specialties",
  "Cardiologist",
  "Pediatrician",
  "Neurologist",
  "Orthopedic Surgeon",
  "Dermatologist",
  "Psychiatrist",
  "General Physician",
  "Gynecologist",
  "ENT Specialist"
];

const locations = [
  "All Locations",
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan"
];

const FindDoctorPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedGender, setSelectedGender] = useState("All");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(mockDoctors);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const doctorsPerPage = 6;

  useEffect(() => {
    let filtered = mockDoctors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.locations.some(loc => loc.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by specialty
    if (selectedSpecialty !== "All Specialties") {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty);
    }

    // Filter by location
    if (selectedLocation !== "All Locations") {
      filtered = filtered.filter(doctor =>
        doctor.locations.some(loc => loc.toLowerCase().includes(selectedLocation.toLowerCase()))
      );
    }

    // Filter by gender
    if (selectedGender !== "All") {
      filtered = filtered.filter(doctor => doctor.gender === selectedGender);
    }

    setFilteredDoctors(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedSpecialty, selectedLocation, selectedGender]);

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSpecialty("All Specialties");
    setSelectedLocation("All Locations");
    setSelectedGender("All");
  };

  const handleBookAppointment = (doctor: Doctor) => {
    toast.success(`Redirecting to book appointment with ${doctor.name}`);
    // Here you would typically navigate to the appointment booking page
    // navigate(`/opd?doctor=${doctor.id}&action=book`);
  };

  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8 space-y-6 lg:space-y-8 max-w-7xl">
      {/* Header */}
      <div className="text-center space-y-3 lg:space-y-4">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Find a Doctor
        </h1>
        <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Search for qualified healthcare professionals by specialty, location, or name
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
          <CardDescription className="text-sm lg:text-base">
            Use the search bar and filters to find the right doctor for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 lg:space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by doctor name, specialty, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 lg:h-12 text-sm lg:text-base"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialty</label>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty} className="text-sm">
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  {locations.map((location) => (
                    <SelectItem key={location} value={location} className="text-sm">
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="All" className="text-sm">All</SelectItem>
                  <SelectItem value="Male" className="text-sm">Male</SelectItem>
                  <SelectItem value="Female" className="text-sm">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium invisible lg:visible">Reset</label>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full h-10 text-sm"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold">
            {filteredDoctors.length} Doctor{filteredDoctors.length !== 1 ? 's' : ''} Found
          </h2>
          <p className="text-sm lg:text-base text-muted-foreground">
            Showing {indexOfFirstDoctor + 1}-{Math.min(indexOfLastDoctor, filteredDoctors.length)} of {filteredDoctors.length} results
          </p>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {currentDoctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden border-0 shadow-md">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-start space-x-3 lg:space-x-4 mb-4">
                <Avatar className="w-14 h-14 lg:w-16 lg:h-16 border-2 border-blue-100 flex-shrink-0">
                  <AvatarImage src={doctor.photo} alt={doctor.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm lg:text-base">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base lg:text-lg text-gray-900 truncate">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium text-sm lg:text-base mb-2">{doctor.specialty}</p>
                  <div className="flex items-center space-x-1 mb-1">
                    {renderStars(doctor.rating)}
                    <span className="text-xs lg:text-sm text-muted-foreground ml-1">
                      {doctor.rating} ({doctor.experience} years)
                    </span>
                  </div>
                  <div className="text-lg lg:text-xl font-bold text-green-600">
                    PKR {doctor.consultationFee.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2 lg:space-y-3 mb-4">
                <div className="flex items-start space-x-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {doctor.qualifications.slice(0, 2).map((qual, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {qual}
                      </Badge>
                    ))}
                    {doctor.qualifications.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{doctor.qualifications.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-muted-foreground truncate">
                    {doctor.locations[0]}
                    {doctor.locations.length > 1 && ` +${doctor.locations.length - 1} more`}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{doctor.timings}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    {doctor.availableDays.slice(0, 3).join(', ')}
                    {doctor.availableDays.length > 3 && ' +more'}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm lg:text-base h-9 lg:h-10"
                  onClick={() => handleBookAppointment(doctor)}
                >
                  Book Appointment
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex-1 text-sm lg:text-base h-9 lg:h-10"
                      onClick={() => handleViewProfile(doctor)}
                    >
                      View Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={doctor.photo} alt={doctor.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold">{doctor.name}</h3>
                          <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      {/* Rating and Stats */}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {renderStars(doctor.rating)}
                          </div>
                          <span className="font-semibold">{doctor.rating}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{doctor.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{doctor.totalPatients.toLocaleString()} patients treated</span>
                        </div>
                      </div>

                      {/* About */}
                      <div>
                        <h4 className="font-semibold mb-2">About</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{doctor.about}</p>
                      </div>

                      {/* Qualifications */}
                      <div>
                        <h4 className="font-semibold mb-2">Qualifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {doctor.qualifications.map((qual, index) => (
                            <Badge key={index} variant="secondary">{qual}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Languages */}
                      <div>
                        <h4 className="font-semibold mb-2">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {doctor.languages.map((lang, index) => (
                            <Badge key={index} variant="outline">{lang}</Badge>
                          ))}
                        </div>
                      </div>

                      {/* Locations */}
                      <div>
                        <h4 className="font-semibold mb-2">Practice Locations</h4>
                        <div className="space-y-2">
                          {doctor.locations.map((location, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{location}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Availability */}
                      <div>
                        <h4 className="font-semibold mb-2">Availability</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doctor.availableDays.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{doctor.timings}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact */}
                      <div>
                        <h4 className="font-semibold mb-2">Contact</h4>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{doctor.phone}</span>
                        </div>
                      </div>

                      {/* Consultation Fee */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Consultation Fee</span>
                          <span className="text-2xl font-bold text-green-600">
                            PKR {doctor.consultationFee.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button 
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleBookAppointment(doctor)}
                        >
                          Book Appointment
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredDoctors.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl lg:text-6xl">🔍</div>
              <h3 className="text-lg lg:text-xl font-semibold">No doctors found</h3>
              <p className="text-sm lg:text-base text-muted-foreground">
                Try adjusting your search criteria or filters to find more results.
              </p>
              <Button onClick={resetFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredDoctors.length > doctorsPerPage && currentPage < totalPages && (
        <div className="text-center space-y-3">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-base"
          >
            Load More Doctors
          </Button>
          <p className="text-xs lg:text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}
    </div>
  );
};

export default FindDoctorPage;
