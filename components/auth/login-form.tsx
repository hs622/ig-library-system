"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginSchema, type ILoginSchema } from "@/types/login.zod";

export default function LoginForm() {
  const router = useRouter();
  const [signInError, setSignInError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  async function onSubmit({ username, password }: ILoginSchema) {
    setSignInError("");
    try {
      const requestedCallbackUrl = new URLSearchParams(
        window.location.search,
      ).get("callbackUrl");
      const callbackUrl =
        requestedCallbackUrl?.startsWith("/") &&
        !requestedCallbackUrl.startsWith("//")
          ? requestedCallbackUrl
          : "/";
      const result = await signIn("credentials", {
        username,
        password,
        callbackUrl,
        redirect: false,
      });

      if (!result?.ok) {
        setSignInError(
          result?.error
            ? "Invalid username or password."
            : "Unable to sign in right now. Please try again.",
        );
        return;
      }

      router.replace(result.url ?? "/");
      router.refresh();
    } catch {
      setSignInError("Unable to sign in right now. Please try again.");
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your username and password to access the library system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="username">
              Username
            </label>
            <Input
              id="username"
              autoComplete="username"
              autoFocus
              aria-invalid={!!errors.username}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm text-destructive" role="alert">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                className="pr-10"
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-1/2 right-1 -translate-y-1/2"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-controls="password"
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>
          {signInError && (
            <p className="text-sm text-destructive" role="alert">
              {signInError}
            </p>
          )}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
