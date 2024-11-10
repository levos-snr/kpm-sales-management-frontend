import { Link } from "react-router-dom"; // Updated import for React Router
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col items-center justify-center space-y-8">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/assets/success-logo.svg" // You can use a placeholder logo or your own success-related logo
            alt="Success Logo"
            width="200"
            height="40"
            className="mx-auto"
          />
        </div>

        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
            <Check className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-semibold text-gray-900">
            Account created successfully!
          </h1>
          <p className="text-gray-500">
            Welcome aboard! Start your success journey with FIELDSALE.
          </p>
        </div>

        {/* Action Button */}
        <Link to="/dashboard"> {/* Button redirect to another page, such as a dashboard */}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md">
            Let&apos;s Start!
          </Button>
        </Link>
      </div>
    </div>
  );
}
