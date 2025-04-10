"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const [quantity, setQuantity] = useState(0);
  const pathname = usePathname();

  const order = {
    storeId,
    slot: searchParams.slot,
    product: product.description
      ? `${product.name} - ${product.description}`
      : product.name,
    quantity: String(quantity),
  };
  const orderParams = new URLSearchParams(order).toString();
  const link = `${pathname}/success/?${orderParams}`;

  const handleSetOrder = () => {
    alert("Escolha a quantidade para fazer o pedido.");
  };

  return (
    <article className="card overflow-hidden rounded-xl bg-white shadow-md">
      <div
        className={`card__image w-full aspect-video ${
          product.image ? "bg-white" : "bg-gray-50"
        }`}
      >
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

      <header className="card__header pt-2 pb-3 px-3">
        <p className="card__subtitle text-xs font-medium leading-4 text-stone-500 uppercase">
          {Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(product.price)}
        </p>
        <h1 className="card__title min-h-8 mt-1 text-sm text-stone-700 leading-4 font-medium">
          {product.name}
        </h1>
        <p className="card__subtitle min-h-8 mt-1 text-xs leading-tight text-stone-600">
          {product.description ?? <span>&nbsp;</span>}
        </p>
      </header>

      {enableOrder && (
        <footer className="grid gap-3 px-2 pb-2">
          <div className="mx-1">
            <QuantityCounter onCounterChange={setQuantity} counter={quantity} />
          </div>

          {quantity <= 0 ? (
            <Button variant="primary" onClick={handleSetOrder}>
              Fazer pedido
            </Button>
          ) : (
            <Link href={link} className="grid">
              <Button variant="primary">Fazer pedido</Button>
            </Link>
          )}
        </footer>
      )}
    </article>
  );
};
