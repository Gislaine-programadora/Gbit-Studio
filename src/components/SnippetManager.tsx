import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Copy, Search, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
}

export const SnippetManager = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([
    {
      id: "1",
      title: "React useState Hook",
      code: "const [state, setState] = useState(initialValue);",
      language: "typescript",
      tags: ["react", "hooks"],
    },
    {
      id: "2",
      title: "Async/Await Function",
      code: "async function fetchData() {\n  try {\n    const response = await fetch(url);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error(error);\n  }\n}",
      language: "javascript",
      tags: ["async", "fetch"],
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newSnippet, setNewSnippet] = useState({ title: "", code: "", language: "javascript", tags: "" });
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const filteredSnippets = snippets.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addSnippet = () => {
    if (!newSnippet.title || !newSnippet.code) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título e código",
        variant: "destructive",
      });
      return;
    }

    const snippet: Snippet = {
      id: Date.now().toString(),
      title: newSnippet.title,
      code: newSnippet.code,
      language: newSnippet.language,
      tags: newSnippet.tags.split(",").map((t) => t.trim()),
    };

    setSnippets([...snippets, snippet]);
    setNewSnippet({ title: "", code: "", language: "javascript", tags: "" });
    setShowForm(false);
    toast({
      title: "Snippet salvo",
      description: "Seu snippet foi adicionado com sucesso",
    });
  };

  const copySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copiado!",
      description: "Snippet copiado para área de transferência",
    });
  };

  const deleteSnippet = (id: string) => {
    setSnippets(snippets.filter((s) => s.id !== id));
    toast({
      title: "Snippet removido",
      description: "Snippet deletado com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Meus Snippets
              </CardTitle>
              <CardDescription>Organize e acesse rapidamente seus trechos de código</CardDescription>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-glow)] transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Snippet
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Buscar snippets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-background/50 border-border/50"
          />

          {showForm && (
            <Card className="border-border/30 bg-muted/30">
              <CardContent className="space-y-4 pt-6">
                <Input
                  placeholder="Título do snippet"
                  value={newSnippet.title}
                  onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
                  className="bg-background/50 border-border/50"
                />
                <Textarea
                  placeholder="Cole seu código aqui..."
                  value={newSnippet.code}
                  onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                  className="min-h-[150px] font-mono text-sm bg-background/50 border-border/50"
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Tags (separadas por vírgula)"
                    value={newSnippet.tags}
                    onChange={(e) => setNewSnippet({ ...newSnippet, tags: e.target.value })}
                    className="bg-background/50 border-border/50"
                  />
                  <Button onClick={addSnippet}>Salvar</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredSnippets.map((snippet) => (
          <Card key={snippet.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{snippet.title}</CardTitle>
                  <div className="flex gap-2">
                    {snippet.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copySnippet(snippet.code)}
                    className="hover:bg-primary/20 hover:text-primary"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteSnippet(snippet.id)}
                    className="hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-background/50 border border-border/30 rounded-lg p-3 max-h-[200px] overflow-auto">
                <pre className="text-xs font-mono text-foreground">{snippet.code}</pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
