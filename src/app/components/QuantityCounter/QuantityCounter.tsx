import AddOutline from "@/app/assets/icon-add-outline.svg";
import RemoveOutline from "@/app/assets/icon-remove-outline.svg";
import Image from "next/image";
import { Button } from "../Button";

interface QuantityCounterProps {
  counter?: number;
  onCounterChange: (value: number) => void;
}

export const QuantityCounter = ({
  counter = 0,
  onCounterChange,
}: QuantityCounterProps) => {
  const increment = () => {
    onCounterChange(counter + 1);
  };
  const decrement = () => {
    onCounterChange(counter > 0 ? counter - 1 : 0);
  };
  return (
    <div className="grid grid-cols-[3rem_auto_3rem] gap-1 rounded-lg overflow-hidden border border-stone-300">
      <Button
        style={{ padding: 0 }}
        size="small"
        shape="round"
        onClick={decrement}
      >
        <Image
          className="opacity-80"
          src={RemoveOutline}
          alt="adicionar"
          width={20}
          height={20}
        />
      </Button>
      <div className="flex items-center justify-center text-center text-sm text-black/60 rounded-md font-medium">
        {counter}
      </div>
      <Button
        style={{ padding: 0 }}
        size="small"
        shape="round"
        onClick={increment}
      >
        <Image
          className="opacity-80"
          src={AddOutline}
          alt="adicionar"
          width={20}
          height={20}
        />
      </Button>
    </div>
  );
};
