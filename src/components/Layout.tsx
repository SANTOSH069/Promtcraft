import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";

export default function Layout() {
  const [activeTab, setActiveTab] = useState<"builder" | "library">("builder");
  const location = useLocation();
  const navigate = useNavigate();
  
  // Update active tab based on the current path and search params
  useEffect(() => {
    if (location.pathname === "/") {
      // Get tab from URL parameters
      const params = new URLSearchParams(location.search);
      const tabParam = params.get("tab");
      if (tabParam === "library" || tabParam === "builder") {
        setActiveTab(tabParam);
      } else {
        // Default to builder tab if no valid tab parameter
        setActiveTab("builder");
      }
    }
  }, [location.pathname, location.search]);

  const handleTabChange = (tab: "builder" | "library") => {
    setActiveTab(tab);
    
    // Always navigate to the home page with the correct tab parameter
    // This ensures navigation works from any page, including Labs
    navigate(`/?tab=${tab}`, { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}