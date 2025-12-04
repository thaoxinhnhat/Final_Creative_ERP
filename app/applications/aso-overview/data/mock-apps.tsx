export interface App {
  id: string
  name: string
  bundleId?: string
  developer?: string
  iconUrl?: string
  platform: "ios" | "android" | "both"
  genre?: string
  rating?: number
  downloads30d?: string
  revenue30d?: string
}

export const mockApps: App[] = [
  {
    id: "1",
    name: "Fashion Show: Makeup, Dress Up",
    bundleId: "com.ngocpham.fashionshow",
    developer: "Ngoc Pham Thi",
    platform: "both",
    genre: "Games • Casual",
    rating: 4.6,
    downloads30d: "4M",
    revenue30d: "$7K",
  },
  {
    id: "2",
    name: "Tile Match: Triple Puzzle Game",
    bundleId: "com.linkdesks.tilematch",
    developer: "LinkDesks LLC",
    platform: "both",
    genre: "Games • Casual, Puzzle",
    rating: 4.7,
    downloads30d: "2M",
    revenue30d: "$20K",
  },
  {
    id: "3",
    name: "Puzzle Game Pro",
    bundleId: "com.puzzlestudios.puzzlepro",
    developer: "Puzzle Studios Inc.",
    platform: "android",
    genre: "Games • Puzzle",
    rating: 4.5,
    downloads30d: "50K",
    revenue30d: "$8K",
  },
  {
    id: "4",
    name: "Word Master: Brain Training",
    bundleId: "com.wordmaster.app",
    developer: "Brain Games Co.",
    platform: "ios",
    genre: "Games • Word, Educational",
    rating: 4.8,
    downloads30d: "1.5M",
    revenue30d: "$15K",
  },
  {
    id: "5",
    name: "Color Match Mania",
    bundleId: "com.colormatch.mania",
    developer: "Casual Games Studio",
    platform: "both",
    genre: "Games • Casual, Puzzle",
    rating: 4.4,
    downloads30d: "800K",
    revenue30d: "$5K",
  },
  {
    id: "6",
    name: "Math Genius Challenge",
    bundleId: "com.mathgenius.challenge",
    developer: "Educational Apps Ltd",
    platform: "both",
    genre: "Education • Math, Kids",
    rating: 4.9,
    downloads30d: "300K",
    revenue30d: "$12K",
  },
  {
    id: "7",
    name: "Cooking Mama Deluxe",
    bundleId: "com.cooking.mamadeluxe",
    developer: "Kitchen Games Inc.",
    platform: "ios",
    genre: "Games • Simulation, Casual",
    rating: 4.7,
    downloads30d: "2.5M",
    revenue30d: "$25K",
  },
  {
    id: "8",
    name: "Fitness Tracker Pro",
    bundleId: "com.fitness.trackerpro",
    developer: "Health Apps Co.",
    platform: "both",
    genre: "Health & Fitness • Tracking",
    rating: 4.6,
    downloads30d: "1M",
    revenue30d: "$18K",
  },
  {
    id: "9",
    name: "Photo Editor Master",
    bundleId: "com.photoeditor.master",
    developer: "Creative Tools LLC",
    platform: "android",
    genre: "Photography • Photo Editing",
    rating: 4.5,
    downloads30d: "3M",
    revenue30d: "$22K",
  },
  {
    id: "10",
    name: "Music Stream Plus",
    bundleId: "com.musicstream.plus",
    developer: "Audio Apps Inc.",
    platform: "both",
    genre: "Music & Audio • Streaming",
    rating: 4.8,
    downloads30d: "5M",
    revenue30d: "$35K",
  },
]
