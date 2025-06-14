
import React, { useState } from 'react';
import ReportSearchFilters from '@/components/reports/ReportSearchFilters';
import ReportStatsHeader from '@/components/reports/ReportStatsHeader';
import AllReportsTable from '@/components/reports/AllReportsTable';
import DriverProfileList from '@/components/reports/DriverProfileList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, XCircle } from "lucide-react";
import BackButton from '@/components/layout/BackButton';
import { useReportData } from '@/hooks/useReportData';

const ViewReportsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("allReports");
  
  const {
    isLoadingReports,
    reportsError,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    handleStatusChange,
    handleSearchButtonClick,
    reportStatuses,
    displayedReports,
    driverProfiles,
  } = useReportData();

  const uniqueDriversCount = new Set(displayedReports.map(r => `${r.driver_name}-${r.cdl_number}`)).size;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <BackButton />
      <ReportSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        handleStatusChange={handleStatusChange}
        handleSearchButtonClick={handleSearchButtonClick}
        reportStatuses={reportStatuses}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-8 p-6 bg-card border rounded-lg">
          <ReportStatsHeader
            displayedReportsCount={displayedReports.length}
            uniqueDriversCount={uniqueDriversCount}
          />
          <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto mb-6">
            <TabsTrigger value="allReports">All Reports</TabsTrigger>
            <TabsTrigger value="driverProfiles">Driver Profiles</TabsTrigger>
          </TabsList>

          {isLoadingReports && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading reports...</p>
            </div>
          )}

          {!isLoadingReports && reportsError && (
            <div className="text-center py-10 text-red-500">
              <XCircle className="h-8 w-8 mx-auto mb-2" />
              <p>Failed to load reports. Please try again later.</p>
            </div>
          )}
          
          {!isLoadingReports && !reportsError && (
            <>
              <TabsContent value="allReports">
                <AllReportsTable reports={displayedReports} />
              </TabsContent>

              <TabsContent value="driverProfiles">
                <DriverProfileList profiles={driverProfiles} />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default ViewReportsPage;
