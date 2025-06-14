
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search as SearchIcon } from "lucide-react";
import { ReportStatus as ReportStatusType } from '@/types';

interface ReportSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: ReportStatusType | "All";
  handleStatusChange: (status: ReportStatusType | "All") => void;
  handleSearchButtonClick: () => void;
  reportStatuses: ReportStatusType[];
}

const ReportSearchFilters: React.FC<ReportSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  handleStatusChange,
  handleSearchButtonClick,
  reportStatuses,
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <SearchIcon className="mr-2 h-5 w-5 text-primary" />
          Search Reports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <label htmlFor="search-term" className="block text-sm font-medium text-muted-foreground mb-1">
              Search by driver name, CDL#, or company
            </label>
            <Input
              id="search-term"
              type="text"
              placeholder="Driver, CDL#, Company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="md:col-span-1">
            <label htmlFor="status-filter" className="block text-sm font-medium text-muted-foreground mb-1">
              Filter by status
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(value: ReportStatusType | "All") => handleStatusChange(value)}
            >
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Reports</SelectItem>
                {reportStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-1">
              <Button onClick={handleSearchButtonClick} className="w-full">
                  <SearchIcon className="mr-2 h-4 w-4" /> Search
              </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportSearchFilters;

