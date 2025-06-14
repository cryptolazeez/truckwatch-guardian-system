
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface DriverSearchFormProps {
    onSearch: (term: string) => void;
    initialTerm?: string;
}

const DriverSearchForm: React.FC<DriverSearchFormProps> = ({ onSearch, initialTerm = '' }) => {
    const [tempSearchTerm, setTempSearchTerm] = useState(initialTerm);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(tempSearchTerm);
    };

    return (
        <Card className="mb-8 shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                    <Search className="mr-2 h-5 w-5 text-primary" /> Search Driver Profiles
                </CardTitle>
                <CardDescription>Enter driver's name, CDL, or associated company to find profiles.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Input
                            type="text"
                            placeholder="Driver Name, CDL, or Company..."
                            className="flex-grow"
                            value={tempSearchTerm}
                            onChange={(e) => setTempSearchTerm(e.target.value)}
                        />
                        <Button type="submit" className="w-full sm:w-auto">
                            <Search className="mr-2 h-4 w-4" /> Search
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default DriverSearchForm;
