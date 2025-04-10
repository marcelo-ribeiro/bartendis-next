"use client";
import animationData from "@/app/assets/lotties/check.json";
import Lottie from "react-lottie";

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
