import { LoginForm } from "@/features/auth/ui/login-form";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold tracking-tight">satuwaktu</h1>
          <p className="text-sm text-muted-foreground">
            Masuk untuk melanjutkan.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
