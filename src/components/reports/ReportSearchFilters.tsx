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
import { Search as SearchIcon, Filter } from "lucide-react";
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
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-grow w-full">
            <Input
              id="search-term"
              type="text"
              placeholder="Search by driver name or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-auto">
            <Select
              value={selectedStatus}
              onValueChange={(value: ReportStatusType | "All") => handleStatusChange(value)}
            >
              <SelectTrigger id="status-filter" className="w-full md:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Reports" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Reports</SelectItem>
                {reportStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-auto">
            <Button onClick={handleSearchButtonClick} className="w-full">
              Search
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportSearchFilters;
