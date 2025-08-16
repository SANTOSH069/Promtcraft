import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Image, Video, Book, MessageSquare } from "lucide-react";

export default function Lab() {
  useEffect(() => {
    document.title = "Lab | PromptCraft";
    const desc = "Explore AI labs: Image, Video, Notion, and Threads.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  return (
    <main className="container max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">Lab</h1>
        <p className="text-muted-foreground mt-1">
          Choose a lab to start an AI conversation.
        </p>
      </header>

      <section aria-label="AI Labs" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/lab/image" className="group rounded-lg border bg-background p-6 transition-colors hover:bg-accent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-gradient-accent flex items-center justify-center">
              <Image className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-medium">Image Generation</h2>
              <p className="text-sm text-muted-foreground">Create visuals with AI</p>
            </div>
          </div>
        </Link>

        <Link to="/lab/video" className="group rounded-lg border bg-background p-6 transition-colors hover:bg-accent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-gradient-accent flex items-center justify-center">
              <Video className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-medium">Video Generation</h2>
              <p className="text-sm text-muted-foreground">Turn ideas into clips</p>
            </div>
          </div>
        </Link>

        <Link to="/lab/notion" className="group rounded-lg border bg-background p-6 transition-colors hover:bg-accent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-gradient-accent flex items-center justify-center">
              <Book className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-medium">Notion Lab</h2>
              <p className="text-sm text-muted-foreground">Draft pages and docs</p>
            </div>
          </div>
        </Link>

        <Link to="/lab/threads" className="group rounded-lg border bg-background p-6 transition-colors hover:bg-accent">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-gradient-accent flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-medium">Threads</h2>
              <p className="text-sm text-muted-foreground">Multi-turn assistants</p>
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}
