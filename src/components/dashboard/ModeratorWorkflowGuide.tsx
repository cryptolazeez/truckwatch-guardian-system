
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Search, CheckCircle } from 'lucide-react';

const WorkflowStep = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex items-start gap-4">
    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <h4 className="text-md font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

const ModeratorWorkflowGuide = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl text-gray-700">Step-by-Step Workflow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <WorkflowStep
          icon={Eye}
          title="1. View Report Details"
          description="Click 'Moderate' on a pending report to see its full details, including evidence and reporter info."
        />
        <WorkflowStep
          icon={Search}
          title="2. Review Evidence"
          description="Carefully examine all evidence and add your findings to the 'Moderator Notes' section."
        />
        <WorkflowStep
          icon={CheckCircle}
          title="3. Take Action"
          description="Use the action buttons (Approve, Reject) to finalize the review. The report's status will update automatically."
        />
      </CardContent>
    </Card>
  );
};

export default ModeratorWorkflowGuide;
