import ImagePromptChat from "@/components/labs/ImagePromptChat";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ImageLab() {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <nav className="container max-w-7xl mx-auto px-4 pt-6">
        <Link to="/lab" className="inline-flex items-center text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Lab
        </Link>
      </nav>
      <ImagePromptChat />
    </div>
  );
}
