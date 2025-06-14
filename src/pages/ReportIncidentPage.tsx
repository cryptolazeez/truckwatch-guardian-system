
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, AlertTriangle, User, Info, BuildingIcon } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { IncidentType } from '@/types'; // Assuming types.ts is created

const incidentTypes: IncidentType[] = [
  'aggressive_driving', 'reckless_driving', 'road_rage', 'unsafe_lane_change',
  'speeding', 'tailgating', 'distracted_driving', 'failure_to_signal',
  'blocking_traffic', 'employment_defaults', 'safety_violations',
  'theft_criminal_activities', 'professional_misconduct', 'other'
];

const reportIncidentSchema = z.object({
  driverFirstName: z.string().optional(),
  driverLastName: z.string().optional(),
  cdlNumber: z.string().min(1, "CDL Number is required"),
  driverEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  driverPhone: z.string().optional(),
  
  incidentType: z.enum(incidentTypes, { required_error: "Incident type is required" }),
  dateOccurred: z.string().min(1, "Date occurred is required"), // Consider z.date() if using a date picker that provides Date object
  location: z.string().min(1, "Location is required"),
  incidentDescription: z.string().min(1, "Description is required"),
  
  companyName: z.string().min(1, "Company name is required"),
  companyPhone: z.string().optional(),
  companyEmail: z.string().email("Invalid company email").min(1, "Company email is required"),
});

type ReportIncidentFormValues = z.infer<typeof reportIncidentSchema>;

interface UserProfile {
  id: string;
  company_name: string | null;
}

const ReportIncidentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm<ReportIncidentFormValues>({
    resolver: zodResolver(reportIncidentSchema),
    defaultValues: { // Initialize defaultValues for controlled components like Select
      incidentType: undefined, // Or a default valid IncidentType if you have one
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, company_name')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          toast({ title: "Error", description: "Could not fetch your profile.", variant: "destructive" });
        } else if (profile) {
          setUserProfile(profile);
          // Pre-fill company details if available from profile, and if form fields are empty
          if (profile.company_name) {
             setValue('companyName', profile.company_name, { shouldValidate: true });
          }
        }
      } else {
        toast({ title: "Authentication Required", description: "Please log in to report an incident.", variant: "destructive" });
        // Potentially redirect to login page
      }
    };
    fetchUserProfile();
  }, [toast, setValue]);

  const onSubmit = async (values: ReportIncidentFormValues) => {
    if (!userProfile) {
      toast({ title: "Error", description: "User profile not loaded. Cannot submit report.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.from('reports').insert([
        {
          reporter_profile_id: userProfile.id,
          driver_first_name: values.driverFirstName,
          driver_last_name: values.driverLastName,
          cdl_number: values.cdlNumber,
          incident_type: values.incidentType,
          date_occurred: values.dateOccurred,
          location: values.location,
          description: values.incidentDescription,
          company_name_making_report: values.companyName,
          company_phone_making_report: values.companyPhone,
          company_email_making_report: values.companyEmail,
          // status is defaulted to 'Pending' by the database
        },
      ]);

      if (error) {
        throw error;
      }

      toast({ title: "Success", description: "Incident report submitted successfully." });
      reset(); // Reset form fields
    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast({ title: "Submission Failed", description: error.message || "Could not submit the report.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto">
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
                <Label htmlFor="driverFirstName">Driver First Name</Label>
                <Input id="driverFirstName" type="text" placeholder="Enter driver's first name" {...register("driverFirstName")} />
                {errors.driverFirstName && <p className="text-red-500 text-sm mt-1">{errors.driverFirstName.message}</p>}
              </div>
              <div>
                <Label htmlFor="driverLastName">Driver Last Name</Label>
                <Input id="driverLastName" type="text" placeholder="Enter driver's last name" {...register("driverLastName")} />
                {errors.driverLastName && <p className="text-red-500 text-sm mt-1">{errors.driverLastName.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="cdlNumber">CDL Number *</Label>
              <Input id="cdlNumber" type="text" placeholder="Enter Commercial Driver's License number" {...register("cdlNumber")} />
              {errors.cdlNumber && <p className="text-red-500 text-sm mt-1">{errors.cdlNumber.message}</p>}
              <p className="text-xs text-muted-foreground mt-1">* CDL number is required for driver identification and tracking.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="driverEmail">Driver Email (Optional)</Label>
                <Input id="driverEmail" type="email" placeholder="driver@example.com" {...register("driverEmail")} />
                {errors.driverEmail && <p className="text-red-500 text-sm mt-1">{errors.driverEmail.message}</p>}
              </div>
              <div>
                <Label htmlFor="driverPhone">Driver Phone Number (Optional)</Label>
                <Input id="driverPhone" type="tel" placeholder="Driver's phone number" {...register("driverPhone")} />
                {errors.driverPhone && <p className="text-red-500 text-sm mt-1">{errors.driverPhone.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="driverIdLicense">Driver ID/License (Optional - Not Implemented)</Label>
              <div className="flex items-center justify-center w-full">
                  <label htmlFor="driverIdLicenseFile" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-1 text-sm text-muted-foreground">File upload not implemented</p>
                      </div>
                      <Input id="driverIdLicenseFile" type="file" className="hidden" disabled />
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
                <Controller
                  name="incidentType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="incidentType">
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        {incidentTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.incidentType && <p className="text-red-500 text-sm mt-1">{errors.incidentType.message}</p>}
              </div>
              <div>
                <Label htmlFor="dateOccurred">Date Occurred *</Label>
                <Input id="dateOccurred" type="date" {...register("dateOccurred")} />
                {errors.dateOccurred && <p className="text-red-500 text-sm mt-1">{errors.dateOccurred.message}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input id="location" type="text" placeholder="City, state, highway, mile marker, etc." {...register("location")} />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
            </div>
            <div>
              <Label htmlFor="incidentDescription">Description of Incident *</Label>
              <Textarea id="incidentDescription" placeholder="Please provide a detailed description of what happened..." rows={5} {...register("incidentDescription")} />
              {errors.incidentDescription && <p className="text-red-500 text-sm mt-1">{errors.incidentDescription.message}</p>}
            </div>
            <div>
              <Label htmlFor="incidentProofs">Upload Incident Proofs (Optional - Not Implemented)</Label>
               <div className="flex items-center justify-center w-full">
                  <label htmlFor="incidentProofsFile" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-1 text-sm text-muted-foreground">File upload not implemented</p>
                      </div>
                      <Input id="incidentProofsFile" type="file" className="hidden" multiple disabled />
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
              <Input id="companyName" type="text" placeholder="Your company name" {...register("companyName")} />
              {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyPhone">Company Phone</Label>
                <Input id="companyPhone" type="tel" placeholder="Company phone number" {...register("companyPhone")} />
                 {errors.companyPhone && <p className="text-red-500 text-sm mt-1">{errors.companyPhone.message}</p>}
              </div>
              <div>
                <Label htmlFor="companyEmail">Company Email *</Label>
                <Input id="companyEmail" type="email" placeholder="company@example.com" {...register("companyEmail")} />
                {errors.companyEmail && <p className="text-red-500 text-sm mt-1">{errors.companyEmail.message}</p>}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">* Company email verification is mandatory for complaint processing (actual verification not implemented yet).</p>
          </CardContent>
        </Card>
            
        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-3" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Complaint for Review'}
        </Button>
      </form>
    </div>
  );
};

export default ReportIncidentPage;

