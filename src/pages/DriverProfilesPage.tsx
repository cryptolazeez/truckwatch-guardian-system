
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDriverData } from '@/hooks/useDriverData';
import DriverSearchForm from '@/components/driver-profiles/DriverSearchForm';
import NoResultsCard from '@/components/driver-profiles/NoResultsCard';
import DriverProfilesContent from '@/components/driver-profiles/DriverProfilesContent';
import BackButton from '@/components/layout/BackButton';
import { Loader2, XCircle } from "lucide-react";

const DriverProfilesPage = () => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const { driverProfiles, filteredReportItems, totalReportCount, isLoading, error } = useDriverData(searchTerm);

    useEffect(() => {
        if (error) {
            toast({
                title: "Error Fetching Data",
                description: error.message,
                variant: "destructive",
            });
        }
    }, [error, toast]);

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-3 text-lg">Loading driver data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8 px-4 md:px-6 text-center min-h-[calc(100vh-200px)]">
                <XCircle className="h-12 w-12 mx-auto mb-3 text-red-500" />
                <p className="text-lg text-red-600">Failed to load driver data.</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <BackButton />
            <DriverSearchForm onSearch={setSearchTerm} initialTerm={searchTerm} />

            {searchTerm && driverProfiles.length === 0 && !isLoading && (
                <NoResultsCard searchTerm={searchTerm} />
            )}

            <DriverProfilesContent
                driverProfiles={driverProfiles}
                filteredReportItems={filteredReportItems}
                totalReportCount={totalReportCount}
                searchTerm={searchTerm}
            />
        </div>
    );
};

export default DriverProfilesPage;
