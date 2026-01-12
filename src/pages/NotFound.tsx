
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-medical-600">404</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700">Page Not Found</p>
        <p className="mt-2 text-gray-500">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="mt-8 bg-medical-600 hover:bg-medical-700">
          <Link to="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
