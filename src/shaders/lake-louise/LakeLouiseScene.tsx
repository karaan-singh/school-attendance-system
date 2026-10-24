import React from "react";

export function LakeLouiseScene({ className = "" }: { className?: string }) {
  return <div className={`temple-night-scene lake-louise${className ? ` ${className}` : ""}`} />;
}
