"use client";

import React, { useState } from "react";
import { OrderSuccessModal } from "@/app/components/OrderSuccessModal";
import { Product } from "@/app/components/Product";
import { useOrderSubmission, OrderData } from "@/app/hooks/useOrderSubmission";
import CallBartenderButton from "@/app/components/CallBartenderButton";

interface CardapioClientProps {
  menu: Record<string, any[]>;
  storeId: string;
  searchParams: {
    slug: string;
    slot: string;
  };
  enableOrder: boolean;
}

export const CardapioClient = ({
  menu,
  storeId,
  searchParams,
  enableOrder,
}: CardapioClientProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");
  const { submitOrder, resetState, isLoading, isError, isSuccess } =
    useOrderSubmission();

  const handleOrderSubmit = async (orderData: OrderData) => {
    const message = `${orderData.quantity ? orderData.quantity + "x" : ""} ${
      orderData.product
    }`;
    setOrderMessage(message);
    setIsModalOpen(true);

    await submitOrder(orderData);
  };

  const handleCallBartender = async () => {
    const orderData: OrderData = {
      storeId,
      slot: searchParams.slot,
      product: "Chamando o garçom",
      quantity: 1,
    };

    setOrderMessage("Chamando o garçom");
    setIsModalOpen(true);

    await submitOrder(orderData);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetState();
    setOrderMessage("");
  };

  return (
    <>
      <section className="bg-gray-100 rounded-t-3xl">
        <section className="grid pt-4 pb-6">
          {!!menu &&
            Object.entries(menu)?.map(([categorieName, products], index) => {
              if (Array.isArray(products) && !products.length) {
                return <div key={index}></div>;
              }
              return (
                <div key={index} className="relative grid pt-4">
                  <div className="category px-6 text-xl font-semibold">
                    <span className="pl-1" color="dark">
                      {categorieName}
                    </span>
                  </div>

                  <div className="products scroll-horizontal grid grid-flow-col auto-cols-[10rem] gap-3 px-6 py-3 overflow-x-auto">
                    {Array.isArray(products) &&
                      products.map((product) => (
                        <div key={product.id}>
                          <Product
                            product={product}
                            searchParams={searchParams}
                            storeId={storeId!}
                            enableOrder={enableOrder}
                            onOrderSubmit={handleOrderSubmit}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
        </section>

        {enableOrder && (
          <aside className="sticky z-40 bottom-0 left-full right-1/2 w-[268px] rounded-tl-2xl overflow-hidden">
            <CallBartenderButton onCallBartender={handleCallBartender} />
          </aside>
        )}
      </section>

      <OrderSuccessModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isLoading={isLoading}
        isError={isError}
        message={orderMessage}
      />
    </>
  );
};
