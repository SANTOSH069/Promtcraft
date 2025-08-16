import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Save, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface SavedPrompt {
  id: string;
  name: string;
  data: {
    conversation: string;
    generatedPrompt: string;
  };
  createdAt: Date;
  genre: string;
  task: string;
}

export default function ThreadsPromptChat() {
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [savedPrompts, setSavedPrompts] = useLocalStorage<SavedPrompt[]>("promptcraft-prompts", []);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Threads Prompt Generator | PromptCraft";
    const desc = "Convert chat conversations into structured prompts for LLMs.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  const generatePrompt = () => {
    if (!userInput.trim()) {
      toast({
        title: "Input required",
        description: "Please enter your conversation to generate a prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      // Process the conversation to create a structured prompt
      const lines = userInput.split("\n");
      let processedPrompt = "";
      let currentSpeaker = "";
      const formattedConversation: string[] = [];

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Try to detect speaker patterns like "User:" or "AI:" or "ChatGPT:"
        const speakerMatch = trimmedLine.match(/^([\w\s]+):\s*(.*)$/);
        
        if (speakerMatch) {
          const [, speaker, content] = speakerMatch;
          currentSpeaker = speaker.trim();
          formattedConversation.push(`${currentSpeaker}: ${content}`);
        } else if (currentSpeaker) {
          // Continue with the previous speaker
          formattedConversation[formattedConversation.length - 1] += `\n${trimmedLine}`;
        } else {
          // No speaker detected, assume it's part of the prompt
          formattedConversation.push(trimmedLine);
        }
      }

      // Format the conversation into a prompt
      processedPrompt = `I want you to respond to me as if we were having this conversation:\n\n${formattedConversation.join("\n\n")}\n\nContinue the conversation in the same style and tone.`;

      setGeneratedPrompt(processedPrompt);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
  };

  const saveToLibrary = () => {
    if (!generatedPrompt) {
      toast({
        title: "No prompt to save",
        description: "Please generate a prompt first.",
        variant: "destructive",
      });
      return;
    }

    const newPrompt: SavedPrompt = {
      id: crypto.randomUUID(),
      name: `Threads Prompt ${new Date().toLocaleDateString()}`,
      data: {
        conversation: userInput,
        generatedPrompt,
      },
      createdAt: new Date(),
      genre: "Conversation",
      task: "LLM Prompt",
    };

    setSavedPrompts([...savedPrompts, newPrompt]);
    toast({
      title: "Saved to library",
      description: "Your prompt has been saved to your library.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conversation to Prompt Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="conversation">Paste your conversation</Label>
            <Textarea
              id="conversation"
              placeholder="Paste your conversation with an AI assistant here..."
              className="min-h-[200px]"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>

          <Button 
            onClick={generatePrompt} 
            className="w-full" 
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Prompt
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedPrompt && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Prompt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-card">
              <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">
                {generatedPrompt}
              </pre>
            </ScrollArea>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(generatedPrompt)}
                className="flex-1"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Prompt
              </Button>
              <Button onClick={saveToLibrary} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save to Library
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}