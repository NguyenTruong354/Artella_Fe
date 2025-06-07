import { ArtworkItem } from "./types";

export const generateMoreArtworks = (
  startIndex: number,
  count: number
): ArtworkItem[] => {
  const additionalImages = [
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&h=600&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=700&fit=crop",
    "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=500&h=550&fit=crop",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&h=800&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=650&fit=crop",
    "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=500&h=750&fit=crop",
  ];

  const artists = [
    "Maya Chen",
    "Alex Thompson",
    "Sofia Rodriguez",
    "David Kim",
    "Emma Wilson",
    "Lucas Brown",
  ];
  const categories = [
    "Digital",
    "Abstract",
    "Cyberpunk",
    "Portrait",
    "Nature",
    "Geometric",
  ];
  const adjectives = [
    "Ethereal",
    "Vibrant",
    "Mysterious",
    "Luminous",
    "Cosmic",
    "Serene",
    "Dynamic",
    "Fluid",
  ];
  const nouns = [
    "Dreams",
    "Visions",
    "Reflections",
    "Echoes",
    "Whispers",
    "Shadows",
    "Lights",
    "Waves",
  ];

  return Array.from({ length: count }, (_, index) => {
    const id = startIndex + index;
    const adjective = adjectives[id % adjectives.length];
    const noun = nouns[id % nouns.length];
    const category = categories[id % categories.length];

    return {
      id: id,
      title: `${adjective} ${noun} ${id}`,
      artist: artists[id % artists.length],
      price: `${(1.5 + (id % 30) * 0.1).toFixed(1)} ETH`,
      image: additionalImages[id % additionalImages.length],
      category: category,
      likes: Math.floor(Math.random() * 200) + 50,
      views: Math.floor(Math.random() * 2000) + 500,
      isNew: Math.random() > 0.7,
      isFeatured: Math.random() > 0.8,
      description: `A stunning piece of ${category.toLowerCase()} art that captures the essence of ${adjective.toLowerCase()} beauty`,
      tags: [category.toLowerCase(), adjective.toLowerCase(), "digital art"],
    };
  });
};

export const mockArtworks: ArtworkItem[] = [
  {
    id: 1,
    title: "Cosmic Dreams",
    artist: "Elena Rodriguez",
    price: "3.2 ETH",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop",
    category: "Digital",
    likes: 124,
    views: 1520,
    isNew: true,
    isFeatured: true,
    description:
      "A mesmerizing journey through space and time, exploring the infinite possibilities of the cosmos",
    tags: ["space", "cosmic", "digital art"],
  },
  {
    id: 2,
    title: "Abstract Harmony",
    artist: "Marcus Chen",
    price: "2.8 ETH",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=700&fit=crop",
    category: "Abstract",
    likes: 89,
    views: 980,
    isNew: false,
    isFeatured: true,
    description: "Colors dancing in perfect harmony",
    tags: ["abstract", "colorful", "harmony"],
  },
  {
    id: 3,
    title: "Neon Cityscapes",
    artist: "Sarah Kim",
    price: "4.1 ETH",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=800&fit=crop",
    category: "Cyberpunk",
    likes: 156,
    views: 2340,
    isNew: true,
    isFeatured: false,
    description:
      "Urban dreams in electric colors, capturing the essence of modern metropolitan life",
    tags: ["cyberpunk", "neon", "city"],
  },
  {
    id: 4,
    title: "Ethereal Portrait",
    artist: "David Wilson",
    price: "1.9 ETH",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=650&fit=crop",
    category: "Portrait",
    likes: 67,
    views: 756,
    isNew: false,
    isFeatured: false,
    description:
      "Capturing the essence of human emotion through digital artistry",
    tags: ["portrait", "emotion", "human"],
  },
  {
    id: 5,
    title: "Digital Flora",
    artist: "Anna Petrov",
    price: "2.5 ETH",
    image:
      "https://images.unsplash.com/photo-1551913902-c92207136625?w=500&h=750&fit=crop",
    category: "Nature",
    likes: 203,
    views: 1890,
    isNew: true,
    isFeatured: true,
    description:
      "Nature reimagined through digital lens, blending organic forms with technological aesthetics",
    tags: ["nature", "flora", "digital"],
  },
  {
    id: 6,
    title: "Geometric Visions",
    artist: "James Park",
    price: "3.7 ETH",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=550&fit=crop",
    category: "Geometric",
    likes: 91,
    views: 1234,
    isNew: false,
    isFeatured: false,
    description: "Perfect mathematics in artistic form",
    tags: ["geometric", "mathematics", "precision"],
  },
  {
    id: 7,
    title: "Ocean Waves",
    artist: "Mia Thompson",
    price: "2.1 ETH",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&h=900&fit=crop",
    category: "Nature",
    likes: 134,
    views: 1456,
    isNew: true,
    isFeatured: false,
    description: "The eternal dance of ocean waves captured in digital form",
    tags: ["ocean", "waves", "nature"],
  },
  {
    id: 8,
    title: "Urban Reflections",
    artist: "Alex Rivera",
    price: "3.4 ETH",
    image:
      "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=500&h=600&fit=crop",
    category: "Abstract",
    likes: 78,
    views: 945,
    isNew: false,
    isFeatured: true,
    description: "City lights reflected in glass and steel",
    tags: ["urban", "reflection", "abstract"],
  },
];

export const categories = [
  "All",
  "Digital",
  "Abstract",
  "Cyberpunk",
  "Portrait",
  "Nature",
  "Geometric",
];
