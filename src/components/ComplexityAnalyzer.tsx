import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, TrendingUp, Zap, Wand2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AnalysisResult {
  complexity: number;
  level: "low" | "medium" | "high";
  suggestions: string[];
  metrics: {
    lines: number;
    functions: number;
    loops: number;
    conditions: number;
  };
}

export const ComplexityAnalyzer = () => {
  const [code, setCode] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const { toast } = useToast();

  const autoComplete = () => {
    if (!code.trim()) {
      toast({
        title: "Código vazio",
        description: "Cole algum código para completar",
        variant: "destructive",
      });
      return;
    }

    try {
      let completed = code;
      
      // Auto-completa funções incompletas
      if (code.includes('function') && !code.includes('{')) {
        completed += ' {\n  // TODO: implementar\n}';
      }
      
      // Auto-completa arrow functions
      if (code.includes('=>') && !code.includes('{') && code.trim().endsWith('=>')) {
        completed += ' {\n  // TODO: implementar\n}';
      }
      
      // Auto-completa if sem else
      const ifCount = (code.match(/if\s*\(/g) || []).length;
      const elseCount = (code.match(/else/g) || []).length;
      if (ifCount > elseCount && code.includes('if')) {
        completed += '\n} else {\n  // caso alternativo\n}';
      }
      
      // Auto-completa try sem catch
      if (code.includes('try') && !code.includes('catch')) {
        completed += '\n} catch (error) {\n  console.error(error);\n}';
      }

      setCode(completed);
      toast({
        title: "Código completado",
        description: "Estruturas auto-completadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao completar",
        description: "Não foi possível completar o código",
        variant: "destructive",
      });
    }
  };

  const formatCode = () => {
    if (!code.trim()) {
      toast({
        title: "Código vazio",
        description: "Cole algum código para formatar",
        variant: "destructive",
      });
      return;
    }

    try {
      let formatted = code
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
      
      let indentLevel = 0;
      formatted = formatted.split('\n').map(line => {
        if (line.includes('}') || line.includes(']') || line.includes(')')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        const indented = '  '.repeat(indentLevel) + line;
        if (line.includes('{') || line.includes('[') || line.includes('(')) {
          indentLevel++;
        }
        return indented;
      }).join('\n');

      setCode(formatted);
      setShowHighlight(true);
      toast({
        title: "Código formatado",
        description: "Código organizado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao formatar",
        description: "Não foi possível formatar o código",
        variant: "destructive",
      });
    }
  };

  const analyzeCode = () => {
    if (!code.trim()) {
      toast({
        title: "Código vazio",
        description: "Cole algum código para analisar",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulação de análise
    setTimeout(() => {
      const lines = code.split("\n").length;
      const functions = (code.match(/function|=>|const.*=/g) || []).length;
      const loops = (code.match(/for|while|forEach|map/g) || []).length;
      const conditions = (code.match(/if|else|switch|\?/g) || []).length;
      
      const complexity = Math.min(100, (functions * 2 + loops * 3 + conditions * 1.5));
      const level = complexity < 30 ? "low" : complexity < 60 ? "medium" : "high";
      
      const suggestions = [];
      if (functions > 5) suggestions.push("Considere dividir em funções menores");
      if (loops > 3) suggestions.push("Revise os loops aninhados para melhor performance");
      if (conditions > 5) suggestions.push("Refatore condicionais complexas usando estratégias");
      if (lines > 100) suggestions.push("Arquivo muito grande, considere modularizar");
      
      setAnalysis({
        complexity: Math.round(complexity),
        level,
        suggestions: suggestions.length ? suggestions : ["Código está bem estruturado!"],
        metrics: { lines, functions, loops, conditions },
      });
      
      setLoading(false);
      toast({
        title: "Análise concluída",
        description: "Complexidade calculada com sucesso",
      });
    }, 1500);
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-accent text-accent-foreground";
      case "medium":
        return "bg-primary text-primary-foreground";
      case "high":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Cole seu código
          </CardTitle>
          <CardDescription>
            Analise a complexidade ciclomática e receba sugestões de melhoria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showHighlight && code ? (
            <div className="relative">
              <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.5rem',
                  minHeight: '300px',
                  fontSize: '0.875rem',
                }}
              >
                {code}
              </SyntaxHighlighter>
              <Button
                onClick={() => setShowHighlight(false)}
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 border-border/50"
              >
                Editar
              </Button>
            </div>
          ) : (
            <Textarea
              placeholder="// Cole seu código aqui...
function example() {
  return 'Hello World';
}"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setShowHighlight(false);
              }}
              className="min-h-[300px] font-mono text-sm bg-background/50 border-border/50"
            />
          )}
          <div className="grid grid-cols-3 gap-2">
            <Button 
              onClick={autoComplete}
              variant="outline"
              className="border-accent/50 hover:bg-accent/10"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Completar
            </Button>
            <Button 
              onClick={formatCode}
              variant="outline"
              className="border-primary/50 hover:bg-primary/10"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Formatar
            </Button>
            <Button 
              onClick={analyzeCode} 
              disabled={loading}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-glow)] transition-all duration-300"
            >
              {loading ? "Analisando..." : "Analisar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Resultado da Análise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {analysis ? (
            <>
              <div className="text-center space-y-2">
                <div className="text-6xl font-bold bg-gradient-to-br from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                  {analysis.complexity}
                </div>
                <Badge className={getComplexityColor(analysis.level)} variant="secondary">
                  Complexidade {analysis.level === "low" ? "Baixa" : analysis.level === "medium" ? "Média" : "Alta"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <MetricCard label="Linhas" value={analysis.metrics.lines} />
                <MetricCard label="Funções" value={analysis.metrics.functions} />
                <MetricCard label="Loops" value={analysis.metrics.loops} />
                <MetricCard label="Condicionais" value={analysis.metrics.conditions} />
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-sm">
                  {analysis.suggestions.length === 1 && analysis.suggestions[0].includes("bem estruturado") ? (
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-primary" />
                  )}
                  Sugestões
                </h4>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, i) => (
                    <li key={i} className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/30">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
              <Zap className="h-12 w-12 mb-4 opacity-20" />
              <p>Cole código e clique em analisar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const MetricCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-muted/30 p-4 rounded-lg border border-border/30">
    <div className="text-2xl font-bold text-primary">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);
