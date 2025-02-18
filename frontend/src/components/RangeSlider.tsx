import React, { useEffect, useRef } from "react";

interface RangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  id: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  id,
}) => {
  const rangeRef = useRef<HTMLInputElement>(null);

  // Update background size to show filled track
  useEffect(() => {
    if (rangeRef.current) {
      const percentage = ((value - min) / (max - min)) * 100;
      rangeRef.current.style.setProperty("--range-progress", `${percentage}%`);
    }
  }, [value, min, max]);

  return (
    <input
      ref={rangeRef}
      type="range"
      id={id}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
    />
  );
};
