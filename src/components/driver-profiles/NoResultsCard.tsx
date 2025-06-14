
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface NoResultsCardProps {
    searchTerm: string;
}

const NoResultsCard: React.FC<NoResultsCardProps> = ({ searchTerm }) => {
    return (
        <Card className="mb-8 text-center py-8">
            <CardContent>
                <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold">No Driver Profiles Found</p>
                <p className="text-muted-foreground">
                    No profiles match your search criteria "{searchTerm}". Try a different search.
                </p>
            </CardContent>
        </Card>
    );
};

export default NoResultsCard;
