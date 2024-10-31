"use client";
import animationData from "@/app/assets/lotties/check.json";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
export const LottieAnimation = () => {
  return <Lottie options={defaultOptions} width={340} height={340} />;
};
