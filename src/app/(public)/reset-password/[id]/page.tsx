'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from 'sonner'
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordData, resetPasswordSchema } from "@/hooks/use-reset-password/schema";
import { useResetPassword } from "@/hooks/use-reset-password/use-reset-password";



const ResetPassword = () => {
    const router = useRouter()
    const {id} = useParams()
    const {isLoading , handleUploadPassword} = useResetPassword(    )
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);

  const form = useForm<resetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });


  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card shadow-lg rounded-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#006D77]">Clinitt<span className="text-[#83C5BE]">.ai</span></h1>
            <p className="text-muted-foreground mt-2 font-medium">Bem-vindo! Configure sua senha</p>
            <p className="text-sm text-muted-foreground mt-1">
              Para começar a usar o sistema, confirme seu e-mail e crie sua nova senha
            </p>
          </div>

          {isExistingUser ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Cadastro já realizado
                </h3>
                <p className="text-muted-foreground">
                  Você já realizou seu cadastro inicial. Redirecionando para o login...
                </p>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => handleUploadPassword(data, router , String(id)))} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirme seu e-mail</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Digite o e-mail usado na compra"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua nova senha"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar nova senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirme sua nova senha"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  <p className="font-medium mb-1">Sua senha deve conter:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Pelo menos 8 caracteres</li>
                    <li>Uma combinação segura de letras e números</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Configurando senha...</span>
                    </div>
                  ) : (
                    "Configurar senha e acessar sistema"
                  )}
                </Button>
              </form>
            </Form>
          )}
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Precisa de ajuda?{" "}
              <a href="mailto:suporte@clinitt.ai" className="text-[#006D77] hover:underline">
                Fale conosco
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
