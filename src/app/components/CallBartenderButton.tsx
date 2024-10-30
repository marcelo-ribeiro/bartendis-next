"use client";

import { MegaphoneOutline } from "react-ionicons";
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
      slotName: slot!,
      productName: `Chamando o garçom`,
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
    <Button color="warning" onClick={handleGenerateOrder}>
      <div className="flex gap-2">
        <MegaphoneOutline />
        {/* <IonIcon slot="start" icon={megaphoneOutline} /> */}
        <span className="uppercase">Chamar o garçom</span>
      </div>
    </Button>
  );
}
