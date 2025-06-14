import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, AlertTriangle } from "lucide-react";
const ReportIncidentPage = () => {
  return <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Report an Incident</h1>
        <p className="text-muted-foreground mt-2">Submit a report regarding a driver incident. All submissions are reviewed.</p>
      </div>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-destructive" /> Incident Report Form
          </CardTitle>
          <CardDescription>
            Please provide accurate and detailed information. All fields marked with * are mandatory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="bg-cyan-100">
              <Label htmlFor="cdlNumber">CDL Number *</Label>
              <Input id="cdlNumber" type="text" placeholder="Enter driver's CDL number" required />
            </div>

            <div>
              <Label htmlFor="incidentDate">Date of Incident *</Label>
              <Input id="incidentDate" type="date" required />
            </div>
            
            <div>
              <Label htmlFor="incidentCategory">Incident Category *</Label>
              <Select required>
                <SelectTrigger id="incidentCategory">
                  <SelectValue placeholder="Select category" />
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
              <Label htmlFor="incidentDescription">Incident Description *</Label>
              <Textarea id="incidentDescription" placeholder="Provide a detailed description of the incident" rows={5} required />
            </div>

            <div>
              <Label htmlFor="supportingEvidence">Supporting Evidence (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-muted-foreground">Documents, images, or videos</p>
                      </div>
                      <Input id="dropzone-file" type="file" className="hidden" multiple />
                  </label>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Max file size: 10MB. Allowed types: PDF, DOCX, JPG, PNG, MP4.</p>
            </div>
            
            <Button type="submit" className="w-full">
              Submit Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>;
};
export default ReportIncidentPage;