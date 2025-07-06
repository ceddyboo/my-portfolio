"use client";

import React, { useEffect, useState } from "react";

export default function HomePage() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let current = 0;
    const end = 230;
    const increment = end / 100;

    const counter = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(counter);
        setCounter(end);
      } else {
        setCounter(Math.floor(current));
      }
    }, 20);

    return () => clearInterval(counter);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-6">CEDRIC GUERRERO</h1>
      <p className="text-2xl mb-4">
        {counter}M+ views generated
      </p>
      <div className="flex gap-4">
        <button className="px-6 py-3 bg-purple-600 rounded-xl">
          Contact Me
        </button>
        <button className="px-6 py-3 bg-white text-black rounded-xl">
          See My Work
        </button>
      </div>
    </div>
  );
} 