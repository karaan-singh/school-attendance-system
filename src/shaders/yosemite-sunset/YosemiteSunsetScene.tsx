import React from "react";

export function YosemiteSunsetScene({ className = "" }: { className?: string }) {
  return <div className={`temple-night-scene yosemite-sunset${className ? ` ${className}` : ""}`} />;
}
