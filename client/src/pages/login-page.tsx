import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Lock } from "lucide-react";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      
      <Card className="w-full max-w-md glass-panel border-white/10 relative z-10 shadow-2xl shadow-primary/10">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 mb-2">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-display font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            CryptoMind
          </CardTitle>
          <CardDescription className="text-base">
            Advanced AI-driven market analytics and predictive engine.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2 text-center text-sm text-muted-foreground bg-white/5 p-4 rounded-lg border border-white/5">
            <p>Welcome to the Platform</p>
            <p className="text-xs opacity-70">Access requires authentication.</p>
          </div>

          <Button 
            className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
            onClick={handleLogin}
          >
            <Lock className="mr-2 h-4 w-4" />
            Login with Replit
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            By logging in, you agree to our Terms of Service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
