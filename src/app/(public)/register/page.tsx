"use client";

import { RegisterForm } from "@/components/forms/register/register-form";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card shadow-lg rounded-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#006D77]">
              Clinitt<span className="text-[#83C5BE]">.ai</span>
            </h1>
            <p className="text-muted-foreground mt-2">Crie sua conta</p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Já possui uma conta?{" "}
              <a href="/login" className="text-primary hover:underline">
                Fazer login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
