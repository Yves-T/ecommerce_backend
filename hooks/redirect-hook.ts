import { UseMutationResult } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export const useRedirectAfterMutation = <T, U>({
  mutation,
  navigateTo,
}: {
  mutation: UseMutationResult<T, Error, U, unknown>;
  navigateTo: string;
}) => {
  useEffect(() => {
    if (mutation.isSuccess && !!navigateTo) {
      redirect(navigateTo);
    }
  }, [mutation.isSuccess, navigateTo]);

  return mutation.mutateAsync;
};
