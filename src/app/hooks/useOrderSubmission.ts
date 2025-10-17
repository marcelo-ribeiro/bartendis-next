"use client";

import { useState } from "react";
import { generateOrder } from "../services/store";

export interface OrderData {
  storeId: string;
  slot: string;
  product: string;
  quantity: number;
}

export const useOrderSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitOrder = async (orderData: OrderData) => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    try {
      await generateOrder(orderData);
      setIsSuccess(true);
      setIsError(false);
    } catch (error) {
      console.error("Error submitting order:", error);
      setIsError(true);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setIsLoading(false);
    setIsError(false);
    setIsSuccess(false);
  };

  return {
    submitOrder,
    resetState,
    isLoading,
    isError,
    isSuccess,
  };
};
