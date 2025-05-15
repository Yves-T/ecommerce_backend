"use server";
import { signIn } from "@/auth";

export const signInWithCredentials = async (params: {
  email: string;
  password: string;
}) => {
  const { email, password } = params;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error(error, "Signin error");
    return { success: false, error: "Signin error" };
  }
};
