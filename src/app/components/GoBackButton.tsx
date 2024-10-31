"use client";
import { Button } from "./Button";

export const GoBackButton = () => {
  return (
    <Button variant={`outline`} onClick={() => window.history.back()}>
      Fazer outro pedido
    </Button>
  );
};
