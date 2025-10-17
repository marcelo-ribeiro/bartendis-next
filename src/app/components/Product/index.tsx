"use client";

import Image from "next/image";
import { useState } from "react";
import { TProduct } from "../../hooks/useStore";
import { OrderData } from "../../hooks/useOrderSubmission";
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
  onOrderSubmit?: (orderData: OrderData) => Promise<void>;
};

export const Product = ({
  product,
  searchParams,
  storeId,
  enableOrder,
  onOrderSubmit,
}: ProductProps) => {
  const [quantity, setQuantity] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSetOrder = () => {
    alert("Escolha a quantidade para fazer o pedido.");
  };

  const handleSubmitOrder = async () => {
    if (!onOrderSubmit || quantity <= 0) return;

    setIsSubmitting(true);

    const orderData: OrderData = {
      storeId,
      slot: searchParams.slot,
      product: product.description
        ? `${product.name} - ${product.description}`
        : product.name,
      quantity,
    };

    try {
      await onOrderSubmit(orderData);
      setQuantity(0); // Reset quantity after successful order
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="card overflow-hidden rounded-xl bg-white shadow-md">
      <figure
        className={`card__image w-full aspect-video px-2 pt-2 ${
          product.image ? "bg-white" : "bg-gray-50"
        }`}
      >
        {product.image && (
          <Image
            className="w-full h-full object-contain rounded-lg bg-gray-50"
            alt={product.name}
            src={product.image}
            width={160}
            height={90}
          />
        )}
      </figure>

      <header className="card__header grid gap-1 pt-2 pb-3 px-3">
        <p className="card__subtitle text-xs font-medium leading-tight text-stone-400 uppercase">
          {Intl.NumberFormat("pt-br", {
            style: "currency",
            currency: "BRL",
          }).format(product.price)}
        </p>
        <h1 className="card__title max-h-12 overflow-hidden text-sm text-stone-700 leading-4 font-medium">
          {product.name}
        </h1>
        {!!product.description && (
          <p className="card__subtitle max-h-12 overflow-hidden text-xs leading-tight text-stone-600">
            {product.description}
          </p>
        )}
      </header>

      {enableOrder && (
        <footer className="grid gap-2 px-2 pb-2">
          <div>
            <QuantityCounter onCounterChange={setQuantity} counter={quantity} />
          </div>

          {quantity <= 0 ? (
            <Button variant="primary" onClick={handleSetOrder}>
              Fazer pedido
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Fazer pedido"}
            </Button>
          )}
        </footer>
      )}
    </article>
  );
};
