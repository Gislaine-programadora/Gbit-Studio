import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiResponse {
  status: number;
  time: number;
  data: any;
  error?: string;
}

export const ApiTester = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState("{}");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testApi = async () => {
    if (!url) {
      toast({
        title: "URL obrigatória",
        description: "Insira uma URL para testar",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResponse(null);
    const startTime = Date.now();

    try {
      let customHeaders: Record<string, string> = {};
      try {
        customHeaders = headers ? JSON.parse(headers) : {};
      } catch (e) {
        console.warn("Invalid headers JSON, using empty headers");
      }

      const options: RequestInit = {
        method,
        headers: customHeaders,
        mode: 'cors',
      };

      if (method !== "GET" && method !== "HEAD" && body) {
        options.body = body;
      }

      console.log('Making request to:', url, 'with options:', options);
      
      const res = await fetch(url, options);
      const endTime = Date.now();
      
      let data;
      const contentType = res.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setResponse({
        status: res.status,
        time: endTime - startTime,
        data,
      });

      toast({
        title: "Requisição concluída",
        description: `Status: ${res.status} - ${endTime - startTime}ms`,
      });
    } catch (error) {
      const endTime = Date.now();
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      
      console.error('API request error:', error);
      
      setResponse({
        status: 0,
        time: endTime - startTime,
        data: null,
        error: errorMessage,
      });

      toast({
        title: "Erro na requisição",
        description: errorMessage.includes('CORS') || errorMessage.includes('Failed to fetch') 
          ? "Erro CORS: A API não permite requisições do navegador. Tente usar headers CORS ou um proxy."
          : errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-accent text-accent-foreground";
    if (status >= 400) return "bg-destructive text-destructive-foreground";
    return "bg-primary text-primary-foreground";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Configurar Requisição
          </CardTitle>
          <CardDescription>
            Teste suas APIs de forma rápida e visual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-[120px] bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="https://api.example.com/endpoint"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Headers (JSON)</label>
            <Textarea
              placeholder='{\n  "Content-Type": "application/json"\n}'
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              className="min-h-[100px] font-mono text-sm bg-background/50 border-border/50"
            />
          </div>

          {method !== "GET" && method !== "HEAD" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Body (JSON)</label>
              <Textarea
                placeholder='{\n  "key": "value"\n}'
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[150px] font-mono text-sm bg-background/50 border-border/50"
              />
            </div>
          )}

          <Button
            onClick={testApi}
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-[var(--shadow-glow)] transition-all duration-300"
          >
            <Send className="mr-2 h-4 w-4" />
            {loading ? "Enviando..." : "Enviar Requisição"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {response?.status && response.status >= 200 && response.status < 300 ? (
              <CheckCircle className="h-5 w-5 text-accent" />
            ) : response?.status ? (
              <XCircle className="h-5 w-5 text-destructive" />
            ) : (
              <Clock className="h-5 w-5 text-muted-foreground" />
            )}
            Resposta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {response ? (
            <>
              <div className="flex gap-2 flex-wrap">
                <Badge className={getStatusColor(response.status)} variant="secondary">
                  Status: {response.status || 'Error'}
                </Badge>
                <Badge variant="outline" className="border-border/50">
                  <Clock className="mr-1 h-3 w-3" />
                  {response.time}ms
                </Badge>
              </div>

              {response.error && (
                <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4">
                  <p className="text-sm text-destructive font-medium">Erro:</p>
                  <p className="text-xs text-destructive/80 mt-1">{response.error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Response Data</label>
                <div className="bg-background/50 border border-border/50 rounded-lg p-4 max-h-[400px] overflow-auto">
                  <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-words">
                    {response.data ? (
                      typeof response.data === 'string' 
                        ? response.data 
                        : JSON.stringify(response.data, null, 2)
                    ) : (
                      'Sem dados na resposta'
                    )}
                  </pre>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-muted-foreground">
              <Send className="h-12 w-12 mb-4 opacity-20" />
              <p>Faça uma requisição para ver a resposta</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
