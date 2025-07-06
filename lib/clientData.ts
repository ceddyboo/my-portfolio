// Client data interface
export interface ClientData {
  name: string;
  subscribers: string;
  backgroundImage: string;
  videos: string[];
  thumbnails: string[];
  category: string;
  description?: string;
}

// Client database - in production, this would come from a CMS or API
export const clientDatabase: Record<string, ClientData> = {
  cole: {
    name: "Cole the Cornstar",
    subscribers: "12M",
    backgroundImage: "/images/cole-background.jpg",
    videos: [
      "https://www.youtube.com/embed/dQw4w9WgXcQ?start=30",
      "https://www.youtube.com/embed/abcd1234?start=45",
      "https://www.youtube.com/embed/efgh5678?start=60",
      "https://www.youtube.com/embed/ijkl9012?start=90",
      "https://www.youtube.com/embed/mnop3456?start=120",
      "https://www.youtube.com/embed/qrst7890?start=150",
      "https://www.youtube.com/embed/uvwx1234?start=180",
      "https://www.youtube.com/embed/yzab5678?start=210",
      "https://www.youtube.com/embed/cdef9012?start=240",
    ],
    thumbnails: [
      "/thumbnails/cole-1.jpg",
      "/thumbnails/cole-2.jpg",
      "/thumbnails/cole-3.jpg",
      "/thumbnails/cole-4.jpg",
      "/thumbnails/cole-5.jpg",
      "/thumbnails/cole-6.jpg",
      "/thumbnails/cole-7.jpg",
      "/thumbnails/cole-8.jpg",
      "/thumbnails/cole-9.jpg",
      "/thumbnails/cole-10.jpg",
      "/thumbnails/cole-11.jpg",
      "/thumbnails/cole-12.jpg",
      "/thumbnails/cole-13.jpg",
      "/thumbnails/cole-14.jpg",
      "/thumbnails/cole-15.jpg",
      "/thumbnails/cole-16.jpg",
    ],
    category: "Farming/Construction",
    description: "Revolutionary farming content that has captured millions of viewers worldwide."
  },
  
  mattyballz: {
    name: "MattyB",
    subscribers: "5.2M",
    backgroundImage: "/images/default-background.jpg",
    videos: [],
    thumbnails: [],
    category: "Music & Entertainment",
    description: "Popular music artist and content creator with millions of followers."
  },
  
  briannaplayz: {
    name: "Brianna Playz",
    subscribers: "3.8M",
    backgroundImage: "/images/default-background.jpg",
    videos: [],
    thumbnails: [],
    category: "Gaming Content",
    description: "Gaming content creator and streamer with a dedicated community."
  },
  
  distromike: {
    name: "Distro Mike",
    subscribers: "2.1M",
    backgroundImage: "/images/default-background.jpg",
    videos: [],
    thumbnails: [],
    category: "Tech Reviews",
    description: "Technology reviews and gadget analysis for tech enthusiasts."
  },
  
  ramoakh: {
    name: "Ramo Akh",
    subscribers: "1.5M",
    backgroundImage: "/images/default-background.jpg",
    videos: [],
    thumbnails: [],
    category: "Lifestyle & Vlogs",
    description: "Lifestyle content and daily vlogs from around the world."
  },
  
  lankybox: {
    name: "LankyBox",
    subscribers: "4.7M",
    backgroundImage: "/images/default-background.jpg",
    videos: [],
    thumbnails: [],
    category: "Gaming & Entertainment",
    description: "Gaming content and entertainment for a wide audience."
  },
  
  bloveslife: {
    name: "B. Loves Life",
    subscribers: "2.9M",
    backgroundImage: "/images/default-background.jpg",
    videos: [],
    thumbnails: [],
    category: "Lifestyle & Wellness",
    description: "Lifestyle content focused on wellness and personal development."
  },
  
  stoveskitchen: {
    name: "Stove's Kitchen",
    subscribers: "1.8M",
    backgroundImage: "/images/default-background.jpg",
    videos: [],
    thumbnails: [],
    category: "Cooking & Food",
    description: "Culinary content and cooking tutorials for food enthusiasts."
  }
};

// Function to get client data by slug
export const getClientData = (clientSlug: string): ClientData => {
  const normalized = clientSlug.toLowerCase();
  console.log('getClientData called with slug:', normalized);
  console.log('Available client keys:', Object.keys(clientDatabase));
  
  const clientData = clientDatabase[normalized];
  if (clientData) {
    console.log('Found client data for:', normalized, 'Name:', clientData.name);
    return clientData;
  } else {
    console.log('Client not found for slug:', normalized);
    return {
      name: "Unknown Client",
      subscribers: "0",
      backgroundImage: "/images/default-background.jpg",
      videos: [],
      thumbnails: [],
      category: "Unknown",
      description: "Client not found."
    };
  }
};

// Function to get all client slugs (useful for generating static paths)
export const getAllClientSlugs = (): string[] => {
  return Object.keys(clientDatabase);
};

// Function to get all client data (useful for listing pages)
export const getAllClients = (): ClientData[] => {
  return Object.values(clientDatabase);
}; 