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
    <div className="grid grid-cols-[2.5rem_auto_2.5rem] gap-1 rounded-md overflow-hidden">
      <Button
        style={{ padding: 0 }}
        size="small"
        fill="outline"
        shape="round"
        onClick={decrement}
      >
        <Image src={RemoveOutline} alt="adicionar" width={20} height={20} />
      </Button>
      <div className="flex items-center justify-center text-center text-sm rounded-lg bg-neutral-100 font-medium">
        {counter}
      </div>
      <Button
        style={{ padding: 0 }}
        size="small"
        fill="outline"
        shape="round"
        onClick={increment}
      >
        <Image src={AddOutline} alt="adicionar" width={20} height={20} />
      </Button>
    </div>
  );
};
