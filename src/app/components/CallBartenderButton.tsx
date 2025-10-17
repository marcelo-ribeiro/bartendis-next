"use client";

import MegaphoneOutline from "@/app/assets/icon-megaphone-outline.svg";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./Button";

export default function CallBartenderButton({
  onCallBartender,
}: {
  onCallBartender: () => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onCallBartender();
    } catch (error) {
      console.error("Error calling bartender:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      variant="accent"
      size="large"
      shape="square"
      expand="block"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      <div className="flex gap-2 items-center">
        <Image src={MegaphoneOutline} alt="icon" width={24} height={24} />
        <span className="uppercase">
          {isSubmitting ? "Chamando..." : "Chamar o garçom"}
        </span>
      </div>
    </Button>
  );
}
