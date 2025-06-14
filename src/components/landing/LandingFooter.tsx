
import { Link } from "react-router-dom";

const LandingFooter = () => {
  return (
    <footer className="w-full py-8 border-t bg-white">
      <div className="container px-4 md:px-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} TruckWatch. All rights reserved.</p>
        <p className="mt-1">
          <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link> | <Link to="/terms-of-service" className="hover:text-primary">Terms of Service</Link>
        </p>
      </div>
    </footer>
  );
};

export default LandingFooter;
