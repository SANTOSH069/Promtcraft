import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Copy, Trash2, Eye, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SavedPrompt {
  id: string;
  name: string;
  data: unknown;
  createdAt: Date;
  genre?: string;
  task?: string;
}

interface PromptLibraryProps {
  prompts: SavedPrompt[];
  onDelete: (id: string) => void;
}

export default function PromptLibrary({ prompts, onDelete }: PromptLibraryProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<SavedPrompt | null>(null);

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.genre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.task?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyPrompt = (prompt: SavedPrompt) => {
    const json = JSON.stringify(prompt.data, null, 2);
    navigator.clipboard.writeText(json);
    toast({
      title: "Copied to clipboard",
      description: "Prompt has been copied to your clipboard",
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-subtle">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-semibold">Prompt Library</CardTitle>
            <Badge variant="secondary" className="text-sm">
              {prompts.length} prompt{prompts.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts by name, genre, or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prompt List */}
        <div className="lg:col-span-1">
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredPrompts.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">
                      {searchTerm ? "No prompts match your search" : "No saved prompts yet"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredPrompts.map((prompt) => (
                  <Card
                    key={prompt.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPrompt?.id === prompt.id
                        ? "ring-2 ring-accent border-accent"
                        : "border-border hover:border-accent/50"
                    }`}
                    onClick={() => setSelectedPrompt(prompt)}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium truncate flex-1">{prompt.name}</h3>
                          <div className="flex gap-1 ml-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyPrompt(prompt);
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(prompt.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {prompt.genre && (
                          <Badge variant="outline" className="text-xs">
                            {prompt.genre}
                          </Badge>
                        )}
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(prompt.createdAt)}
                        </div>
                        
                        {prompt.task && (
                          <p className="text-xs text-muted-foreground truncate">
                            {prompt.task}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Prompt Detail */}
        <div className="lg:col-span-2">
          {selectedPrompt ? (
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">{selectedPrompt.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyPrompt(selectedPrompt)}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      onClick={() => onDelete(selectedPrompt.id)}
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created {formatDate(selectedPrompt.createdAt)}
                  </div>
                  {selectedPrompt.genre && (
                    <Badge variant="outline">{selectedPrompt.genre}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap text-foreground">
                    {JSON.stringify(selectedPrompt.data, null, 2)}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-0 border-dashed">
              <CardContent className="pt-6 h-[600px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Select a prompt to view details</p>
                  <p className="text-sm">Choose a prompt from the library to see its full JSON structure</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}