import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Package, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

export const ProjectHealth = () => {
  const healthData = {
    overall: 85,
    security: { score: 90, issues: 2 },
    dependencies: { score: 80, outdated: 5, total: 45 },
    performance: { score: 88, metrics: "good" },
    codeQuality: { score: 82, complexity: "medium" },
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-primary";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-accent";
    if (score >= 60) return "bg-primary";
    return "bg-destructive";
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Saúde do Projeto
          </CardTitle>
          <CardDescription>Visão geral da qualidade e segurança do seu projeto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-7xl font-bold bg-gradient-to-br from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              {healthData.overall}
            </div>
            <p className="text-muted-foreground">Score Geral</p>
            <Progress value={healthData.overall} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-accent" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${getScoreColor(healthData.security.score)}`}>
                {healthData.security.score}
              </span>
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                <CheckCircle className="mr-1 h-3 w-3" />
                Bom
              </Badge>
            </div>
            <Progress value={healthData.security.score} className={`h-2 ${getScoreBg(healthData.security.score)}`} />
            <div className="text-sm text-muted-foreground">
              {healthData.security.issues} vulnerabilidades encontradas
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" />
              Dependências
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${getScoreColor(healthData.dependencies.score)}`}>
                {healthData.dependencies.score}
              </span>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Atenção
              </Badge>
            </div>
            <Progress value={healthData.dependencies.score} className={`h-2 ${getScoreBg(healthData.dependencies.score)}`} />
            <div className="text-sm text-muted-foreground">
              {healthData.dependencies.outdated} de {healthData.dependencies.total} desatualizadas
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-accent-glow" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${getScoreColor(healthData.performance.score)}`}>
                {healthData.performance.score}
              </span>
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                <CheckCircle className="mr-1 h-3 w-3" />
                Ótimo
              </Badge>
            </div>
            <Progress value={healthData.performance.score} className={`h-2 ${getScoreBg(healthData.performance.score)}`} />
            <div className="text-sm text-muted-foreground">Métricas: {healthData.performance.metrics}</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary-glow" />
              Qualidade do Código
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-bold ${getScoreColor(healthData.codeQuality.score)}`}>
                {healthData.codeQuality.score}
              </span>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Bom
              </Badge>
            </div>
            <Progress value={healthData.codeQuality.score} className={`h-2 ${getScoreBg(healthData.codeQuality.score)}`} />
            <div className="text-sm text-muted-foreground">Complexidade: {healthData.codeQuality.complexity}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
