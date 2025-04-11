"use client";

import MegaphoneOutline from "@/app/assets/icon-megaphone-outline.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./Button";

export default function CallBartenderButton({
  searchParams,
  storeId,
}: {
  storeId: string;
  searchParams: {
    slot: string;
  };
  props?: never;
}) {
  const pathname = usePathname();
  const { slot } = searchParams;

  const order = {
    storeId,
    slot: slot!,
    product: `Chamando o garçom`,
  };

  return (
    <Link
      className="grid"
      href={`${pathname}/success/?${new URLSearchParams(order).toString()}`}
    >
      <Button variant="accent" size="large" shape="square" expand="block">
        <div className="flex gap-2 items-center">
          <Image src={MegaphoneOutline} alt="icon" width={24} height={24} />
          <span className="uppercase">Chamar o garçom</span>
        </div>
      </Button>
    </Link>
  );
}
