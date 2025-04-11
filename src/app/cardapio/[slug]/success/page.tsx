import { GoBackButton } from "@/app/components/GoBackButton";
import { LottieAnimation } from "@/app/components/LottieAnimation";
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
  let error = false;
  const message = `${quantity ? quantity + "x" : ""} ${product}`;

  try {
    await generateOrder({
      storeId,
      slot,
      product,
      quantity: Number(quantity),
    });
  } catch {
    error = true;
  }

  return (
    <section className="sticky min-h-screen inset-0 z-50 grid place-items-center place-content-center px-6 pb-12 bg-white/90 transition-opacity duration-1000">
      {error ? (
        <div className="text-black text-2xl font-bold text-center">
          <h1 className="text-red-600">Seu pedido não foi realizado!</h1>
          {message}
        </div>
      ) : (
        <>
          <LottieAnimation />
          <div className="text-black text-2xl font-bold text-center">
            <h1 className="text-green-600">Seu pedido foi realizado!</h1>
            {message}
          </div>
        </>
      )}

      <div className="mt-12">
        <GoBackButton />
      </div>
    </section>
  );
}
