"use client";
import React from "react";
import Image from "next/image";
import { clientDatabase } from "../../../lib/clientData";

const client = clientDatabase.distromike;

export default function DistroMikePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative w-full h-64 md:h-96">
        <Image src={client.backgroundImage} alt={client.name} fill className="object-cover opacity-60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 drop-shadow-lg">{client.name}</h1>
          <p className="text-lg md:text-2xl font-medium mb-4 drop-shadow">{client.category}</p>
          <p className="max-w-xl text-center text-base md:text-lg opacity-90">{client.description}</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">Featured Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {client.videos.length ? client.videos.map((video, i) => (
            <div key={i} className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
              <iframe
                src={video}
                title={`Distro Mike video ${i+1}`}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )) : <div className="col-span-full text-center text-gray-400">No videos available.</div>}
        </div>
      </div>
    </div>
  );
} 