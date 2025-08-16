import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
    structured: {
      subject: string;
      medium: string;
      environment: string;
      lighting: string;
      color: string;
      mood: string;
      composition: string;
      aspect: string;
      version: string;
      profile: boolean;
      sref: string;
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

export default function ImagePromptChat() {
  const { toast } = useToast();
  const [savedPrompts, setSavedPrompts] = useLocalStorage<SavedPrompt[]>("promptcraft-prompts", []);

  const [userInput, setUserInput] = useState("");
  const [subject, setSubject] = useState("");
  const [medium, setMedium] = useState("photo");
  const [environment, setEnvironment] = useState("outdoors");
  const [lighting, setLighting] = useState("cinematic");
  const [color, setColor] = useState("vibrant");
  const [mood, setMood] = useState("energetic");
  const [composition, setComposition] = useState("closeup");
  const [aspect, setAspect] = useState("16:9");
  const [version, setVersion] = useState("7");
  const [profileFlag, setProfileFlag] = useState(true);
  const [sref, setSref] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const structured = useMemo(() => {
    return [
      `Subject: ${subject || ""}`,
      `Medium: ${medium}`,
      `Environment: ${environment}`,
      `Lighting: ${lighting}`,
      `Color: ${color}`,
      `Mood: ${mood}`,
      `Composition: ${composition}`,
    ].join("\n");
  }, [subject, medium, environment, lighting, color, mood, composition]);

  const command = useMemo(() => {
    const base = `/imagine ${subject || ""} ${medium}, ${environment}, ${lighting} lighting, ${color} colors, ${mood} mood, ${composition}`.trim();
    const flags = [
      `--ar ${aspect}`,
      profileFlag ? `--profile` : "",
      `--v ${version}`,
      sref ? `--sref ${sref}` : "",
    ]
      .filter(Boolean)
      .join(" ");
    return `${base} ${flags}`.trim();
  }, [subject, medium, environment, lighting, color, mood, composition, aspect, version, profileFlag, sref]);

  useEffect(() => {
    document.title = "Image Generation | PromptCraft";
    const metaName = "description";
    const desc = "Generate Midjourney image prompts with structured controls.";
    let meta = document.querySelector(`meta[name="${metaName}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", metaName);
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    // Canonical tag
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
      // Parse user input to generate appropriate values
      // This is a simplified example - in a real app, you might use an actual AI service
      const input = userInput.toLowerCase();
      
      // Extract potential subject
      setSubject(userInput);
      
      // Set other fields based on content analysis
      if (input.includes('painting') || input.includes('art')) {
        setMedium('painting');
      } else if (input.includes('illustration')) {
        setMedium('illustration');
      } else if (input.includes('3d') || input.includes('render')) {
        setMedium('3d render');
      } else if (input.includes('sketch')) {
        setMedium('sketch');
      } else {
        setMedium('photo');
      }
      
      if (input.includes('indoor')) {
        setEnvironment('indoors');
      } else if (input.includes('underwater')) {
        setEnvironment('underwater');
      } else if (input.includes('city')) {
        setEnvironment('in the city');
      } else if (input.includes('moon')) {
        setEnvironment('on the moon');
      } else {
        setEnvironment('outdoors');
      }
      
      if (input.includes('soft light')) {
        setLighting('soft');
      } else if (input.includes('neon')) {
        setLighting('neon');
      } else if (input.includes('studio')) {
        setLighting('studio');
      } else if (input.includes('overcast')) {
        setLighting('overcast');
      } else {
        setLighting('cinematic');
      }
      
      if (input.includes('muted')) {
        setColor('muted');
      } else if (input.includes('monochrome') || input.includes('monochromatic')) {
        setColor('monochromatic');
      } else if (input.includes('colorful')) {
        setColor('colorful');
      } else if (input.includes('pastel')) {
        setColor('pastel');
      } else if (input.includes('black and white')) {
        setColor('black and white');
      } else {
        setColor('vibrant');
      }
      
      if (input.includes('playful')) {
        setMood('playful');
      } else if (input.includes('calm')) {
        setMood('calm');
      } else if (input.includes('gloomy') || input.includes('sad')) {
        setMood('gloomy');
      } else {
        setMood('energetic');
      }
      
      if (input.includes('portrait')) {
        setComposition('portrait');
      } else if (input.includes('headshot')) {
        setComposition('headshot');
      } else if (input.includes('birds-eye') || input.includes('aerial')) {
        setComposition('birds-eye view');
      } else if (input.includes('wide')) {
        setComposition('wide shot');
      } else {
        setComposition('closeup');
      }
      
      // Get a random SREF code from midjourneysref.com
      // In a real implementation, you would fetch this from an API
      const srefCodes = [
        '5523', '6953', '2829', '1829', '9283', 
        '4729', '3829', '7293', '8293', '1039'
      ];
      setSref(srefCodes[Math.floor(Math.random() * srefCodes.length)]);
      
      setIsGenerating(false);
      toast({ title: "Generated", description: "Prompt generated successfully" });
    }, 1000);
  };

  const saveToLibrary = () => {
    const data = {
      type: "image",
      command,
      structured: {
        subject,
        medium,
        environment,
        lighting,
        color,
        mood,
        composition,
        aspect,
        version,
        profile: profileFlag,
        sref,
      },
      task: "Midjourney Image Prompt",
      story: { genre: "Image" },
    };

    const nameBase = subject ? `Image: ${subject}` : "Image Prompt";
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
        <h1 className="text-2xl font-semibold">Image Generation</h1>
        <p className="text-muted-foreground mt-1">
          Build structured Midjourney prompts and save them to your Library.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2" aria-label="Image Prompt Builder">
        <Card>
          <CardHeader>
            <CardTitle>Prompt Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userInput">Describe what you want to generate</Label>
              <Textarea
                id="userInput"
                placeholder="e.g., a cinematic photo of an excited dog about to bite a hamburger given by his owner"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="mt-1"
              />
              <Button 
                onClick={generatePrompt} 
                className="mt-2 w-full bg-gradient-primary dark:text-white " 
                disabled={!userInput.trim() || isGenerating}
              >
                <Wand2 className="h-4 w-4 mr-2" /> {isGenerating ? "Generating..." : "Generate Prompt"}
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="subject">Generated Subject</Label>
              <Textarea
                id="subject"
                placeholder="Your generated subject will appear here"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Medium</Label>
                <Select value={medium} onValueChange={setMedium}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Choose medium" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo">photo</SelectItem>
                    <SelectItem value="illustration">illustration</SelectItem>
                    <SelectItem value="painting">painting</SelectItem>
                    <SelectItem value="3d render">3D render</SelectItem>
                    <SelectItem value="sketch">sketch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Environment</Label>
                <Select value={environment} onValueChange={setEnvironment}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Choose environment" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outdoors">outdoors</SelectItem>
                    <SelectItem value="indoors">indoors</SelectItem>
                    <SelectItem value="underwater">underwater</SelectItem>
                    <SelectItem value="in the city">in the city</SelectItem>
                    <SelectItem value="on the moon">on the moon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Lighting</Label>
                <Select value={lighting} onValueChange={setLighting}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Choose lighting" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cinematic">cinematic</SelectItem>
                    <SelectItem value="soft">soft</SelectItem>
                    <SelectItem value="neon">neon</SelectItem>
                    <SelectItem value="studio">studio lights</SelectItem>
                    <SelectItem value="overcast">overcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Color</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Choose color" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vibrant">vibrant</SelectItem>
                    <SelectItem value="muted">muted</SelectItem>
                    <SelectItem value="monochromatic">monochromatic</SelectItem>
                    <SelectItem value="colorful">colorful</SelectItem>
                    <SelectItem value="pastel">pastel</SelectItem>
                    <SelectItem value="black and white">black and white</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Mood</Label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Choose mood" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="energetic">energetic</SelectItem>
                    <SelectItem value="playful">playful</SelectItem>
                    <SelectItem value="calm">calm</SelectItem>
                    <SelectItem value="gloomy">gloomy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Composition</Label>
                <Select value={composition} onValueChange={setComposition}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Choose composition" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">portrait</SelectItem>
                    <SelectItem value="headshot">headshot</SelectItem>
                    <SelectItem value="closeup">closeup</SelectItem>
                    <SelectItem value="birds-eye view">birds-eye view</SelectItem>
                    <SelectItem value="wide shot">wide shot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Aspect Ratio (--ar)</Label>
                <Select value={aspect} onValueChange={setAspect}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="--ar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="1:1">1:1</SelectItem>
                    <SelectItem value="3:2">3:2</SelectItem>
                    <SelectItem value="4:5">4:5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Version (--v)</Label>
                <Select value={version} onValueChange={setVersion}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="--v" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="sref">Style Reference (--sref)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="sref"
                  placeholder="Paste SREF code or ID (find at midjourneysref.com)"
                  value={sref}
                  onChange={(e) => setSref(e.target.value)}
                />
                <a
                  href="https://midjourneysref.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline text-primary"
                >
                  Browse
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Tip: Open midjourneysref.com and paste any SREF code here to include it.</p>
            </div>

            <div className="flex gap-2 items-center">
              <Checkbox
                id="profileFlag"
                checked={profileFlag}
                onCheckedChange={(checked) => setProfileFlag(checked === true)}
              />
              <Label htmlFor="profileFlag" className="cursor-pointer">Include --profile</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => copyText(command, "Midjourney command")}>
                <Copy className="h-4 w-4 mr-2" /> Copy Command
              </Button>
              <Button className="bg-gradient-primary dark:text-white hover:bg-gradient-primary/90" onClick={saveToLibrary}>
                <Save className="h-4 w-4 mr-2 dark:text-white" /> Save to Library
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
                  <h3 className="font-medium mb-2">Structured</h3>
                  <pre className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap text-foreground">{structured}</pre>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" onClick={() => copyText(structured, "Structured prompt")}>
                      <Copy className="h-4 w-4 mr-2" /> Copy Structured
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Midjourney Command</h3>
                  <pre className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap text-foreground">{command}</pre>
                  <div className="mt-2">
                    <Button size="sm" variant="outline" onClick={() => copyText(command, "Midjourney command")}>
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
