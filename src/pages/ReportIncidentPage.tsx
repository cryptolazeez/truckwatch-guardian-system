import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, AlertTriangle, User, Info, BuildingIcon } from "lucide-react";

const ReportIncidentPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold flex items-center justify-center">
          <AlertTriangle className="mr-3 h-8 w-8 text-orange-500" /> File a Complaint
        </h1>
        <p className="text-muted-foreground mt-2">
          Help keep our roads safe by reporting dangerous or unprofessional driving behavior.
        </p>
      </div>

      <form className="space-y-8 max-w-3xl mx-auto">
        {/* Driver Information Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-sky-50 rounded-t-lg">
            <CardTitle className="flex items-center text-xl text-sky-700">
              <User className="mr-2 h-5 w-5 text-sky-600" /> Driver Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="driverFirstName">Driver First Name *</Label>
                <Input id="driverFirstName" type="text" placeholder="Enter driver's first name" required />
              </div>
              <div>
                <Label htmlFor="driverLastName">Driver Last Name *</Label>
                <Input id="driverLastName" type="text" placeholder="Enter driver's last name" required />
              </div>
            </div>
            <div>
              <Label htmlFor="cdlNumber">CDL Number *</Label>
              <Input id="cdlNumber" type="text" placeholder="Enter Commercial Driver's License number" required />
              <p className="text-xs text-muted-foreground mt-1">* CDL number is required for driver identification and tracking.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="driverEmail">Driver Email (Optional)</Label>
                <Input id="driverEmail" type="email" placeholder="driver@example.com" />
              </div>
              <div>
                <Label htmlFor="driverPhone">Driver Phone Number (Optional)</Label>
                <Input id="driverPhone" type="tel" placeholder="Driver's phone number" />
              </div>
            </div>
            <div>
              <Label htmlFor="driverIdLicense">Driver ID/License (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                  <label htmlFor="driverIdLicenseFile" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-muted-foreground">Upload driver's license or ID photo</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                      </div>
                      <Input id="driverIdLicenseFile" type="file" className="hidden" />
                  </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Incident Information Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-amber-50 rounded-t-lg">
            <CardTitle className="flex items-center text-xl text-amber-700">
              <Info className="mr-2 h-5 w-5 text-amber-600" /> Incident Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="incidentType">Incident Type *</Label>
                <Select required>
                  <SelectTrigger id="incidentType">
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employment">Employment Defaults</SelectItem>
                    <SelectItem value="safety">Safety Violations</SelectItem>
                    <SelectItem value="theft">Theft/Criminal Activities</SelectItem>
                    <SelectItem value="misconduct">Professional Misconduct</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateOccurred">Date Occurred *</Label>
                <Input id="dateOccurred" type="date" placeholder="dd-mm-yyyy" required />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input id="location" type="text" placeholder="City, state, highway, mile marker, etc." required />
            </div>
            <div>
              <Label htmlFor="incidentDescription">Description of Incident *</Label>
              <Textarea id="incidentDescription" placeholder="Please provide a detailed description of what happened..." rows={5} required />
            </div>
            <div>
              <Label htmlFor="incidentProofs">Upload Incident Proofs (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                  <label htmlFor="incidentProofsFile" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-muted-foreground">Upload photos or videos of the incident</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, MP4 up to 5MB each</p>
                      </div>
                      <Input id="incidentProofsFile" type="file" className="hidden" multiple />
                  </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Company Information Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-teal-50 rounded-t-lg">
            <CardTitle className="flex items-center text-xl text-teal-700">
              <BuildingIcon className="mr-2 h-5 w-5 text-teal-600" /> Your Company Information (Required)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input id="companyName" type="text" placeholder="Your company name" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyPhone">Company Phone *</Label>
                <Input id="companyPhone" type="tel" placeholder="Company phone number" required />
              </div>
              <div>
                <Label htmlFor="companyEmail">Company Email *</Label>
                <Input id="companyEmail" type="email" placeholder="company@example.com" required />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">* Company email verification is mandatory for complaint processing.</p>
          </CardContent>
        </Card>
            
        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-3">
          Submit Complaint for Review
        </Button>
      </form>
    </div>
  );
};

export default ReportIncidentPage;
