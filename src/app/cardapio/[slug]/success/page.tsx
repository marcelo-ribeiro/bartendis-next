// "use client";

import animationData from "@/app/assets/lotties/check.json";
import { Button } from "@/app/components/Button";
import { generateOrder } from "@/app/services/store";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default async function Success({
  searchParams,
}: {
  searchParams: {
    storeId: string;
    productName: string;
    slotName: string;
    quantity: string;
  };
}) {
  const { storeId, slotName, productName, quantity } = searchParams;
  let hasSuccess = false;

  try {
    await generateOrder({
      storeId,
      slotName,
      productName,
      quantity: Number(quantity),
    });
    hasSuccess = true;
  } catch {
    //
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center place-content-center bg-white/90 transition-opacity duration-1000">
      {/* <Lottie options={defaultOptions} width={340} height={340} /> */}

      {hasSuccess && (
        <div className="text-black text-2xl font-bold text-center">
          <span color="success">Seu pedido foi realizado!</span>
          <br />
          {quantity ? quantity + "x " : ""}
          {productName}
        </div>
      )}

      <div className="mt-12">
        <Button
          variant={`outline`}
          // onClick={() => {
          //   history.back();
          // }}
        >
          Fazer outro pedido
        </Button>
      </div>
    </div>
  );
}
