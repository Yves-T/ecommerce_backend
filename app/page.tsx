"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="w-screeen flex h-screen items-center justify-center">
        <Button>
          <Link href={"sign-in"}>Log in</Link>
        </Button>
      </div>
    );
  }

  return <div className="">logged in {session.user?.email}</div>;
}
