
import React, { useState } from 'react';
import { ReportListItem } from '@/types';
import { DriverProfileViewData } from '@/components/reports/reportTypes';
import ReportStatsHeader from '@/components/reports/ReportStatsHeader';
import DriverProfileList from '@/components/reports/DriverProfileList';
import AllReportsTable from '@/components/reports/AllReportsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { User } from 'lucide-react';

interface DriverProfilesContentProps {
    driverProfiles: DriverProfileViewData[];
    filteredReportItems: ReportListItem[];
    totalReportCount: number;
    searchTerm: string;
}

const DriverProfilesContent: React.FC<DriverProfilesContentProps> = ({
    driverProfiles,
    filteredReportItems,
    totalReportCount,
    searchTerm
}) => {
    const [activeTab, setActiveTab] = useState<string>("driverProfiles");

    if (driverProfiles.length === 0 && !searchTerm) {
        return (
            <Card className="text-center py-8">
                <CardContent>
                    <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-xl font-semibold">No Driver Data Available</p>
                    <p className="text-muted-foreground">
                        There is currently no driver data to display. Reports might not have been submitted yet.
                    </p>
                </CardContent>
            </Card>
        );
    }
    
    if (driverProfiles.length === 0 && searchTerm) {
        return null;
    }

    return (
        <div className="mb-8 p-4 sm:p-6 bg-card border rounded-lg shadow-md">
            <ReportStatsHeader
                displayedReportsCount={totalReportCount}
                uniqueDriversCount={driverProfiles.length}
            />
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto mb-6">
                    <TabsTrigger value="driverProfiles">Driver Profiles</TabsTrigger>
                    <TabsTrigger value="allReports">All Reports ({totalReportCount})</TabsTrigger>
                </TabsList>

                <TabsContent value="driverProfiles">
                    <DriverProfileList profiles={driverProfiles} />
                </TabsContent>

                <TabsContent value="allReports">
                    <AllReportsTable reports={filteredReportItems} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DriverProfilesContent;
