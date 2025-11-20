"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type HeroImage = {
  src: string;
  alt: string;
};

type HeroImageSliderProps = {
  images: HeroImage[];
};

export function HeroImageSlider({ images }: HeroImageSliderProps) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentImage((prev) => (prev + 1) % images.length),
      4500,
    );

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl">
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 100vw, 480px"
          className={`object-cover transition-all duration-700 ${
            index === currentImage ? "opacity-100" : "translate-x-4 opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
