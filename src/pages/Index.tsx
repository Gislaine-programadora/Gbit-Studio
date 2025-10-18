import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Code2, Activity, FileCode, Gauge } from "lucide-react";
import { ComplexityAnalyzer } from "@/components/ComplexityAnalyzer";
import { ApiTester } from "@/components/ApiTester";
import { SnippetManager } from "@/components/SnippetManager";
import { ProjectHealth } from "@/components/ProjectHealth";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Code2 className="h-8 w-8 text-primary animate-glow" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                Gbit Studio
              </h1>
              <p className="text-xs text-muted-foreground">Ferramentas modernas para desenvolvedores</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 animate-fade-in">
        <Tabs defaultValue="analyzer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 gap-4 bg-card/50 p-2 backdrop-blur-sm border border-border/50">
            <TabsTrigger 
              value="analyzer" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10 data-[state=active]:text-primary transition-all duration-300"
            >
              <Gauge className="h-4 w-4 mr-2" />
              Complexity
            </TabsTrigger>
            <TabsTrigger 
              value="api-tester"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10 data-[state=active]:text-primary transition-all duration-300"
            >
              <Activity className="h-4 w-4 mr-2" />
              API Tester
            </TabsTrigger>
            <TabsTrigger 
              value="snippets"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10 data-[state=active]:text-primary transition-all duration-300"
            >
              <FileCode className="h-4 w-4 mr-2" />
              Snippets
            </TabsTrigger>
            <TabsTrigger 
              value="health"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10 data-[state=active]:text-primary transition-all duration-300"
            >
              <Code2 className="h-4 w-4 mr-2" />
              Health
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyzer" className="animate-slide-up">
            <ComplexityAnalyzer />
          </TabsContent>

          <TabsContent value="api-tester" className="animate-slide-up">
            <ApiTester />
          </TabsContent>

          <TabsContent value="snippets" className="animate-slide-up">
            <SnippetManager />
          </TabsContent>

          <TabsContent value="health" className="animate-slide-up">
            <ProjectHealth />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
