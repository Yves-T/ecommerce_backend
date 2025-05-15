"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { signUpSchema, TSignUpSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

const RegisterPage = () => {
  const [userCreated, setuserCreated] = useState(false);
  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const { reset, setError } = form;

  const onSubmit = async (data: TSignUpSchema) => {
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    if (!response.ok) {
      alert("Submitting form failed!");
      return;
    }
    if (responseData.errors) {
      const errors = responseData.errors;
      if (errors.email) {
        setError("email", {
          type: "server",
          message: errors.email,
        });
      } else if (errors.password) {
        setError("password", {
          type: "server",
          message: errors.password,
        });
      } else if (errors.confirmPassword) {
        setError("confirmPassword", {
          type: "server",
          message: errors.confirmPassword,
        });
      } else {
        alert("Something went wrong!");
      }
    } else {
      setuserCreated(true);
      reset();
    }
  };

  return (
    <>
      <section className="mt-8">
        <h1 className="text-pizza-primary mb-4 text-center text-4xl">
          Register
        </h1>
        {userCreated && (
          <div className="mx-auto mb-4 max-w-xs text-teal-900" role="alert">
            <Alert>
              <ThumbsUp className="h-4 w-4" />
              <AlertTitle>Your account is created!</AlertTitle>
              <AlertDescription>
                <p>
                  Now you can{" "}
                  <Link className="underline" href={"/sign-in"}>
                    login &raquo;
                  </Link>
                </p>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </section>

      <section className="mx-auto block max-w-xs">
        {!userCreated && (
          <>
            <Form {...form}>
              <form className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <div className="mt-4 flex flex-col gap-3">
              <Separator />
              <Button
                disabled={form.formState.isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
              >
                Sign up
                {form.formState.isSubmitting && (
                  <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default RegisterPage;
