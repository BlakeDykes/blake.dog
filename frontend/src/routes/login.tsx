import { type LoginInput } from "@/features/auth/auth.types";
import { useAuth } from "@/features/auth/providers/auth/context";
import { Button, Field, Form } from "@base-ui/react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
  useForm,
  type FieldErrors,
  type SubmitErrorHandler,
} from "react-hook-form";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
  beforeLoad: ({ context }) => {
    if (context.auth.isChecking) return;
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/admin" });
    }
  },
});

function LoginComponent() {
  const { login, error, status } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm<LoginInput>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    console.log("submitting", data);
    try {
      const res = await login(data);
      console.log("res", res);
      navigate({ to: "/admin" });
    } catch {}
  };

  const onError: SubmitErrorHandler<LoginInput> = async (
    data: FieldErrors<LoginInput>
  ) => {
    console.log(data);
  };

  if (status === "checking") {
    return null;
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      // errors={errors}
    >
      <Field.Root name="username">
        <Field.Label>username</Field.Label>
        <Field.Control required {...register("username")} />
        <Field.Error>{formState.errors.username?.message}</Field.Error>
      </Field.Root>
      <Field.Root name="password">
        <Field.Label>password</Field.Label>
        <Field.Control required {...register("password")} />
        <Field.Error>{formState.errors.password?.message}</Field.Error>
      </Field.Root>
      <Button type="submit" disabled={status === "authenticating"}>
        Login
      </Button>
      {error ? <span>{(error as Error).message}</span> : null}
    </Form>
  );
}
