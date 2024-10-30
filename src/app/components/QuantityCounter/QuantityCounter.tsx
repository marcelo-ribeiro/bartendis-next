"use client";
import { AddOutline, RemoveOutline } from "react-ionicons";
import { Button } from "../Button";

interface QuantityCounterProps {
  onCounterChange: (value: number) => void;
  counter?: number;
}

export const QuantityCounter = ({
  onCounterChange,
  counter = 0,
}: QuantityCounterProps) => {
  const increment = () => {
    onCounterChange(counter + 1);
  };

  const decrement = () => {
    onCounterChange(counter > 0 ? counter - 1 : 0);
  };

  return (
    <div className="grid grid-cols-3 gap-2 mx-2 rounded-md overflow-hidden">
      <Button small outline onClick={decrement}>
        <RemoveOutline />
      </Button>
      <div className="flex items-center justify-center text-center text-sm rounded-lg bg-stone-100 font-medium">
        {counter}
      </div>
      <Button small outline onClick={increment}>
        <AddOutline />
      </Button>
    </div>
  );
};
