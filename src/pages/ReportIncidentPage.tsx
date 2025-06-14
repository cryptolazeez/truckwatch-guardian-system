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
import { IncidentType } from '@/types'; 
import { Constants } from '@/integrations/supabase/types';

// Use the enum definition from Constants for populating the Select component
const incidentTypesForSelect = Constants.public.Enums.incident_type_enum;

const reportIncidentSchema = z.object({
  driverFirstName: z.string().optional(),
  driverLastName: z.string().optional(),
  cdlNumber: z.string().min(1, "CDL Number is required"),
  driverEmail: z.string().email("Invalid email address").optional().or(z.literal('')),
  driverPhone: z.string().optional(),
  
  incidentType: z.enum(Constants.public.Enums.incident_type_enum, { required_error: "Incident type is required" }),
  dateOccurred: z.string().min(1, "Date occurred is required"),
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
  // userProfile state can still be used to store profile if user is logged in
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); 
  const [driverIdLicenseFile, setDriverIdLicenseFile] = useState<File | null>(null);
  const [incidentProofsFiles, setIncidentProofsFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm<ReportIncidentFormValues>({
    resolver: zodResolver(reportIncidentSchema),
    defaultValues: { 
      incidentType: undefined, 
    },
  });

  useEffect(() => {
    const fetchUserProfileAndPrePopulate = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, company_name')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile for pre-population:', error);
          // Optionally, inform user if profile fetch fails for a logged-in user, but don't block.
          // toast({ title: "Profile Info", description: "Could not pre-fill company info from your profile.", variant: "default" });
        } else if (profile) {
          setUserProfile(profile); // Store profile if fetched
          if (profile.company_name) {
             setValue('companyName', profile.company_name, { shouldValidate: true });
          }
        }
      }
      // No 'else' block needed to enforce login or show auth required toast
    };
    fetchUserProfileAndPrePopulate();
  }, [toast, setValue]); // userProfile removed from dependency array as it's set within this effect

  const onSubmit = async (values: ReportIncidentFormValues) => {
    setIsLoading(true);
    
    // Attempt to get current user for reporter_profile_id
    // This does not require userProfile state to be set from useEffect
    let currentUserId: string | null = null;
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      currentUserId = authUser.id;
    }

    try {
      let driverIdLicenseUrl: string | undefined = undefined;
      if (driverIdLicenseFile) {
        const fileExt = driverIdLicenseFile.name.split('.').pop();
        const fileName = `license-${Date.now()}.${fileExt}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('incident_files')
          .upload(fileName, driverIdLicenseFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('incident_files').getPublicUrl(uploadData.path);
        driverIdLicenseUrl = urlData.publicUrl;
      }

      const incidentProofsUrls: string[] = [];
      if (incidentProofsFiles.length > 0) {
        for (const file of incidentProofsFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `proof-${Date.now()}-${Math.random()}.${fileExt}`;
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('incident_files')
            .upload(fileName, file);

          if (uploadError) throw uploadError;
          
          const { data: urlData } = supabase.storage.from('incident_files').getPublicUrl(uploadData.path);
          incidentProofsUrls.push(urlData.publicUrl);
        }
      }
      
      const reportData = {
        reporter_profile_id: currentUserId, // Will be null if no user is logged in
        driver_first_name: values.driverFirstName,
        driver_last_name: values.driverLastName,
        cdl_number: values.cdlNumber,
        driver_email: values.driverEmail, // Added missing driver_email
        driver_phone: values.driverPhone, // Added missing driver_phone
        incident_type: values.incidentType,
        date_occurred: values.dateOccurred,
        location: values.location,
        description: values.incidentDescription,
        company_name_making_report: values.companyName, // This is required from the form
        company_phone_making_report: values.companyPhone,
        company_email_making_report: values.companyEmail,
        driver_id_license_url: driverIdLicenseUrl,
        incident_proofs_urls: incidentProofsUrls.length > 0 ? incidentProofsUrls : undefined,
        // status is defaulted to 'Pending' by the database
      };

      const { error } = await supabase.from('reports').insert([reportData]);

      if (error) {
        throw error;
      }

      toast({ title: "Success", description: "Incident report submitted successfully." });
      reset();
      setDriverIdLicenseFile(null);
      setIncidentProofsFiles([]);
      // If a logged-in user submitted, their company name might have been pre-filled.
      // If they change it and submit, then reset, it should reset to blank or pre-fill again if they are still logged in.
      // For truly anonymous, it just resets.
      // If there was a logged-in user and they have a company_name, re-populate it after reset.
      if (userProfile && userProfile.company_name) {
        setValue('companyName', userProfile.company_name, { shouldValidate: true });
      }

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
              <Label htmlFor="driverIdLicense">Driver ID/License (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                  <label htmlFor="driverIdLicenseFile" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                          {driverIdLicenseFile ? (
                              <p className="mb-1 text-sm text-green-600 font-semibold">{driverIdLicenseFile.name}</p>
                          ) : (
                            <>
                              <p className="mb-1 text-sm text-muted-foreground">Click to upload driver's license</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG, PDF (MAX. 5MB)</p>
                            </>
                          )}
                      </div>
                      <Input id="driverIdLicenseFile" type="file" className="hidden" onChange={(e) => setDriverIdLicenseFile(e.target.files ? e.target.files[0] : null)} />
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
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <SelectTrigger id="incidentType">
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        {incidentTypesForSelect.map(type => (
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
              <Label htmlFor="incidentProofs">Upload Incident Proofs (Optional)</Label>
               <div className="flex items-center justify-center w-full">
                  <label htmlFor="incidentProofsFile" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                          {incidentProofsFiles.length > 0 ? (
                            <p className="mb-1 text-sm text-green-600 font-semibold">{incidentProofsFiles.length} file(s) selected</p>
                          ) : (
                            <>
                              <p className="mb-1 text-sm text-muted-foreground">Click to upload proofs</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG, PDF, MP4 (MAX. 5MB)</p>
                            </>
                          )}
                      </div>
                      <Input id="incidentProofsFile" type="file" className="hidden" multiple onChange={(e) => setIncidentProofsFiles(e.target.files ? Array.from(e.target.files) : [])} />
                  </label>
              </div>
              {incidentProofsFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {incidentProofsFiles.map((file, index) => (
                    <p key={index} className="text-sm text-muted-foreground truncate">
                      - {file.name}
                    </p>
                  ))}
                </div>
              )}
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
