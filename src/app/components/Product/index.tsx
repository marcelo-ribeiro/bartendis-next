/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
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
  enableOrder?: boolean;
};

export const Product = ({
  product,
  searchParams,
  storeId,
  enableOrder,
}: ProductProps) => {
  const { slot } = searchParams;
  const [quantity, setQuantity] = useState(0);
  // const [presentAlert] = useIonAlert();

  const classCardImageBg = product.image ? "bg-white" : "bg-gray-50";

  const order = {
    storeId,
    slot: slot!,
    product: product.description
      ? `${product.name} - ${product.description}`
      : product.name,
    quantity,
  };

  // const handleGenerateOrder = async (order: any) => {
  //   try {
  //     await generateOrder(order);
  //     setTimeout(() => {}, 4000);
  //   } catch {
  //     alert(
  //       "Ocorreu um erro ao gerar o seu pedido. Contate o suporte do estabelecimento."
  //     );
  //   }
  // };

  const handleCounterChange = (value: number) => {
    console.log("value :", value);
    setQuantity(value);
  };

  const handleSetOrder = () => {
    if (quantity === 0) {
      alert("Escolha a quantidade para fazer o pedido.");
      return false;
    }
  };

  return (
    <article className="card overflow-hidden rounded-xl bg-white shadow-md">
      <div className={`card__image w-full aspect-video ${classCardImageBg}`}>
        {product.image && (
          <Image
            className="w-full h-full object-contain"
            alt={product.name}
            src={product.image}
            width={160}
            height={90}
          />
        )}
      </div>
      <header className="card__header py-3 px-3">
        <p className="card__subtitle text-xs font-medium leading-4 text-stone-600 uppercase mb-1">
          {Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(product.price)}
        </p>
        <h1 className="card__title min-h-8 text-sm leading-4 font-medium m-0">
          {product.name}
        </h1>
        <p className="card__subtitle min-h-8 mt-1 text-xs leading-4 text-stone-600">
          {product.description ?? <span>&nbsp;</span>}
        </p>
      </header>
      {/* <section className="card__content min-h-8 px-4 pb-3 text-xs leading-4 font-base"></section> */}
      {enableOrder && !!slot && (
        <footer className="grid gap-3 px-2 pb-2">
          <div className="mx-1">
            <QuantityCounter
              onCounterChange={handleCounterChange}
              counter={quantity}
            />
          </div>

          {quantity <= 0 ? (
            <Button variant="light" onClick={handleSetOrder}>
              Fazer pedido
            </Button>
          ) : (
            <Link
              href={`${location.origin}/${
                location.pathname
              }/success/?${new URLSearchParams(order as any).toString()}`}
              className="grid"
            >
              <Button variant="primary">Fazer pedido</Button>
            </Link>
          )}
        </footer>
      )}
    </article>
  );
};
