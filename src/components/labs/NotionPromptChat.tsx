import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Save, Wand2, FileText, BookOpen, Lightbulb, Zap, Users, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SavedPrompt {
  id: string;
  name: string;
  data: {
    content: string;
    summary: string;
    type: string;
  };
  createdAt: Date;
}

export default function NotionPromptChat() {
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedOutput, setProcessedOutput] = useState("");
  const [outputType, setOutputType] = useState<"template" | "content" | "troubleshooting" | "summary" | "table" | "automation" | "collaboration" | "formula" | "learning">("summary");
  const [savedPrompts, setSavedPrompts] = useLocalStorage<SavedPrompt[]>("notion-prompts", []);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Notion Lab | PromptCraft";
    const desc = "Draft, reorganize, and polish Notion pages with AI.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, []);

  const processInput = () => {
    if (!userInput.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to process.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      let result = "";

      switch (outputType) {
        case "template":
          result = generateTemplateIdeas(userInput);
          break;
        case "content":
          result = generateContentIdeas(userInput);
          break;
        case "troubleshooting":
          result = generateTroubleshooting(userInput);
          break;
        case "summary":
          result = generateSummary(userInput);
          break;
        case "table":
          result = generateTable(userInput);
          break;
        case "automation":
          result = generateAutomationIdeas(userInput);
          break;
        case "collaboration":
          result = generateCollaborationIdeas(userInput);
          break;
        case "formula":
          result = generateFormulaHelp(userInput);
          break;
        case "learning":
          result = generateLearningResources(userInput);
          break;
      }

      setProcessedOutput(result);
      setIsProcessing(false);
    }, 1000);
  };

  const generateTemplateIdeas = (input: string) => {
    // Simulate template ideas generation
    return `## Notion Template Ideas Based on Your Input

### Project Management
- **Project Dashboard**: Track progress, deadlines, and team assignments
- **Task Tracker**: Organize tasks with priority levels and status updates
- **Meeting Notes**: Template with action items, decisions, and follow-ups

### Personal Productivity
- **Habit Tracker**: Monitor daily habits with consistency charts
- **Goal Setting Framework**: Define goals with milestones and metrics
- **Content Calendar**: Plan and schedule your content creation

### Specific to Your Needs
${input.length > 50 ? "Based on your specific input, consider creating a custom template for " + input.split(" ").slice(0, 3).join(" ") + "..." : "Provide more details about your needs for more specific template recommendations."}

*Ready to implement these in Notion? Copy this text or click the button below to open Notion.*`;
  };

  const generateContentIdeas = (input: string) => {
    // Simulate content ideas generation
    return `## Content Ideas for Notion

### Blog Post Outline
1. Introduction: Hook your reader with a compelling question or statistic
2. Main Point 1: ${input.split(" ").slice(0, 3).join(" ")}...
3. Main Point 2: Expand on your concept with practical examples
4. Main Point 3: Address potential challenges or alternatives
5. Conclusion: Summarize key takeaways and call to action

### Social Media Content Calendar
- Monday: Share a tip related to ${input.split(" ").slice(0, 2).join(" ")}
- Wednesday: Post a question to engage your audience
- Friday: Create a mini-tutorial or how-to guide

### Email Newsletter Structure
- Subject Line: "Transform Your ${input.split(" ").slice(0, 1).join(" ")} With These Simple Tips"
- Opening: Personal story or relevant news
- Main Content: 3 actionable tips
- Closing: Invitation to reply or connect

*Copy this content to refine in Notion or click below to open Notion directly.*`;
  };

  const generateTroubleshooting = (input: string) => {
    // Simulate troubleshooting help
    return `## Notion Troubleshooting Guide

### Issue Identified
Based on your description, you're having trouble with: ${input.length > 30 ? input.substring(0, 30) + "..." : input}

### Potential Solutions

1. **Check Permissions**
   - Ensure you have the correct access level for the page
   - Ask workspace admin to check sharing settings

2. **Clear Cache and Refresh**
   - Log out and log back in
   - Try using Notion in a different browser

3. **Formula Syntax**
   - Verify your formula syntax follows Notion's requirements
   - Check for missing parentheses or quotation marks
   - Use the formula documentation for reference

4. **Database Relations**
   - Confirm that related databases exist and are properly linked
   - Check for circular references

### Advanced Troubleshooting
If the above solutions don't work, try:
- Contacting Notion support at team@makenotion.com
- Checking Notion's status page: status.notion.so
- Reviewing recent updates that might affect functionality

*Copy these troubleshooting steps to Notion for reference.*`;
  };

  const generateSummary = (input: string) => {
    // Simulate text summarization
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const wordCount = input.split(/\s+/).length;
    
    let summary = "## Summary of Your Text\n\n";
    
    if (sentences.length > 3) {
      // Take first and last sentence, plus one from the middle
      const firstSentence = sentences[0];
      const middleSentence = sentences[Math.floor(sentences.length / 2)];
      const lastSentence = sentences[sentences.length - 1];
      
      summary += `${firstSentence.trim()}. ${middleSentence.trim()}. ${lastSentence.trim()}.\n\n`;
    } else {
      // If text is already short, use it as is
      summary += `${input}\n\n`;
    }
    
    summary += `### Key Statistics\n- Word count: ${wordCount}\n- Sentence count: ${sentences.length}\n- Estimated reading time: ${Math.ceil(wordCount / 200)} minute${Math.ceil(wordCount / 200) !== 1 ? 's' : ''}\n\n`;
    
    summary += "### Key Points\n";
    
    // Extract some key points (simplified simulation)
    const words = input.split(/\s+/);
    const uniqueWords = [...new Set(words.filter(w => w.length > 5))];
    const sampleKeywords = uniqueWords.slice(0, Math.min(3, uniqueWords.length));
    
    sampleKeywords.forEach(keyword => {
      summary += `- Content related to "${keyword}"\n`;
    });
    
    summary += "\n*This summary is ready to paste into your Notion page.*";
    
    return summary;
  };

  const generateTable = (input: string) => {
    // Simulate table generation
    const lines = input.split('\n').filter(line => line.trim().length > 0);
    let tableOutput = "## Generated Table for Notion\n\n";
    
    // Determine if input has structure we can use for columns
    const hasBulletPoints = lines.some(line => line.trim().startsWith('-') || line.trim().startsWith('*'));
    const hasNumbering = lines.some(line => /^\d+\./.test(line.trim()));
    const hasColons = lines.some(line => line.includes(':'));
    
    if (hasBulletPoints || hasNumbering) {
      // Create a simple two-column table (Item | Notes)
      tableOutput += "| Item | Notes |\n| --- | --- |\n";
      
      lines.forEach(line => {
        // Remove bullet points or numbering
        const cleanLine = line.replace(/^\s*[-*]\s*|^\s*\d+\.\s*/g, '').trim();
        tableOutput += `| ${cleanLine} | |\n`;
      });
    } else if (hasColons) {
      // Create a table based on key-value pairs
      tableOutput += "| Property | Value |\n| --- | --- |\n";
      
      lines.forEach(line => {
        if (line.includes(':')) {
          const [key, value] = line.split(':').map(part => part.trim());
          tableOutput += `| ${key} | ${value || ''} |\n`;
        } else {
          tableOutput += `| ${line} | |\n`;
        }
      });
    } else {
      // Create a simple one-column table
      tableOutput += "| Content |\n| --- |\n";
      
      lines.forEach(line => {
        tableOutput += `| ${line.trim()} |\n`;
      });
    }
    
    tableOutput += "\n*Copy this markdown table directly into Notion. You can then customize it further.*";
    
    return tableOutput;
  };

  const generateAutomationIdeas = (input: string) => {
    // Simulate automation ideas
    return `## Notion Automation Ideas

### Integration Possibilities
1. **Zapier + Notion**
   - Automatically create Notion pages from form submissions
   - Add new calendar events to a Notion database
   - Log completed tasks from other apps to your Notion workspace

2. **Make.com (Integromat) Workflows**
   - Send Notion database updates to your team via Slack
   - Create recurring database entries on a schedule
   - Sync information between Notion and Google Sheets

3. **API Connections**
   - Connect your custom applications to Notion
   - Build dashboards that pull data from Notion
   - Create automated reporting systems

### Based on Your Input
${input.length > 30 ? "For your specific needs with '" + input.substring(0, 30) + "...', consider:" : "Provide more details about your workflow for specific automation recommendations."}
- Setting up automated data collection
- Creating notification systems for updates
- Implementing regular backup procedures

*Ready to implement these automations? Save this to Notion for reference.*`;
  };

  const generateCollaborationIdeas = (input: string) => {
    // Simulate collaboration ideas
    return `## Notion Collaboration Strategies

### Team Workspace Structure
1. **Central Hub Page**
   - Company announcements and updates
   - Quick links to important resources
   - Team directory with roles and contact info

2. **Department Sections**
   - Dedicated spaces for each team
   - Project tracking databases
   - Department-specific resources and templates

3. **Meeting & Documentation System**
   - Standardized meeting note templates
   - Decision log database
   - Action item tracking with assignments

### Communication Protocols
- Use comments for specific feedback on content
- @mentions for directing questions to team members
- Create update request templates for consistency

### Based on Your Team's Needs
${input.length > 40 ? "For your team working on '" + input.substring(0, 40) + "...', consider:" : "Provide more details about your team for specific collaboration recommendations."}
- Weekly status update templates
- Project milestone tracking
- Resource allocation database

*Copy these collaboration strategies to your Notion workspace.*`;
  };

  const generateFormulaHelp = (input: string) => {
    // Simulate formula help
    let formulaHelp = "## Notion Formula Help\n\n";
    
    // Check if input contains common formula keywords
    const hasDateFunctions = /date|dateAdd|dateSubtract|formatDate|now|timestamp/i.test(input);
    const hasLogicalOperators = /if|and|or|not|switch|case/i.test(input);
    const hasMathFunctions = /abs|ceil|floor|round|min|max|mod|pow|sqrt/i.test(input);
    const hasStringFunctions = /concat|format|join|length|replace|replaceAll|slice|test/i.test(input);
    
    formulaHelp += "### Formula Debugging\n";
    
    if (input.includes("=")) {
      formulaHelp += "Your formula appears to use '=' which is not needed in Notion formulas. Use '==' for equality checks instead.\n\n";
    }
    
    if (hasDateFunctions) {
      formulaHelp += "#### Date Function Examples\n```\n// Get current date\nformatDate(now(), \"MMMM D, YYYY\")\n\n// Add days to a date\ndateAdd(prop(\"Due Date\"), 7, \"days\")\n\n// Calculate days between dates\ndateBetween(now(), prop(\"Start Date\"), \"days\")\n```\n\n";
    }
    
    if (hasLogicalOperators) {
      formulaHelp += "#### Logical Operator Examples\n```\n// If statement\nif(prop(\"Status\") == \"Complete\", \"Done\", \"Pending\")\n\n// Multiple conditions\nif(and(prop(\"Priority\") == \"High\", prop(\"Status\") != \"Complete\"), \"Urgent\", \"Normal\")\n```\n\n";
    }
    
    if (hasMathFunctions) {
      formulaHelp += "#### Math Function Examples\n```\n// Round a number\nround(prop(\"Score\"))\n\n// Calculate percentage\nformat(prop(\"Completed\") / prop(\"Total\") * 100) + \"%\"\n```\n\n";
    }
    
    if (hasStringFunctions) {
      formulaHelp += "#### String Function Examples\n```\n// Combine text\nconcat(prop(\"First Name\"), \" \", prop(\"Last Name\"))\n\n// Extract part of text\nslice(prop(\"Full Name\"), 0, 1) + \".\"\n```\n\n";
    }
    
    // General formula tips
    formulaHelp += "### Common Formula Mistakes\n";
    formulaHelp += "- Missing parentheses or quotes\n";
    formulaHelp += "- Using commas instead of periods for decimals\n";
    formulaHelp += "- Incorrect property references (case sensitive)\n";
    formulaHelp += "- Using JavaScript syntax instead of Notion's formula syntax\n\n";
    
    formulaHelp += "*Copy this formula reference to your Notion page for future use.*";
    
    return formulaHelp;
  };

  const generateLearningResources = (input: string) => {
    // Simulate learning resources
    return `## Notion Learning Resources

### Official Notion Resources
- **Notion Guides**: https://www.notion.so/help/guides
- **Notion Templates**: https://www.notion.so/templates
- **Notion Webinars**: https://www.notion.so/webinars

### Community Resources
- **Notion Pages**: Community-created templates and guides
- **YouTube Tutorials**: Search for specific Notion features
- **Reddit Community**: r/Notion for questions and inspiration

### Recommended Learning Path
1. Start with basic pages and simple databases
2. Learn about relations and rollups
3. Explore formulas and advanced filters
4. Master templates and workspace organization
5. Implement integrations and automations

### Based on Your Interests
${input.length > 30 ? "For learning about '" + input.substring(0, 30) + "...', check out:" : "Provide more specific topics you want to learn for targeted resources."}
- Specialized tutorials on this topic
- Template examples to adapt
- Case studies of similar implementations

*Save these resources to your Notion workspace for future reference.*`;
  };

  const saveToLibrary = () => {
    if (!processedOutput) {
      toast({
        title: "Nothing to save",
        description: "Please generate content first.",
        variant: "destructive",
      });
      return;
    }

    const newPrompt: SavedPrompt = {
      id: crypto.randomUUID(),
      name: `Notion ${outputType.charAt(0).toUpperCase() + outputType.slice(1)} - ${new Date().toLocaleDateString()}`,
      data: {
        content: userInput,
        summary: processedOutput,
        type: outputType,
      },
      createdAt: new Date(),
    };

    setSavedPrompts((prev) => [newPrompt, ...prev]);

    toast({
      title: "Saved to library",
      description: "Your Notion content has been saved to your library.",
    });
  };

  const copyToClipboard = () => {
    if (!processedOutput) {
      toast({
        title: "Nothing to copy",
        description: "Please generate content first.",
        variant: "destructive",
      });
      return;
    }

    // Strip markdown formatting for cleaner copy
    const textToCopy = processedOutput.replace(/#+\s|\*\*|\*|`/g, '');
    navigator.clipboard.writeText(textToCopy);

    toast({
      title: "Copied to clipboard",
      description: "Content copied and ready to paste into Notion.",
    });
  };

  const openNotion = () => {
    window.open("https://notion.so", "_blank");
  };

  return (
    <div className="space-y-6 container max-w-5xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Notion Content Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Tabs defaultValue="summary" onValueChange={(value: "template" | "content" | "troubleshooting" | "summary" | "table" | "automation" | "collaboration" | "formula" | "learning") => setOutputType(value)}>
            <div className="w-full overflow-x-auto p-4 pb-4 rounded-md  ">
              <TabsList className="grid grid-cols-3 md:grid-cols-9 mb-6 mx-auto w-full max-w-4xl pb-4">
              <TabsTrigger value="summary" className="flex flex-col items-center gap-1 py-2 px-3">
                <FileText className="h-4 w-4" />
                <span className="text-xs">Summary</span>
              </TabsTrigger>
              <TabsTrigger value="template" className="flex flex-col items-center gap-1 py-2 px-3">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs">Templates</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex flex-col items-center gap-1 py-2 px-3">
                <Lightbulb className="h-4 w-4" />
                <span className="text-xs">Content</span>
              </TabsTrigger>
              <TabsTrigger value="troubleshooting" className="flex flex-col items-center gap-1 py-2 px-3">
                <Settings className="h-4 w-4" />
                <span className="text-xs">Troubleshoot</span>
              </TabsTrigger>
              <TabsTrigger value="table" className="flex flex-col items-center gap-1 py-2 px-3">
                <FileText className="h-4 w-4" />
                <span className="text-xs">Tables</span>
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex flex-col items-center gap-1 py-2 px-3">
                <Zap className="h-4 w-4" />
                <span className="text-xs">Automation</span>
              </TabsTrigger>
              <TabsTrigger value="collaboration" className="flex flex-col items-center gap-1 py-2 px-3">
                <Users className="h-4 w-4" />
                <span className="text-xs">Collaboration</span>
              </TabsTrigger>
              <TabsTrigger value="formula" className="flex flex-col items-center gap-1 py-2 px-3">
                <FileText className="h-4 w-4" />
                <span className="text-xs">Formulas</span>
              </TabsTrigger>
              <TabsTrigger value="learning" className="flex flex-col items-center gap-1 py-2 px-3">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs">Learning</span>
              </TabsTrigger>
            </TabsList>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notion-input">
                  {outputType === "summary" && "Paste text to summarize"}
                  {outputType === "template" && "Describe your template needs"}
                  {outputType === "content" && "Describe content you need to create"}
                  {outputType === "troubleshooting" && "Describe the issue you're facing"}
                  {outputType === "table" && "Enter data to convert to a table"}
                  {outputType === "automation" && "Describe your workflow needs"}
                  {outputType === "collaboration" && "Describe your team's collaboration needs"}
                  {outputType === "formula" && "Enter your Notion formula or describe what you need"}
                  {outputType === "learning" && "What Notion features do you want to learn about?"}
                </Label>
                <Textarea
                  id="notion-input"
                  placeholder={`Enter your ${outputType} text here...`}
                  className="min-h-[200px]"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </div>

              <Button 
                onClick={processInput} 
                className="w-full" 
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Process for Notion
                  </>
                )}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {processedOutput && (
        <Card>
          <CardHeader>
            <CardTitle>
              {outputType === "summary" && "Summarized Content"}
              {outputType === "template" && "Template Ideas"}
              {outputType === "content" && "Content Ideas"}
              {outputType === "troubleshooting" && "Troubleshooting Guide"}
              {outputType === "table" && "Generated Table"}
              {outputType === "automation" && "Automation Ideas"}
              {outputType === "collaboration" && "Collaboration Strategies"}
              {outputType === "formula" && "Formula Help"}
              {outputType === "learning" && "Learning Resources"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-card">
              <div className="whitespace-pre-wrap prose prose-sm dark:prose-invert">
                {processedOutput.split('\n').map((line, i) => {
                  // Convert markdown headings to styled text
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('## ', '')}</h2>;
                  } else if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-lg font-semibold mt-3 mb-1">{line.replace('### ', '')}</h3>;
                  } else if (line.startsWith('- ')) {
                    return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
                  } else if (line.startsWith('*')) {
                    return <p key={i} className="italic text-muted-foreground">{line.replace(/^\*|\*$/g, '')}</p>;
                  } else if (line.trim() === '') {
                    return <br key={i} />;
                  } else {
                    return <p key={i}>{line}</p>;
                  }
                })}
              </div>
            </ScrollArea>

            <div className="flex space-x-2 justify-between">
              <div className="space-x-2">
                <Button variant="outline" onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
                <Button variant="outline" onClick={saveToLibrary}>
                  <Save className="mr-2 h-4 w-4" />
                  Save to Library
                </Button>
              </div>
              <Button onClick={openNotion}>
                Go to Notion
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}