export const PROJECTS_DATA = [
  {
    id: "1",
    appName: "Meditation Pro",
    icon: "/meditation-app-icon.png",
    os: "iOS",
    market: "US",
    region: "North America",
    category: "App",
    progress: 50, // Giảm xuống 50% vì chỉ Metadata đã push (test vấn đề 1/)
    lead: { name: "Nguyen Van A", avatar: "/male-avatar.png", email: "nguyenvana@example.com" },
    status: "Draft",
    deadline: "2025-01-10",
    urgent: false,
    optimizationScope: "Both", // Test push độc lập
    metadataPublished: true, // Metadata đã push
    storekitPublished: false, // StoreKit chưa push
    campaignId: "Winter-2025", // Thêm campaign ID (test vấn đề 5/)
    description:
      "A comprehensive meditation and mindfulness app designed to help users reduce stress, improve focus, and achieve better mental well-being through guided sessions.",
    keywords: [
      "meditation",
      "mindfulness",
      "stress relief",
      "mental health",
      "breathing exercises",
      "sleep sounds",
      "relaxation",
      "yoga",
      "calm",
      "wellness",
    ],
    team: [
      { name: "Nguyen Van A", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Tran Thi B", avatar: "/female-avatar.png", role: "ASO" },
    ],
  },
  {
    id: "2",
    appName: "Sleep Sounds",
    icon: "/sleep-sounds-app-icon.jpg",
    os: "Android",
    market: "UK",
    region: "Europe",
    category: "App",
    progress: 100, // 100% vì chỉ có scope Metadata và đã push
    lead: { name: "Tran Thi B", avatar: "/female-avatar.png", email: "tranthib@example.com" },
    status: "Published", // Test trạng thái published
    deadline: "2025-01-05",
    urgent: false,
    optimizationScope: "Metadata", // Chỉ metadata
    metadataPublished: true,
    storekitPublished: false,
    campaignId: "UK-Sleep-Q1", // Campaign ID
    description:
      "Soothing sleep sounds and white noise generator to help users fall asleep faster and enjoy deeper, more restful sleep throughout the night.",
    keywords: [
      "sleep sounds",
      "white noise",
      "sleep aid",
      "insomnia relief",
      "relaxation sounds",
      "bedtime",
      "sleep better",
      "peaceful sleep",
      "ambient sounds",
      "sleep therapy",
    ],
    team: [
      { name: "Tran Thi B", avatar: "/female-avatar.png", role: "Lead" },
      { name: "Le Van C", avatar: "/male-avatar.png", role: "Designer" },
    ],
  },
  {
    id: "3",
    appName: "Calm Mind",
    icon: "/calm-mind-app-icon.jpg",
    os: "iOS",
    market: "VN",
    region: "Southeast Asia",
    category: "App",
    progress: 100, // 100% vì chỉ StoreKit và đã push
    lead: { name: "Le Van C", avatar: "/male-avatar.png", email: "levanc@example.com" },
    status: "Published",
    deadline: "2024-12-28",
    urgent: true,
    optimizationScope: "StoreKit", // Chỉ StoreKit
    metadataPublished: false,
    storekitPublished: true,
    campaignId: "VN-Mental-Health", // Campaign ID
    description:
      "Mental wellness platform offering cognitive behavioral therapy exercises, mood tracking, and personalized coping strategies for anxiety and depression.",
    keywords: [
      "mental health",
      "anxiety relief",
      "mood tracker",
      "CBT therapy",
      "depression help",
      "emotional wellness",
      "self-care",
      "mindfulness",
      "mental fitness",
      "therapy app",
    ],
    team: [
      { name: "Le Van C", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Nguyen Van A", avatar: "/male-avatar.png", role: "Dev" },
    ],
  },
  {
    id: "4",
    appName: "Focus Timer - Pomodoro",
    icon: "/focus-timer-pomodoro-icon.jpg",
    os: "Android",
    market: "US",
    region: "North America",
    category: "App",
    progress: 100, // 100% cả 2 đã push
    lead: { name: "Pham Thi D", avatar: "/female-avatar.png", email: "phamthid@example.com" },
    status: "Published",
    deadline: "2024-12-25",
    urgent: true,
    optimizationScope: "Both", // Cả 2 đã push hoàn toàn
    metadataPublished: true,
    storekitPublished: true,
    campaignId: "Spring-2025", // Campaign ID
    description:
      "Productivity timer using the Pomodoro Technique to help users maintain focus, manage time effectively, and boost work efficiency with structured breaks.",
    keywords: [
      "pomodoro timer",
      "productivity",
      "focus timer",
      "time management",
      "work efficiency",
      "study timer",
      "concentration",
      "task management",
      "break reminder",
      "workflow",
    ],
    team: [
      { name: "Pham Thi D", avatar: "/female-avatar.png", role: "Lead" },
      { name: "Tran Thi B", avatar: "/female-avatar.png", role: "ASO" },
    ],
  },
  {
    id: "5",
    appName: "Yoga Daily",
    icon: "/yoga-daily-app-icon.jpg",
    os: "iOS",
    market: "UK",
    region: "Europe",
    category: "App",
    progress: 90,
    lead: { name: "Hoang Van E", avatar: "/male-avatar.png", email: "hoangvane@example.com" },
    status: "Waiting for Assets",
    deadline: "2025-01-15",
    urgent: false,
    optimizationScope: "Metadata", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Daily yoga practice app with video tutorials, pose guidance, and personalized routines for all skill levels from beginners to advanced practitioners.",
    keywords: [
      "yoga",
      "daily yoga",
      "yoga poses",
      "fitness",
      "flexibility",
      "workout",
      "exercise",
      "wellness",
      "yoga tutorial",
      "home workout",
    ],
    team: [
      { name: "Hoang Van E", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Le Van C", avatar: "/male-avatar.png", role: "Designer" },
    ],
  },
  {
    id: "6",
    appName: "Fitness Tracker Pro",
    icon: "/fitness-tracker-app-icon.jpg",
    os: "Android",
    market: "VN",
    region: "Southeast Asia",
    category: "App",
    progress: 40,
    lead: { name: "Vu Thi F", avatar: "/female-avatar.png", email: "vuthif@example.com" },
    status: "Waiting for Assets",
    deadline: "2024-12-30",
    urgent: true,
    optimizationScope: "StoreKit", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Comprehensive fitness tracking app that monitors workouts, calories, steps, and progress towards health goals with detailed analytics and insights.",
    keywords: [
      "fitness tracker",
      "workout log",
      "calorie counter",
      "step counter",
      "health tracker",
      "exercise tracker",
      "gym tracker",
      "fitness goals",
      "activity monitor",
      "weight loss",
    ],
    team: [
      { name: "Vu Thi F", avatar: "/female-avatar.png", role: "Lead" },
      { name: "Pham Thi D", avatar: "/female-avatar.png", role: "Marketing" },
    ],
  },
  {
    id: "7",
    appName: "Running Coach",
    icon: "/running-coach-app-icon.jpg",
    os: "iOS",
    market: "US",
    region: "North America",
    category: "App",
    progress: 65,
    lead: { name: "Do Van G", avatar: "/male-avatar.png", email: "dovang@example.com" },
    status: "Under Review",
    deadline: "2025-01-20",
    urgent: false,
    optimizationScope: "Metadata", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "AI-powered running coach providing personalized training plans, real-time feedback, and performance analytics to help runners achieve their goals.",
    keywords: [
      "running",
      "running coach",
      "training plan",
      "running tracker",
      "marathon",
      "cardio",
      "fitness",
      "run tracker",
      "jogging",
      "endurance",
    ],
    team: [
      { name: "Do Van G", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Vu Thi F", avatar: "/female-avatar.png", role: "ASO" },
    ],
  },
  {
    id: "8",
    appName: "Water Reminder",
    icon: "/water-reminder-app-icon.jpg",
    os: "Android",
    market: "UK",
    region: "Europe",
    category: "App",
    progress: 55,
    lead: { name: "Bui Thi H", avatar: "/female-avatar.png", email: "buithih@example.com" },
    status: "Under Review",
    deadline: "2024-12-27",
    urgent: true,
    optimizationScope: "StoreKit", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Smart hydration reminder app that helps users maintain optimal water intake throughout the day with customizable schedules and tracking.",
    keywords: [
      "water reminder",
      "hydration tracker",
      "drink water",
      "health tracker",
      "water intake",
      "daily water",
      "hydration app",
      "water tracker",
      "drink reminder",
      "wellness",
    ],
    team: [
      { name: "Bui Thi H", avatar: "/female-avatar.png", role: "Lead" },
      { name: "Do Van G", avatar: "/male-avatar.png", role: "Dev" },
    ],
  },
  {
    id: "9",
    appName: "Meal Planner",
    icon: "/meal-planner-healthy-food-app.jpg",
    os: "iOS",
    market: "VN",
    region: "Southeast Asia",
    category: "App",
    progress: 80,
    lead: { name: "Ngo Van I", avatar: "/male-avatar.png", email: "ngovani@example.com" },
    status: "Pending Approval",
    deadline: "2025-01-08",
    urgent: false,
    optimizationScope: "Both", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Weekly meal planning app with healthy recipes, shopping lists, and nutritional information to help users eat better and save time.",
    keywords: [
      "meal planner",
      "meal prep",
      "recipe app",
      "healthy eating",
      "nutrition",
      "diet planner",
      "cooking",
      "food planner",
      "grocery list",
      "weekly meals",
    ],
    team: [
      { name: "Ngo Van I", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Bui Thi H", avatar: "/female-avatar.png", role: "ASO" },
    ],
  },
  {
    id: "10",
    appName: "Habit Tracker",
    icon: "/habit-tracker-goal-achievement-app.jpg",
    os: "Android",
    market: "US",
    region: "North America",
    category: "App",
    progress: 70,
    lead: { name: "Duong Thi K", avatar: "/female-avatar.png", email: "duongthik@example.com" },
    status: "Pending Approval",
    deadline: "2024-12-29",
    urgent: true,
    optimizationScope: "Metadata", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Build better habits and break bad ones with this intuitive habit tracking app featuring streaks, reminders, and progress visualization.",
    keywords: [
      "habit tracker",
      "daily habits",
      "goal tracker",
      "productivity",
      "self improvement",
      "routine builder",
      "habit builder",
      "streak counter",
      "motivation",
      "personal growth",
    ],
    team: [
      { name: "Duong Thi K", avatar: "/female-avatar.png", role: "Lead" },
      { name: "Ngo Van I", avatar: "/male-avatar.png", role: "Designer" },
    ],
  },
  {
    id: "11",
    appName: "Budget Manager",
    icon: "/budget-manager-finance-money-app.jpg",
    os: "iOS",
    market: "UK",
    region: "Europe",
    category: "App",
    progress: 45,
    lead: { name: "Tran Van L", avatar: "/male-avatar.png", email: "tranvanl@example.com" },
    status: "Need Revision",
    deadline: "2025-01-12",
    urgent: false,
    optimizationScope: "StoreKit", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Personal finance manager to track expenses, create budgets, and achieve financial goals with detailed reports and insights.",
    keywords: [
      "budget app",
      "expense tracker",
      "finance manager",
      "money manager",
      "spending tracker",
      "personal finance",
      "budgeting",
      "financial planning",
      "money tracker",
      "savings",
    ],
    team: [
      { name: "Tran Van L", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Duong Thi K", avatar: "/female-avatar.png", role: "ASO" },
    ],
  },
  {
    id: "12",
    appName: "Language Learning",
    icon: "/language-learning-education-app.jpg",
    os: "Android",
    market: "VN",
    region: "Southeast Asia",
    category: "App",
    progress: 35,
    lead: { name: "Le Thi M", avatar: "/female-avatar.png", email: "lethim@example.com" },
    status: "Need Revision",
    deadline: "2024-12-26",
    urgent: true,
    optimizationScope: "Both", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Interactive language learning platform with gamified lessons, speaking practice, and vocabulary building for multiple languages.",
    keywords: [
      "language learning",
      "learn english",
      "vocabulary",
      "language app",
      "speaking practice",
      "grammar",
      "language lessons",
      "study app",
      "translation",
      "language course",
    ],
    team: [
      { name: "Le Thi M", avatar: "/female-avatar.png", role: "Lead" },
      { name: "Tran Van L", avatar: "/male-avatar.png", role: "Dev" },
    ],
  },
  {
    id: "13",
    appName: "Task Master",
    icon: "/task-master-productivity-todo-app.jpg",
    os: "iOS",
    market: "US",
    region: "North America",
    category: "App",
    progress: 92,
    lead: { name: "Phan Van N", avatar: "/male-avatar.png", email: "phanvann@example.com" },
    status: "Rejected",
    deadline: "2025-01-18",
    urgent: false,
    optimizationScope: "Metadata", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Advanced task management app with project organization, collaboration features, and deadline tracking for teams and individuals.",
    keywords: [
      "task manager",
      "todo list",
      "productivity app",
      "project manager",
      "task organizer",
      "checklist",
      "work management",
      "task planner",
      "to do",
      "task tracking",
    ],
    team: [
      { name: "Phan Van N", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Le Thi M", avatar: "/female-avatar.png", role: "ASO" },
    ],
  },
  {
    id: "14",
    appName: "Note Taking Pro",
    icon: "/note-taking-productivity-notepad-app.jpg",
    os: "Android",
    market: "UK",
    region: "Europe",
    category: "App",
    progress: 88,
    lead: { name: "Vo Thi O", avatar: "/female-avatar.png", email: "vothio@example.com" },
    status: "Rejected",
    deadline: "2024-12-31",
    urgent: true,
    optimizationScope: "StoreKit", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Feature-rich note-taking app with rich text editing, organization folders, cloud sync, and powerful search capabilities.",
    keywords: [
      "notes app",
      "note taking",
      "notepad",
      "memo",
      "writing app",
      "text editor",
      "note organizer",
      "digital notes",
      "note keeper",
      "productivity",
    ],
    team: [
      { name: "Vo Thi O", avatar: "/female-avatar.png", role: "Lead" },
      { name: "Phan Van N", avatar: "/male-avatar.png", role: "Marketing" },
    ],
  },
  {
    id: "15",
    appName: "Password Vault",
    icon: "/password-manager-vault-security-app.jpg",
    os: "iOS",
    market: "VN",
    region: "Southeast Asia",
    category: "App",
    progress: 95,
    lead: { name: "Nguyen Van P", avatar: "/male-avatar.png", email: "nguyenvanp@example.com" },
    status: "Approved",
    deadline: "2025-01-25",
    urgent: false,
    optimizationScope: "Both", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Secure password manager with military-grade encryption to store and autofill passwords, credit cards, and sensitive information.",
    keywords: [
      "password manager",
      "password vault",
      "security",
      "password keeper",
      "secure passwords",
      "password storage",
      "autofill",
      "encryption",
      "password generator",
      "privacy",
    ],
    team: [
      { name: "Nguyen Van P", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Vo Thi O", avatar: "/female-avatar.png", role: "Designer" },
    ],
  },
  {
    id: "16",
    appName: "Weather Forecast",
    icon: "/weather-forecast-app-icon.jpg",
    os: "Android",
    market: "US",
    region: "North America",
    category: "App",
    progress: 100,
    lead: { name: "Tran Thi Q", avatar: "/female-avatar.png", email: "tranthiq@example.com" },
    status: "Approved",
    deadline: "2025-01-30",
    urgent: false,
    optimizationScope: "Metadata", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Accurate weather forecasting app with hourly and daily predictions, severe weather alerts, and interactive radar maps.",
    keywords: [
      "weather",
      "weather forecast",
      "weather app",
      "temperature",
      "weather radar",
      "weather alert",
      "forecast",
      "meteorology",
      "weather report",
      "climate",
    ],
    team: [
      { name: "Tran Thi Q", avatar: "/female-avatar.png", role: "Lead" },
      { name: "Nguyen Van P", avatar: "/male-avatar.png", role: "Dev" },
    ],
  },
  {
    id: "17",
    appName: "Recipe Finder",
    icon: "/recipe-finder-cooking-food-app.jpg",
    os: "iOS",
    market: "UK",
    region: "Europe",
    category: "App",
    progress: 78,
    lead: { name: "Le Van R", avatar: "/male-avatar.png", email: "levanr@example.com" },
    status: "Published",
    deadline: "2025-02-05",
    urgent: false,
    optimizationScope: "StoreKit", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Discover thousands of delicious recipes with step-by-step instructions, ingredient lists, and cooking timers for home chefs.",
    keywords: [
      "recipes",
      "cooking",
      "food recipes",
      "recipe finder",
      "cooking app",
      "meal ideas",
      "cookbook",
      "cooking guide",
      "food app",
      "chef recipes",
    ],
    team: [
      { name: "Le Van R", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Tran Thi Q", avatar: "/female-avatar.png", role: "ASO" },
    ],
  },
  {
    id: "18",
    appName: "Shopping List",
    icon: "/shopping-list-grocery-app.jpg",
    os: "Android",
    market: "VN",
    region: "Southeast Asia",
    category: "App",
    progress: 82,
    lead: { name: "Pham Thi S", avatar: "/female-avatar.png", email: "phamthis@example.com" },
    status: "Published",
    deadline: "2025-02-10",
    urgent: false,
    optimizationScope: "Both", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Smart shopping list app with barcode scanner, price comparison, and shared lists for family grocery shopping.",
    keywords: [
      "shopping list",
      "grocery list",
      "shopping app",
      "grocery shopping",
      "shopping cart",
      "grocery app",
      "shopping planner",
      "market list",
      "buy list",
      "shopping helper",
    ],
    team: [
      { name: "Pham Thi S", avatar: "/female-avatar.png", role: "Lead" },
      { name: "Le Van R", avatar: "/male-avatar.png", role: "Marketing" },
    ],
  },
  {
    id: "19",
    appName: "Pet Care",
    icon: "/pet-care-animals-app.jpg",
    os: "iOS",
    market: "US",
    region: "North America",
    category: "App",
    progress: 68,
    lead: { name: "Hoang Van T", avatar: "/male-avatar.png", email: "hoangvant@example.com" },
    status: "Optimizing",
    deadline: "2025-02-15",
    urgent: false,
    optimizationScope: "Metadata", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Complete pet care companion with health tracking, vet appointment reminders, feeding schedules, and pet care tips.",
    keywords: [
      "pet care",
      "pet tracker",
      "dog care",
      "cat care",
      "pet health",
      "vet app",
      "pet reminder",
      "animal care",
      "pet diary",
      "pet wellness",
    ],
    team: [
      { name: "Hoang Van T", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Pham Thi S", avatar: "/female-avatar.png", role: "Designer" },
    ],
  },
  {
    id: "20",
    appName: "Home Workout",
    icon: "/home-workout-fitness-exercise-app.jpg",
    os: "Android",
    market: "UK",
    region: "Europe",
    category: "App",
    progress: 72,
    lead: { name: "Vu Van U", avatar: "/male-avatar.png", email: "vuvanu@example.com" },
    status: "Optimizing",
    deadline: "2025-02-20",
    urgent: false,
    optimizationScope: "StoreKit", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "No-equipment home workout app with video demonstrations, customizable routines, and progress tracking for all fitness levels.",
    keywords: [
      "home workout",
      "workout app",
      "fitness app",
      "exercise",
      "no equipment",
      "bodyweight workout",
      "home fitness",
      "workout routines",
      "exercise app",
      "training",
    ],
    team: [
      { name: "Vu Van U", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Hoang Van T", avatar: "/male-avatar.png", role: "ASO" },
    ],
  },
  {
    id: "21",
    appName: "Book Reader",
    icon: "/book-reader-ebook-reading-app.jpg",
    os: "iOS",
    market: "VN",
    region: "Southeast Asia",
    category: "App",
    progress: 58,
    lead: { name: "Do Thi V", avatar: "/female-avatar.png", email: "dothiv@example.com" },
    status: "On Hold",
    deadline: "2025-02-25",
    urgent: false,
    optimizationScope: "Both", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "E-book reader with customizable reading experience, night mode, bookmarks, and access to thousands of digital books.",
    keywords: [
      "ebook reader",
      "book reader",
      "reading app",
      "digital books",
      "ebooks",
      "book app",
      "reading",
      "pdf reader",
      "book library",
      "literature",
    ],
    team: [
      { name: "Do Thi V", avatar: "/female-avatar.png", role: "Lead" },
      { name: "Vu Van U", avatar: "/male-avatar.png", role: "Dev" },
    ],
  },
  {
    id: "22",
    appName: "Music Player",
    icon: "/music-player-audio-streaming-app.jpg",
    os: "Android",
    market: "US",
    region: "North America",
    category: "App",
    progress: 62,
    lead: { name: "Bui Van W", avatar: "/male-avatar.png", email: "buivanw@example.com" },
    status: "On Hold",
    deadline: "2025-03-01",
    urgent: false,
    optimizationScope: "Metadata", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Feature-rich music player with equalizer, playlist management, and support for all audio formats with high-quality playback.",
    keywords: [
      "music player",
      "audio player",
      "music app",
      "mp3 player",
      "music streaming",
      "audio app",
      "music library",
      "song player",
      "music",
      "audio",
    ],
    team: [
      { name: "Bui Van W", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Do Thi V", avatar: "/female-avatar.png", role: "Marketing" },
    ],
  },
  {
    id: "23",
    appName: "Photo Editor Pro",
    icon: "/placeholder.svg?height=100&width=100",
    os: "iOS",
    market: "UK",
    region: "Europe",
    category: "App",
    progress: 48,
    lead: { name: "Ngo Thi X", avatar: "/female-avatar.png", email: "ngothix@example.com" },
    status: "Archived",
    deadline: "2025-03-05",
    urgent: false,
    optimizationScope: "StoreKit", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Professional photo editing app with filters, effects, cropping tools, and advanced editing features for stunning photos.",
    keywords: [
      "photo editor",
      "image editor",
      "photo editing",
      "photo effects",
      "filters",
      "picture editor",
      "photo app",
      "image editing",
      "photo filters",
      "editing app",
    ],
    team: [
      { name: "Ngo Thi X", avatar: "/female-avatar.png", role: "Lead" },
      { name: "Bui Van W", avatar: "/male-avatar.png", role: "ASO" },
    ],
  },
  {
    id: "24",
    appName: "Video Editor",
    icon: "/placeholder.svg?height=100&width=100",
    os: "Android",
    market: "VN",
    region: "Southeast Asia",
    category: "App",
    progress: 52,
    lead: { name: "Duong Van Y", avatar: "/male-avatar.png", email: "duongvany@example.com" },
    status: "Archived",
    deadline: "2025-03-10",
    urgent: false,
    optimizationScope: "Both", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Easy-to-use video editor with trimming, merging, effects, transitions, and music overlay for creating professional videos.",
    keywords: [
      "video editor",
      "video maker",
      "movie maker",
      "video editing",
      "video app",
      "video effects",
      "video creator",
      "video production",
      "video editing app",
      "video tool",
    ],
    team: [
      { name: "Duong Van Y", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Ngo Thi X", avatar: "/female-avatar.png", role: "Designer" },
    ],
  },
  {
    id: "25",
    appName: "Calorie Counter",
    icon: "/placeholder.svg?height=100&width=100",
    os: "iOS",
    market: "US",
    region: "North America",
    category: "App",
    progress: 76,
    lead: { name: "Tran Van Z", avatar: "/male-avatar.png", email: "tranvanz@example.com" },
    status: "Draft",
    deadline: "2025-03-15",
    urgent: false,
    optimizationScope: "Metadata", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Track calories, macros, and nutrition with comprehensive food database, barcode scanner, and personalized dietary goals.",
    keywords: [
      "calorie counter",
      "calorie tracker",
      "nutrition app",
      "diet tracker",
      "food diary",
      "macro tracker",
      "weight loss",
      "food tracker",
      "nutrition tracker",
      "diet app",
    ],
    team: [
      { name: "Tran Van Z", avatar: "/male-avatar.png", role: "Lead" },
      { name: "Duong Van Y", avatar: "/male-avatar.png", role: "ASO" },
    ],
  },
  {
    id: "26",
    appName: "Intermittent Fasting",
    icon: "/placeholder.svg?height=100&width=100",
    os: "Android",
    market: "UK",
    region: "Europe",
    category: "App",
    progress: 84,
    lead: { name: "Le Thi AA", avatar: "/female-avatar.png", email: "lethiaa@example.com" },
    status: "Researching",
    deadline: "2025-03-20",
    urgent: false,
    optimizationScope: "StoreKit", // Thêm field này
    metadataPublished: false,
    storekitPublished: false,
    campaignId: "", // Campaign ID
    description:
      "Intermittent fasting tracker with customizable fasting schedules, progress monitoring, and educational content about fasting benefits.",
    keywords: [
      "intermittent fasting",
      "fasting tracker",
      "fasting app",
      "diet app",
      "weight loss",
      "fasting timer",
      "health app",
      "fasting schedule",
      "IF app",
      "fasting tracker",
    ],
    team: [
      { name: "Le Thi AA", avatar: "/female-avatar.png", role: "Lead" },
      { name: "Tran Van Z", avatar: "/male-avatar.png", role: "Marketing" },
    ],
  },
]

import { emitSyncEvent } from "@/lib/aso-data-sync"

export const getProjectById = (projectId: string) => {
  return PROJECTS_DATA.find((p) => p.id === projectId)
}

export const updateProjectById = (projectId: string, updatedData: Partial<(typeof PROJECTS_DATA)[0]>) => {
  const projectIndex = PROJECTS_DATA.findIndex((p) => p.id === projectId)
  if (projectIndex !== -1) {
    const oldProject = PROJECTS_DATA[projectIndex]

    PROJECTS_DATA[projectIndex] = {
      ...PROJECTS_DATA[projectIndex],
      ...updatedData,
    }

    emitSyncEvent({
      eventType: "PROJECT_UPDATED",
      sourceModule: "Project",
      targetModules: ["Metadata", "StoreKit", "Tracking"],
      data: {
        updates: updatedData,
        oldProject,
      },
      projectId: projectId,
      triggeredBy: "system", // TODO: Lấy user thực tế
    })

    return PROJECTS_DATA[projectIndex]
  }
  return null
}

export const deleteProjectById = (projectId: string) => {
  const projectIndex = PROJECTS_DATA.findIndex((p) => p.id === projectId)
  if (projectIndex !== -1) {
    const deletedProject = PROJECTS_DATA[projectIndex]
    PROJECTS_DATA.splice(projectIndex, 1)

    emitSyncEvent({
      eventType: "PROJECT_DELETED",
      sourceModule: "Project",
      targetModules: ["Metadata", "StoreKit", "Asset", "Tracking"],
      data: {
        deletedProject,
      },
      projectId: projectId,
      triggeredBy: "system",
    })

    return deletedProject
  }
  return null
}
