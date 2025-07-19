import { useEffect, useState } from "react";

export const Loader = ({
  size = 48,
  dotSize = 12,
  color = "bg-primary",
  orbitDuration = 2000
}) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCollapsed((prev) => !prev);
    }, orbitDuration / 2);

    return () => clearInterval(interval);
  }, [orbitDuration]);

  const radius = size / 2 - dotSize / 2;
  const angles = [0, 120, 240];

  return (
    <div
      className="relative animate-spin-slow"
      style={{
        width: size,
        height: size,
        animationDuration: `${orbitDuration * 2}ms` // slower spin for full cycle
      }}
    >
      {angles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = collapsed
          ? size / 2 - dotSize / 2
          : size / 2 + radius * Math.cos(rad) - dotSize / 2;
        const y = collapsed
          ? size / 2 - dotSize / 2
          : size / 2 + radius * Math.sin(rad) - dotSize / 2;

        return (
          <div
            key={i}
            className={`${color} rounded-full absolute`}
            style={{
              width: dotSize,
              height: dotSize,
              top: y,
              left: x,
              transition: `top ${orbitDuration / 2}ms ease-in-out, left ${orbitDuration / 2}ms ease-in-out`
            }}
          />
        );
      })}
    </div>
  );
};