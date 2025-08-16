import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Copy, Save, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptData {
  task: string;
  taskRules: string[];
  genre: string;
  storyline: string;
  specifics: string;
  vulgar: boolean;
  cussing: boolean;
  maxWords: number;
  minWords: number;
  maxChapterPerOutput: number;
  uniquenessLevel: number;
}

interface PromptBuilderProps {
  onSave: (prompt: {
    task: string;
    taskRules: string[];
    storyteller: {
      rules: string[];
    };
    story: {
      genre: string;
      plot: {
        storyline: string;
        specifics: string;
      };
      detail: string;
      vulgar: boolean;
      cussing: boolean;
      chapters: {
        maxWords: number;
        minWords: number;
        maxChapterPerOutput: number;
        uniquenessLevel: number;
      };
    };
  }) => void;
}

export default function PromptBuilder({ onSave }: PromptBuilderProps) {
  const { toast } = useToast();
  const [userInput, setUserInput] = useState("");
  const [promptData, setPromptData] = useState<PromptData>({
    task: "",
    taskRules: [""],
    genre: "",
    storyline: "",
    specifics: "",
    vulgar: false,
    cussing: false,
    maxWords: 125,
    minWords: 75,
    maxChapterPerOutput: 1,
    uniquenessLevel: 100,
  });

  const addRule = () => {
    setPromptData({
      ...promptData,
      taskRules: [...promptData.taskRules, ""],
    });
  };

  const removeRule = (index: number) => {
    setPromptData({
      ...promptData,
      taskRules: promptData.taskRules.filter((_, i) => i !== index),
    });
  };

  const updateRule = (index: number, value: string) => {
    const newRules = [...promptData.taskRules];
    newRules[index] = value;
    setPromptData({
      ...promptData,
      taskRules: newRules,
    });
  };

  const generateJSON = () => {
    return {
      task: promptData.task,
      taskRules: promptData.taskRules.filter(rule => rule.trim() !== ""),
      storyteller: {
        rules: [
          "You must be able to complete the story",
          "Output should only be 1 chapter and at most 1 chapter. IMPORTANT",
          "Follows the story object contents strictly"
        ]
      },
      story: {
        genre: promptData.genre,
        plot: {
          storyline: promptData.storyline,
          specifics: promptData.specifics
        },
        detail: "Must be in great and specific detail, dialogues must be humane, serious and humor, all characters should be named",
        vulgar: promptData.vulgar,
        cussing: promptData.cussing,
        chapters: {
          maxWords: promptData.maxWords,
          minWords: promptData.minWords,
          maxChapterPerOutput: promptData.maxChapterPerOutput,
          uniquenessLevel: promptData.uniquenessLevel
        }
      }
    };
  };

  const copyToClipboard = () => {
    const json = JSON.stringify(generateJSON(), null, 2);
    navigator.clipboard.writeText(json);
    toast({
      title: "Copied to clipboard",
      description: "JSON prompt has been copied to your clipboard",
    });
  };

  const parseUserInput = () => {
    if (!userInput.trim()) return;

    const input = userInput.toLowerCase();
    
    // Extract genre
    const genres = ["sci-fi", "fantasy", "romance", "horror", "mystery", "thriller", "adventure", "drama", "comedy"];
    const foundGenre = genres.find(genre => input.includes(genre));
    
    // Extract task (look for "act as" or "be a" patterns)
    let task = "";
    if (input.includes("act as")) {
      const match = input.match(/act as (.*?)(?:\.|,|$)/);
      if (match) task = `Act as ${match[1]}`;
    } else if (input.includes("be a")) {
      const match = input.match(/be a (.*?)(?:\.|,|$)/);
      if (match) task = `Act as a ${match[1]}`;
    }
    
    // Extract content flags
    const vulgar = input.includes("vulgar") || input.includes("mature") || input.includes("adult");
    const cussing = input.includes("cussing") || input.includes("swearing") || input.includes("profanity");
    
    // Extract word counts
    let maxWords = 125, minWords = 75;
    const maxWordsMatch = input.match(/(\d+)\s*max\s*words?/);
    const minWordsMatch = input.match(/(\d+)\s*min\s*words?/);
    if (maxWordsMatch) maxWords = parseInt(maxWordsMatch[1]);
    if (minWordsMatch) minWords = parseInt(minWordsMatch[1]);

    setPromptData({
      ...promptData,
      task: task || "Act as a storyteller, the rules must be strictly followed!",
      genre: foundGenre ? foundGenre.charAt(0).toUpperCase() + foundGenre.slice(1) : "",
      storyline: userInput,
      vulgar,
      cussing,
      maxWords,
      minWords,
    });

    toast({
      title: "Input parsed!",
      description: "Your input has been converted to form fields",
    });
  };

  const savePrompt = () => {
    const json = generateJSON();
    onSave({
      ...json,
      task: promptData.task,
      story: {
        ...json.story,
        genre: promptData.genre
      },
    });
    toast({
      title: "Prompt saved",
      description: "Your prompt has been saved to the library",
    });
  };

  const parseAndSave = () => {
    parseUserInput();
    // Auto-save after parsing
    setTimeout(() => {
      if (userInput.trim()) {
        savePrompt();
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Natural Language Input */}
      <Card className="shadow-lg border-0 bg-gradient-primary">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary-foreground dark:text-white">Quick Prompt Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="userInput" className="text-sm font-medium text-primary-foreground dark:text-white">
              Describe your prompt in natural language
            </Label>
            <Textarea
              id="userInput"
              placeholder="e.g., Act as a storyteller and create a sci-fi story about AI with 200 max words, allow cussing..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="mt-2 h-24 bg-background text-foreground"
            />
          </div>
          <Button onClick={parseUserInput} className="w-full bg-background text-primary hover:bg-background/90">
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Prompt Structure
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-0 bg-gradient-subtle">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Fine-tune Your Prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Task Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="task" className="text-sm font-medium">
                Main Task
              </Label>
              <Input
                id="task"
                placeholder="e.g., Act as a storyteller, the rules must be strictly followed!"
                value={promptData.task}
                onChange={(e) => setPromptData({ ...promptData, task: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* Task Rules */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Task Rules</Label>
                <Button
                  onClick={addRule}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Rule
                </Button>
              </div>
              <div className="space-y-2">
                {promptData.taskRules.map((rule, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Rule ${index + 1}`}
                      value={rule}
                      onChange={(e) => updateRule(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeRule(index)}
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Story Configuration */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Story Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  placeholder="e.g., Sci-Fi, Fantasy, Romance"
                  value={promptData.genre}
                  onChange={(e) => setPromptData({ ...promptData, genre: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="storyline">Storyline</Label>
                <Textarea
                  id="storyline"
                  placeholder="Brief description of the main story plot..."
                  value={promptData.storyline}
                  onChange={(e) => setPromptData({ ...promptData, storyline: e.target.value })}
                  className="mt-1 h-20"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="specifics">Specifics</Label>
                <Textarea
                  id="specifics"
                  placeholder="Any specific details or requirements..."
                  value={promptData.specifics}
                  onChange={(e) => setPromptData({ ...promptData, specifics: e.target.value })}
                  className="mt-1 h-16"
                />
              </div>
            </div>

            {/* Content Settings */}
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="vulgar"
                  checked={promptData.vulgar}
                  onCheckedChange={(checked) => setPromptData({ ...promptData, vulgar: checked })}
                />
                <Label htmlFor="vulgar">Allow Vulgar Content</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="cussing"
                  checked={promptData.cussing}
                  onCheckedChange={(checked) => setPromptData({ ...promptData, cussing: checked })}
                />
                <Label htmlFor="cussing">Allow Cussing</Label>
              </div>
            </div>

            {/* Chapter Settings */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="minWords">Min Words</Label>
                <Input
                  id="minWords"
                  type="number"
                  value={promptData.minWords}
                  onChange={(e) => setPromptData({ ...promptData, minWords: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxWords">Max Words</Label>
                <Input
                  id="maxWords"
                  type="number"
                  value={promptData.maxWords}
                  onChange={(e) => setPromptData({ ...promptData, maxWords: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxChapter">Max Chapters</Label>
                <Input
                  id="maxChapter"
                  type="number"
                  value={promptData.maxChapterPerOutput}
                  onChange={(e) => setPromptData({ ...promptData, maxChapterPerOutput: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="uniqueness">Uniqueness %</Label>
                <Input
                  id="uniqueness"
                  type="number"
                  value={promptData.uniquenessLevel}
                  onChange={(e) => setPromptData({ ...promptData, uniquenessLevel: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button onClick={copyToClipboard} variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy JSON
            </Button>
            <Button onClick={savePrompt} className="bg-gradient-primary dark:text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Prompt
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* JSON Preview */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg font-medium">JSON Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96 font-mono text-foreground">
            {JSON.stringify(generateJSON(), null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}