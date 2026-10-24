import React from "react";

export function PresidioSunsetScene({ className = "" }: { className?: string }) {
  return <div className={`temple-night-scene presidio-sunset${className ? ` ${className}` : ""}`} />;
}
