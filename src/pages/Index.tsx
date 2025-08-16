import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import PromptBuilder from "@/components/PromptBuilder";
import PromptLibrary from "@/components/PromptLibrary";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface SavedPrompt {
  id: string;
  name: string;
  data: {
    task?: string;
    story?: {
      genre?: string;
    };
    [key: string]: string | { genre?: string } | undefined;
  };
  createdAt: Date;
  genre?: string;
  task?: string;
}

const Index = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "builder";
  const [savedPrompts, setSavedPrompts] = useLocalStorage<SavedPrompt[]>("promptcraft-prompts", []);

  const generatePromptName = (data: { task?: string; story?: { genre?: string } }) => {
    const task = data.task || "Untitled Task";
    const genre = data.story?.genre;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (genre) {
      return `${genre} - ${task.slice(0, 30)}${task.length > 30 ? '...' : ''} (${timestamp})`;
    }
    return `${task.slice(0, 40)}${task.length > 40 ? '...' : ''} (${timestamp})`;
  };

  const savePrompt = (promptData: { task?: string; story?: { genre?: string }; [key: string]: string | { genre?: string } | undefined }) => {
    const newPrompt: SavedPrompt = {
      id: crypto.randomUUID(),
      name: generatePromptName(promptData),
      data: promptData,
      createdAt: new Date(),
      genre: promptData.story?.genre,
      task: promptData.task,
    };

    setSavedPrompts(prev => [newPrompt, ...prev]);
  };

  const deletePrompt = (id: string) => {
    setSavedPrompts(prev => prev.filter(prompt => prompt.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {tab === "builder" ? (
          <PromptBuilder onSave={savePrompt} />
        ) : (
          <PromptLibrary 
            prompts={savedPrompts.map(prompt => ({
              ...prompt,
              createdAt: new Date(prompt.createdAt)
            }))} 
            onDelete={deletePrompt} 
          />
        )}
      </main>
    </div>
  );
};

export default Index;
