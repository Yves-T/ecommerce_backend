import prisma from "@/lib/client";
import { signUpSchema } from "@/lib/schema";
import { genSaltSync, hashSync } from "bcryptjs";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const result = signUpSchema.safeParse(body);
  let zodErrors = {};
  result.error?.issues.forEach((issue) => {
    zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
  });
  if (result) {
    const { email, password } = signUpSchema.parse(body);

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const createdUser = await prisma.user.create({
      data: { password: hashedPassword, email, admin: false },
    });

    return Response.json(createdUser);
  } else {
    return Response.json({ errors: zodErrors }, { status: 400 });
  }
}
