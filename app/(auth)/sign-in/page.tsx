"use client";

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
import { signInWithCredentials } from "@/lib/actions/auth";
import { loginSchema, TLoginSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const LoginPage = () => {
  const router = useRouter();
  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: TLoginSchema) => {
    const result = await signInWithCredentials(data);

    if (result.success) {
      toast("Success", {
        description: "You have successfully signed in",
        classNames: {
          description: "!text-dark-600",
        },
      });
      await getSession();
      router.push("/");
    } else {
      toast.error("Error siging in", {
        description: result.error ?? "An error occured",
        classNames: {
          description: "!text-dark-600",
        },
      });
    }
  };

  return (
    <>
      <section className="mt-8">
        <h1 className="text-pizza-primary mb-4 text-center text-4xl">Login</h1>
      </section>

      <section className="mx-auto block max-w-xs">
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
                        {...field}
                        type="password"
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
              Log in
              {form.formState.isSubmitting && (
                <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        </>
      </section>
    </>
  );
};

export default LoginPage;
