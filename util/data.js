export const DUMMY_PROPERTIES = [
  {
    id: 1,
    title: "Emerald Lake Cabin",
    location: "Banff, Canada",
    category: "Mountain",
    pricePerNight: 210,
    rating: 4.9,
    guests: 6,
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80",
  },
  {
    id: 2,
    title: "Olive Grove Farmhouse",
    location: "Sidi Bou Said, Tunisia",
    category: "Farm",
    pricePerNight: 95,
    rating: 4.8,
    guests: 8,
    image:
      "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80",
  },
  {
    id: 3,
    title: "Riverside Camp Tent",
    location: "Siwa Oasis, Egypt",
    category: "Camping",
    pricePerNight: 45,
    rating: 4.7,
    guests: 2,
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
  },
  {
    id: 4,
    title: "Pinewood A-Frame",
    location: "Aspen, USA",
    category: "Cabin",
    pricePerNight: 180,
    rating: 4.9,
    guests: 4,
    image:
      "https://images.unsplash.com/photo-1518602164578-cd0074062767?w=800&q=80",
  },
  {
    id: 5,
    title: "Highland Vineyard Stay",
    location: "Tuscany, Italy",
    category: "Farm",
    pricePerNight: 150,
    rating: 4.6,
    guests: 5,
    image:
      "https://images.unsplash.com/photo-1499244571948-7ccddb3583f1?w=800&q=80",
  },
  {
    id: 6,
    title: "Desert Stargazer Camp",
    location: "Wadi Rum, Jordan",
    category: "Camping",
    pricePerNight: 70,
    rating: 5.0,
    guests: 3,
    image:
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
  },
];


export const CATEGORIES = ["All", "Farm", "Camping", "Mountain", "Cabin"];


// Dummy data — in the real app this would be fetched by params.slug
export const DUMMY_PROPERTY = {
  title: "Emerald Lake Cabin",
  location: "Banff, Canada",
  category: "Mountain",
  pricePerNight: 210,
  rating: 4.9,
  reviewCount: 128,
  guests: 6,
  bedrooms: 3,
  beds: 4,
  baths: 2,
  description:
    "A timber A-frame cabin tucked into the pines above Emerald Lake, built for slow mornings and long fireside evenings. Wake up to mist over the water, hike straight from the porch, and fall asleep to nothing but wind in the trees.",
  amenities: [
    "Wood-burning fireplace",
    "Lake access",
    "Free parking",
    "Full kitchen",
    "Hiking trails nearby",
    "Fire pit",
    "Wifi",
    "Pet friendly",
  ],
  host: {
    name: "Youssef",
    joined: "Hosting since 2021",
  },
  images: [
    "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&q=80",
    "https://images.unsplash.com/photo-1518602164578-cd0074062767?w=1200&q=80",
    "https://images.unsplash.com/photo-1475087542963-13ab5e611954?w=1200&q=80",
    "https://images.unsplash.com/photo-1501876725168-00c445821c9e?w=1200&q=80",
    "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200&q=80",
  ],
};


export const DUMMY_REVIEWS = [
  {
    id: 1,
    name: "Layla H.",
    date: "August 2025",
    rating: 5,
    comment:
      "Woke up to fog rolling over the pines every morning. The chimney and the quiet made it feel like a completely different world from the city.",
  },
  {
    id: 2,
    name: "Omar K.",
    date: "July 2025",
    rating: 5,
    comment:
      "Exactly what we needed — unplugged, peaceful, and the host left a great guide for nearby trails.",
  },
  {
    id: 3,
    name: "Sara M.",
    date: "June 2025",
    rating: 4,
    comment:
      "Beautiful spot, a bit of a drive from the main road but worth it. Would book again.",
  },
];


export const DUMMY_FORECAST = [
  { day: "Today", temp: 18, icon: "☀️" },
  { day: "Tue", temp: 16, icon: "⛅" },
  { day: "Wed", temp: 14, icon: "🌧️" },
  { day: "Thu", temp: 17, icon: "☀️" },
  { day: "Fri", temp: 19, icon: "☀️" },
];


export const CATEGORIESFilter = ["Farm", "Camping", "Mountain", "Cabin"];