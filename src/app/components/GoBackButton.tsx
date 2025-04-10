"use client";
import { useRouter } from "next/navigation";
import { Button } from "./Button";

export const GoBackButton = () => {
  const router = useRouter();

  return (
    <Button fill="outline" onClick={() => router.back()}>
      Fazer outro pedido
    </Button>
  );
};
