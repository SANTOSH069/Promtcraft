import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Library, Sparkles, FlaskConical } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  activeTab: "builder" | "library";
  onTabChange: (tab: "builder" | "library") => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-accent rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <a href = "/">
            <h1 className="text-xl font-bold tracking-tight">PromptCraft</h1>
            </a>
          </div>
          
        </div>

        <nav className="flex items-center space-x-2">          
          <ThemeToggle />
          <Button
            variant={activeTab === "builder" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onTabChange("builder")}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Builder</span>
          </Button>
          <Button
            variant={activeTab === "library" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onTabChange("library")}
            className="flex items-center space-x-2"
          >
            <Library className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/lab" className="flex items-center space-x-2">
              <FlaskConical className="h-4 w-4" />
              <span className="hidden sm:inline">Lab</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}