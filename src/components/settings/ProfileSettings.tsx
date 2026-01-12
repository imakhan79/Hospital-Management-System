
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProfileSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your personal information and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt="Profile picture" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">Change Avatar</Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="(555) 123-4567" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select defaultValue="physician">
              <SelectTrigger id="role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physician">Physician</SelectItem>
                <SelectItem value="nurse">Nurse</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="labtech">Lab Technician</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select defaultValue="cardiology">
              <SelectTrigger id="department">
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="pediatrics">Pediatrics</SelectItem>
                <SelectItem value="orthopedics">Orthopedics</SelectItem>
                <SelectItem value="emergency">Emergency Medicine</SelectItem>
                <SelectItem value="administration">Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Biography</Label>
            <Textarea 
              id="bio" 
              placeholder="Tell us about yourself" 
              className="min-h-[100px]"
              defaultValue="Board-certified cardiologist with over 10 years of experience specializing in preventive cardiology and heart disease management."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferences">Notification Preferences</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="emailNotifications" className="rounded border-gray-300" defaultChecked />
                <label htmlFor="emailNotifications" className="text-sm font-medium">Email Notifications</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="smsNotifications" className="rounded border-gray-300" defaultChecked />
                <label htmlFor="smsNotifications" className="text-sm font-medium">SMS Notifications</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="appNotifications" className="rounded border-gray-300" defaultChecked />
                <label htmlFor="appNotifications" className="text-sm font-medium">In-App Notifications</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="scheduleReminders" className="rounded border-gray-300" defaultChecked />
                <label htmlFor="scheduleReminders" className="text-sm font-medium">Schedule Reminders</label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
