import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Save, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface SavedPrompt {
  id: string;
  name: string;
  data: {
    type: string;
    command: string;
    flags: {
      aspect: string;
      motion: string;
      video: number;
    };
    task: string;
    story: {
      genre: string;
    };
  };
  createdAt: Date;
  genre?: string;
  task?: string;
}

export default function VideoPromptChat() {
  const { toast } = useToast();
  const [savedPrompts, setSavedPrompts] = useLocalStorage<SavedPrompt[]>("promptcraft-prompts", []);

  const [userInput, setUserInput] = useState("");
  const [idea, setIdea] = useState("");
  const [aspect, setAspect] = useState("91:51");
  const [motion, setMotion] = useState("high");
  const [isGenerating, setIsGenerating] = useState(false);

  const command = useMemo(() => {
    const base = `/imagine ${idea}`.trim();
    const flags = [`--ar ${aspect}`, `--motion ${motion}`, `--video 1`].join(" ");
    return `${base} ${flags}`.trim();
  }, [idea, aspect, motion]);

  const structured = useMemo(() => {
    return `/imagine ${idea} --ar ${aspect} --motion ${motion} --video 1`;
  }, [idea, aspect, motion]);

  useEffect(() => {
    document.title = "Video Generation | PromptCraft";
    const metaName = "description";
    const desc = "Generate Midjourney video prompts with the right flags.";
    let meta = document.querySelector(`meta[name="${metaName}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", metaName);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", window.location.href);
  }, []);

  const copyText = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${label} copied to clipboard` });
  };

  const generatePrompt = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Parse user input to generate appropriate video prompt
      // This is a simplified example - in a real app, you might use an actual AI service
      const input = userInput.toLowerCase();
      
      // Set the idea from user input
      setIdea(userInput);
      
      // Set aspect ratio based on content analysis
      if (input.includes('vertical') || input.includes('portrait')) {
        setAspect('9:16');
      } else if (input.includes('square')) {
        setAspect('1:1');
      } else if (input.includes('widescreen') || input.includes('landscape')) {
        setAspect('16:9');
      } else {
        setAspect('91:51'); // Default cinematic ratio
      }
      
      // Set motion level based on content analysis
      if (input.includes('slow') || input.includes('gentle') || input.includes('subtle')) {
        setMotion('low');
      } else if (input.includes('moderate') || input.includes('medium')) {
        setMotion('medium');
      } else {
        setMotion('high'); // Default to high motion
      }
      
      setIsGenerating(false);
      toast({ title: "Generated", description: "Video prompt generated successfully" });
    }, 1000);
  };

  const saveToLibrary = () => {
    const data = {
      type: "video",
      command,
      flags: { aspect, motion, video: 1 },
      task: "Midjourney Video Prompt",
      story: { genre: "Video" },
    };

    const nameBase = idea ? `Video: ${idea.slice(0, 40)}` : "Video Prompt";
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newEntry: SavedPrompt = {
      id: crypto.randomUUID(),
      name: `${nameBase} (${timestamp})`,
      data,
      createdAt: new Date(),
      genre: data.story.genre,
      task: data.task,
    };

    setSavedPrompts((prev) => [newEntry, ...prev]);
    toast({ title: "Saved", description: "Prompt saved to Library" });
  };

  return (
    <main className="container max-w-5xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Video Generation</h1>
        <p className="text-muted-foreground mt-1">
          Create Midjourney video prompts and save them to your Library.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2" aria-label="Video Prompt Builder">
        <Card>
          <CardHeader>
            <CardTitle>Prompt Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userInput">Describe what you want to generate</Label>
              <Textarea
                id="userInput"
                placeholder="e.g., a black cat with blue eyes comes to greet the robots. The robot pets the black cat"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="mt-1"
              />
              <Button 
                onClick={generatePrompt} 
                className="mt-2 w-full bg-gradient-primary" 
                disabled={!userInput.trim() || isGenerating}
              >
                <Wand2 className="h-4 w-4 mr-2" /> {isGenerating ? "Generating..." : "Generate Prompt"}
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="idea">Generated Scene</Label>
              <Textarea
                id="idea"
                placeholder="Your generated scene will appear here"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Aspect Ratio (--ar)</Label>
                <Select value={aspect} onValueChange={setAspect}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="--ar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="91:51">91:51</SelectItem>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="9:16">9:16</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Motion (--motion)</Label>
                <Select value={motion} onValueChange={setMotion}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="--motion" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">high</SelectItem>
                    <SelectItem value="medium">medium</SelectItem>
                    <SelectItem value="low">low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => copyText(command, "Video command")}>
                <Copy className="h-4 w-4 mr-2" /> Copy Command
              </Button>
              <Button className="bg-gradient-primary" onClick={saveToLibrary}>
                <Save className="h-4 w-4 mr-2" /> Save to Library
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[520px]">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Midjourney Command</h3>
                  <pre className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap text-foreground">{structured}</pre>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" onClick={() => copyText(structured, "Video command")}>
                      <Copy className="h-4 w-4 mr-2" /> Copy Command
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
