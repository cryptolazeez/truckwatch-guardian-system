
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
      <ChevronLeft />
      Back
    </Button>
  );
};

export default BackButton;
