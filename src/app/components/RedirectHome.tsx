"use client";
import { useEffect } from "react";
let timeout: NodeJS.Timeout;
export const RedirectHome = () => {
  useEffect(() => {
    timeout = setTimeout(() => {
      history.back();
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);
  return <></>;
};
