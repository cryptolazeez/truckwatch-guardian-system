import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Report, ReportStatus } from '@/types';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/layout/BackButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, XCircle, FileText, Image as ImageIcon, Link as LinkIcon, Download, Save } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const fetchReportById = async (id: string): Promise<Report | null> => {
    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', id)
        .single();

    if (error && error.code !== 'PGRST116') { // Ignore 'exact one row' error for not found
      console.error("Error fetching report:", error);
      throw error;
    }
    return data as Report | null;
};

const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isModerator, isLoading: isLoadingRole } = useUserRole();
  const [moderatorNotes, setModeratorNotes] = useState('');

  const { data: report, isLoading, isError, error } = useQuery<Report | null, Error>({
    queryKey: ['report', id],
    queryFn: () => fetchReportById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (report?.moderator_notes) {
      setModeratorNotes(report.moderator_notes);
    }
  }, [report]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ newStatus }: { newStatus: ReportStatus }) => {
      const { error: updateError } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', id!);
      if (updateError) throw updateError;
    },
    onSuccess: (_, { newStatus }) => {
      queryClient.invalidateQueries({ queryKey: ['report', id] });
      queryClient.invalidateQueries({ queryKey: ['reports'] }); // Invalidate list view
      toast({
        title: "Status Updated",
        description: `Report status changed to ${newStatus}.`,
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: async ({ notes }: { notes: string }) => {
      const { error: updateError } = await supabase
        .from('reports')
        .update({ moderator_notes: notes })
        .eq('id', id!);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report', id] });
      toast({
        title: "Notes Saved",
        description: "Moderator notes have been successfully saved.",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Save Failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading || isLoadingRole) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 text-center">
        <XCircle className="h-12 w-12 mx-auto text-red-500" />
        <h2 className="mt-4 text-xl font-semibold">Error loading report</h2>
        <p className="text-muted-foreground">{error?.message}</p>
        <Button onClick={() => navigate('/view-reports')} className="mt-4">Go Back</Button>
      </div>
    );
  }
  
  if (!report) {
    return (
      <div className="container mx-auto py-8 text-center">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Report Not Found</h2>
        <p className="text-muted-foreground">The report you are looking for does not exist or you do not have permission to view it.</p>
        <Button onClick={() => navigate('/view-reports')} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const renderFileLink = (url: string, index: number) => {
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(url);
    return (
      <a
        key={index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-2 bg-muted rounded-md hover:bg-muted/80"
      >
        {isImage ? <ImageIcon className="h-5 w-5" /> : <LinkIcon className="h-5 w-5" />}
        <span className="truncate">Proof File {index + 1}</span>
        <Download className="h-4 w-4 ml-auto" />
      </a>
    );
  };
  
  const getStatusBadgeVariant = (status: ReportStatus) => {
    switch (status) {
      case 'Resolved':
        return 'default';
      case 'Rejected':
        return 'destructive';
      case 'info_requested':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <BackButton />
      <Card className="mt-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Report Details</CardTitle>
              <CardDescription>ID: {report.id}</CardDescription>
            </div>
            <Badge variant={getStatusBadgeVariant(report.status)}>{report.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Driver Information</h3>
            <p><strong>Name:</strong> {report.driver_first_name} {report.driver_last_name}</p>
            <p><strong>CDL Number:</strong> {report.cdl_number}</p>
            <p><strong>Email:</strong> {report.driver_email || 'N/A'}</p>
            <p><strong>Phone:</strong> {report.driver_phone || 'N/A'}</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Incident Information</h3>
            <p><strong>Type:</strong> {report.incident_type.replace(/_/g, ' ')}</p>
            <p><strong>Date:</strong> {new Date(report.date_occurred).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {report.location}</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{report.description}</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg">Reporting Company</h3>
            <p><strong>Name:</strong> {report.company_name_making_report}</p>
            <p><strong>Email:</strong> {report.company_email_making_report}</p>
            <p><strong>Phone:</strong> {report.company_phone_making_report || 'N/A'}</p>
          </div>
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-semibold text-lg">Evidence</h3>
            <div className="space-y-2">
              {report.driver_id_license_url && (
                <a href={report.driver_id_license_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-muted rounded-md hover:bg-muted/80">
                  <ImageIcon className="h-5 w-5" /> Driver License
                  <Download className="h-4 w-4 ml-auto" />
                </a>
              )}
              {report.incident_proofs_urls && report.incident_proofs_urls.map(renderFileLink)}
              {!report.driver_id_license_url && !report.incident_proofs_urls?.length && (
                <p className="text-muted-foreground">No evidence was uploaded for this report.</p>
              )}
            </div>
          </div>
          
          {isModerator && (
            <div className="md:col-span-2 border-t pt-6 space-y-4">
              <h3 className="font-semibold text-lg">Moderator Actions</h3>

              <div className="space-y-2">
                <Label htmlFor="moderator-notes">Moderator Notes</Label>
                <Textarea
                  id="moderator-notes"
                  placeholder="Add internal notes for this report..."
                  value={moderatorNotes}
                  onChange={(e) => setModeratorNotes(e.target.value)}
                  rows={4}
                  className="bg-muted/20"
                />
                <Button
                  onClick={() => updateNotesMutation.mutate({ notes: moderatorNotes })}
                  disabled={updateNotesMutation.isPending}
                  size="sm"
                >
                  {updateNotesMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Notes
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {(report.status === 'Pending' || report.status === 'Reviewed' || report.status === 'info_requested') && (
                  <>
                    <Button onClick={() => updateStatusMutation.mutate({ newStatus: 'Resolved' })} disabled={updateStatusMutation.isPending}>
                      Approve
                    </Button>
                    <Button onClick={() => updateStatusMutation.mutate({ newStatus: 'Rejected' })} variant="destructive" disabled={updateStatusMutation.isPending}>
                      Reject
                    </Button>
                     <Button onClick={() => updateStatusMutation.mutate({ newStatus: 'info_requested' })} variant="secondary" disabled={updateStatusMutation.isPending}>
                      Request More Info
                    </Button>
                  </>
                )}
                {(report.status === 'Resolved' || report.status === 'Rejected') && (
                  <p className="text-sm text-muted-foreground">This report has been finalized. No further actions can be taken.</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportDetailPage;
