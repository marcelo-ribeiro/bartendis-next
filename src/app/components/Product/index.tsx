/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { generateOrder } from "@/app/services/store";
import Image from "next/image";
import { useState } from "react";
import { TProduct } from "../../hooks/useStore";
import { Button } from "../Button";
import { QuantityCounter } from "../QuantityCounter/QuantityCounter";

type ProductProps = {
  product: TProduct;
  storeId: string;
  searchParams: {
    slot: string;
    slug: string;
  };
};

export const Product = ({ product, searchParams, storeId }: ProductProps) => {
  const { slot } = searchParams;
  const [quantity, setQuantity] = useState(0);
  // const [presentAlert] = useIonAlert();

  const handleGenerateOrder = async (order: any) => {
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

  const handleCounterChange = (value: number) => {
    console.log("value :", value);
    setQuantity(value);
  };

  const handleSetOrder = () => {
    if (quantity === 0) {
      alert("Escolha a quantidade para fazer o pedido.");
      return;
    }
    handleGenerateOrder({
      storeId,
      slotName: slot!,
      productName: `${product.name} - ${product.description}`,
      quantity,
    });
    setQuantity(0);
  };

  return (
    <article className="card overflow-hidden rounded-xl bg-white shadow-md">
      <div
        className={`card__image w-full aspect-video relative ${
          product.image ? "#fff" : "bg-slate-50"
        }`}
      >
        {product.image && (
          <Image
            className="w-full h-full object-contain"
            alt={product.name}
            src={product.image}
            fill={true}
          />
        )}
      </div>
      <header className="card__header pt-3 px-4">
        <h1 className="card__title min-h-8 text-sm leading-4 font-semibold m-0">
          {product.name}
        </h1>
        <p className="card__subtitle min-h-8 mt-1 text-xs leading-4 text-stone-600">
          {product.description ?? <span>&nbsp;</span>}
        </p>
        <p className="card__subtitle text-xs font-medium leading-4 mt-2 text-stone-600 uppercase">
          {Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(product.price)}
        </p>
      </header>
      {/* <section className="card__content min-h-8 px-4 pb-3 text-xs leading-4 font-base"></section> */}
      {!!slot && (
        <footer className="grid gap-3 mt-3 px-2 pb-2">
          <QuantityCounter
            onCounterChange={handleCounterChange}
            counter={quantity}
          />
          <Button primary onClick={handleSetOrder}>
            Fazer pedido
          </Button>
        </footer>
      )}
    </article>
  );
};
