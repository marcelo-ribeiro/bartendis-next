"use client";

import MegaphoneOutline from "@/app/assets/icon-megaphone-outline.svg";
import Image from "next/image";
import { generateOrder } from "../services/store";
import { Button } from "./Button";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function CallBartenderButton({
  searchParams,
  storeId,
}: {
  storeId: string;
  searchParams: {
    slot: string;
  };
}) {
  const { slot } = searchParams;

  const handleGenerateOrder = async () => {
    const order = {
      storeId,
      slot: slot!,
      product: `Chamando o garçom`,
    };
    console.log("order :", order);

    try {
      // lastOrderProduct.current = order;
      await generateOrder(order);
      // setShowSuccess(true);
      setTimeout(() => {
        // setShowSuccess(false);
      }, 4000);
    } catch {
      alert(
        "Ocorreu um erro ao gerar o seu pedido. Contate o suporte do estabelecimento."
      );
    }
  };

  return (
    <Button
      variant="accent"
      size="large"
      shape="square"
      style={{ width: "100%" }}
      onClick={handleGenerateOrder}
    >
      <div className="flex gap-2 items-center">
        <Image src={MegaphoneOutline} alt="icon" width={24} height={24} />
        <span className="uppercase">Chamar o garçom</span>
      </div>
    </Button>
  );
}
