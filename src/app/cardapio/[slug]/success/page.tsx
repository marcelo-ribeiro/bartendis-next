import { GoBackButton } from "@/app/components/GoBackButton";
import { LottieAnimation } from "@/app/components/LottieAnimation";
import { RedirectHome } from "@/app/components/RedirectHome";
import { generateOrder } from "@/app/services/store";

export default async function Success({
  searchParams,
}: {
  searchParams: {
    storeId: string;
    product: string;
    slot: string;
    quantity: string;
  };
}) {
  const { storeId, slot, product, quantity } = searchParams;
  let hasSuccess = false;

  try {
    await generateOrder({
      storeId,
      slot,
      product,
      quantity: Number(quantity),
      status: "Pendente"
    });
    hasSuccess = true;
  } catch {
    //
  }

  return (
    <div className="absolute inset-0 z-50 grid place-items-center place-content-center bg-white/90 transition-opacity duration-1000">
      <LottieAnimation />

      {hasSuccess && (
        <div className="text-black text-2xl font-bold text-center">
          <span color="success">Seu pedido foi realizado!</span>
          <br />
          {quantity ? quantity + "x" : ""}
          {product}
        </div>
      )}

      <div className="mt-12">
        <GoBackButton />
      </div>

      <RedirectHome />
    </div>
  );
}
