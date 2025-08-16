import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import WebsiteBuildChat from '@/components/labs/WebsiteBuildChat';

const SiteBuilder = () => {
  return (
    <main>
      <div className="min-h-screen bg-gradient-subtle">
      <nav className="container max-w-7xl mx-auto px-4 pt-6">
        <Link to="/lab" className="inline-flex items-center text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Lab
        </Link>
      </nav>
      <WebsiteBuildChat/>
    </div>
    </main>
  )
}

export default SiteBuilder
