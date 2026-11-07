/**
 * EventFlow - Events Dataset
 * Curated list of upcoming multi-disciplinary events with rich metadata,
 * speakers, agendas, pricing, and dynamic countdown target dates.
 */

const EVENTS_DATA = [
  {
    id: "evt-01",
    title: "Global AI & NextGen Cloud Summit 2026",
    category: "technology",
    categoryLabel: "Technology",
    badgeColor: "indigo",
    date: "2026-11-28T09:30:00",
    displayDate: "Saturday, Nov 28, 2026 • 9:30 AM EST",
    venue: "Silicon Convention Pavilion & Metaverse Stream",
    city: "San Francisco, CA",
    isOnline: true,
    price: 0,
    priceLabel: "Free Admission",
    seatsTotal: 500,
    seatsLeft: 84,
    rating: 4.9,
    reviewsCount: 320,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
    fallbackColor: "#4f46e5",
    shortDescription: "Explore the frontiers of Agentic AI, Large Multimodal Models, and distributed cloud computing with industry pioneers.",
    fullDescription: "Join over 2,000 engineers, AI researchers, and tech founders at the world's premier artificial intelligence gathering. Deep-dive into autonomous systems, real-time edge processing, generative interfaces, and the ethical architecture of tomorrow's compute infrastructure. Features 18 keynotes, 12 hands-on workshops, and dedicated investor networking lounges.",
    speakers: [
      { name: "Dr. Elena Vance", role: "VP of AI Research", company: "DeepLogic Labs", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Marcus Thorne", role: "Chief Cloud Architect", company: "Aether Systems", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Sophia Chen", role: "Lead Systems Engineer", company: "NovaQuantum", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" }
    ],
    agenda: [
      { time: "09:30 AM", title: "Opening Keynote: The Dawn of Autonomous Software", speaker: "Dr. Elena Vance" },
      { time: "11:15 AM", title: "Panel: Scaling Edge AI to 1 Billion Concurrent Nodes", speaker: "Marcus Thorne & Sophia Chen" },
      { time: "02:00 PM", title: "Hands-on Workshop: Building Resilient Agentic Workflows", speaker: "NovaQuantum Engineering" },
      { time: "04:30 PM", title: "Networking & Innovation Pitch Showcase", speaker: "Open Stage" }
    ],
    tags: ["Artificial Intelligence", "Cloud Native", "Agentic Systems", "Workshops"]
  },
  {
    id: "evt-02",
    title: "NeoSound Indie Music & Arts Carnival",
    category: "music",
    categoryLabel: "Music & Arts",
    badgeColor: "rose",
    date: "2026-12-05T16:00:00",
    displayDate: "Friday, Dec 05, 2026 • 4:00 PM CST",
    venue: "Horizon Waterfront Amphitheater",
    city: "Austin, TX",
    isOnline: false,
    price: 45,
    priceLabel: "$45.00 / Pass",
    seatsTotal: 1200,
    seatsLeft: 160,
    rating: 4.8,
    reviewsCount: 450,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
    fallbackColor: "#e11d48",
    shortDescription: "A three-day open-air celebration of synth-pop, indie rock, generative visual art installations, and culinary street culture.",
    fullDescription: "NeoSound fuses electrifying live musical performances with immersive spatial soundscapes and reactive digital visual exhibits. Stroll across three festival stages under the starlit Austin sky, sample gourmet artisan food trucks, and experience interactive laser projections crafted by international new-media creators.",
    speakers: [
      { name: "The Lunar Echoes", role: "Headlining Band", company: "Indie Rock Pioneers", avatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80" },
      { name: "Aria Sol", role: "Ambient Electro Producer", company: "Sonic Visions", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
      { name: "Kaelen Voss", role: "Interactive Light Sculptor", company: "Studio Lux", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    agenda: [
      { time: "04:00 PM", title: "Gates Open & Interactive Installation Tours", speaker: "Curator Team" },
      { time: "05:30 PM", title: "Acoustic Sunset Sets at Meadow Stage", speaker: "Aria Sol" },
      { time: "08:00 PM", title: "Mainstage Spectacle & Laser Dome Symphony", speaker: "The Lunar Echoes" },
      { time: "11:00 PM", title: "Midnight Silent Disco & Afterparty", speaker: "Guest DJs" }
    ],
    tags: ["Live Concert", "Indie Music", "Art Installations", "Food & Drinks"]
  },
  {
    id: "evt-03",
    title: "NextGen UI/UX & Design Systems Conference",
    category: "design",
    categoryLabel: "Design & UX",
    badgeColor: "amber",
    date: "2026-12-12T10:00:00",
    displayDate: "Saturday, Dec 12, 2026 • 10:00 AM CST",
    venue: "Metropolitan Design Center & Global Stream",
    city: "Chicago, IL",
    isOnline: true,
    price: 25,
    priceLabel: "$25.00 / Pass",
    seatsTotal: 400,
    seatsLeft: 42,
    rating: 4.95,
    reviewsCount: 198,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=80",
    fallbackColor: "#d97706",
    shortDescription: "Elevate your craft in modern design systems, micro-interactions, spatial design, and accessible component architectures.",
    fullDescription: "Discover how top design teams build coherent, accessible, and delightful digital products. From fluid typography and color space science to AI-assisted prototyping and cross-platform token architectures, gain battle-tested strategies from staff designers at leading tech firms.",
    speakers: [
      { name: "Maya Lin-Bisset", role: "Head of Product Design", company: "Fable Design Labs", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" },
      { name: "Julian Thorne", role: "Design Systems Architect", company: "CoreUI Collective", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" },
      { name: "Rina Patel", role: "Accessibility Lead", company: "Inclusive UX Initiative", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" }
    ],
    agenda: [
      { time: "10:00 AM", title: "Keynote: Designing with Intent in an AI-Accelerated World", speaker: "Maya Lin-Bisset" },
      { time: "11:30 AM", title: "Tokens at Scale: Bridging Figma and Production Code", speaker: "Julian Thorne" },
      { time: "01:30 PM", title: "Masterclass: WCAG 2.2 Deep Dive and Radical Usability", speaker: "Rina Patel" },
      { time: "03:30 PM", title: "Portfolio Critiques & Live Redesign Sprint", speaker: "Design Mentors" }
    ],
    tags: ["UI/UX", "Design Systems", "Accessibility", "Figma", "Design Tokens"]
  },
  {
    id: "evt-04",
    title: "FinTech Disruptors & Venture Capital Summit",
    category: "business",
    categoryLabel: "Business & Startups",
    badgeColor: "emerald",
    date: "2026-12-19T09:00:00",
    displayDate: "Saturday, Dec 19, 2026 • 9:00 AM EST",
    venue: "Grand Plaza Financial Center",
    city: "New York, NY",
    isOnline: false,
    price: 60,
    priceLabel: "$60.00 / Pass",
    seatsTotal: 350,
    seatsLeft: 28,
    rating: 4.7,
    reviewsCount: 165,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80",
    fallbackColor: "#059669",
    shortDescription: "Where leading FinTech innovators, angel investors, and venture capitalists meet to finance the next wave of economic infrastructure.",
    fullDescription: "An exclusive summit connecting early-stage fintech entrepreneurs with Series A through C venture partners. Features high-velocity pitch competitions, legal masterclasses on cross-border digital compliance, and deep dives into real-time payment rails and algorithmic treasury operations.",
    speakers: [
      { name: "David Sterling", role: "Managing Partner", company: "Apex Capital Ventures", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80" },
      { name: "Amara Okonjo", role: "Founder & CEO", company: "PayStream Global", avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80" },
      { name: "Christian Gray", role: "Chief Risk Strategist", company: "WallStreet Quantum", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" }
    ],
    agenda: [
      { time: "09:00 AM", title: "Breakfast Networking & State of Venture 2026 Report", speaker: "David Sterling" },
      { time: "10:45 AM", title: "Panel: Global Payments, CBDCs, and Cross-Border Liquidity", speaker: "Amara Okonjo & Guests" },
      { time: "01:30 PM", title: "Start-up Pitch Arena (Top 10 Finalists)", speaker: "Judging Panel" },
      { time: "04:00 PM", title: "Private 1-on-1 Investor Matching Sessions", speaker: "Registered Founders" }
    ],
    tags: ["FinTech", "Venture Capital", "Startup Pitch", "Networking", "Banking"]
  },
  {
    id: "evt-05",
    title: "FullStack Cloud-Native Dev Bootcamp",
    category: "technology",
    categoryLabel: "Technology",
    badgeColor: "indigo",
    date: "2026-11-22T10:00:00",
    displayDate: "Sunday, Nov 22, 2026 • 10:00 AM PST",
    venue: "TechSpace Innovation Lab",
    city: "Seattle, WA",
    isOnline: true,
    price: 0,
    priceLabel: "Free Workshop",
    seatsTotal: 250,
    seatsLeft: 19,
    rating: 4.88,
    reviewsCount: 275,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80",
    fallbackColor: "#4f46e5",
    shortDescription: "Intensive 6-hour hands-on coding sprint mastering Docker containers, Microservices architecture, and modern TypeScript.",
    fullDescription: "Roll up your sleeves and write production code alongside seasoned mentors. We will build, test, and deploy a multi-tenant microservices pipeline utilizing serverless compute, containerized databases, resilient caching, and automated CI/CD pipelines.",
    speakers: [
      { name: "Devon Clark", role: "Principal Cloud Engineer", company: "ScaleStack Systems", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80" },
      { name: "Hana Takahashi", role: "DevOps Architect", company: "Kubecraft", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" }
    ],
    agenda: [
      { time: "10:00 AM", title: "Containerization Fundamentals & Multi-stage Builds", speaker: "Devon Clark" },
      { time: "12:00 PM", title: "Microservices Inter-Service Communication Patterns", speaker: "Hana Takahashi" },
      { time: "02:00 PM", title: "Zero-Downtime Deployments with Kubernetes & Canary Releases", speaker: "Devon Clark" },
      { time: "03:30 PM", title: "Live Debugging Challenge & Git Repositories Review", speaker: "All Attendees" }
    ],
    tags: ["Web Dev", "Cloud Native", "Docker", "TypeScript", "Hands-on"]
  },
  {
    id: "evt-06",
    title: "Metropolis Half Marathon & Fitness Carnival",
    category: "sports",
    categoryLabel: "Sports & Health",
    badgeColor: "cyan",
    date: "2026-12-27T06:30:00",
    displayDate: "Sunday, Dec 27, 2026 • 6:30 AM EST",
    venue: "Riverfront Promenade & Olympic Park",
    city: "Boston, MA",
    isOnline: false,
    price: 30,
    priceLabel: "$30.00 / Entry",
    seatsTotal: 2000,
    seatsLeft: 310,
    rating: 4.92,
    reviewsCount: 520,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1000&q=80",
    fallbackColor: "#0891b2",
    shortDescription: "A scenic 21K run along the picturesque riverway, paired with fitness clinics, wellness expos, and post-race brunch celebration.",
    fullDescription: "Open to both competitive athletes and casual runners. The certified flat-and-fast course loops through iconic city bridges and parklands with live hydration stations, cheer zones, and RFID timing chips. Registrations include an official dry-fit running tee, finisher medal, and access to the wellness carnival.",
    speakers: [
      { name: "Coach Trevor Hayes", role: "Olympian Marathoner", company: "Elite Run Club", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Dr. Chloe Adams", role: "Sports Nutritionist", company: "Endurance Health Institute", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" }
    ],
    agenda: [
      { time: "06:30 AM", title: "Runner Check-in & Dynamic Warmup Drills", speaker: "Coach Trevor Hayes" },
      { time: "07:15 AM", title: "Wave 1 Marathon Flag-off (Elite Runners)", speaker: "Race Marshals" },
      { time: "07:30 AM", title: "Wave 2 & 3 Open Flag-off", speaker: "Race Marshals" },
      { time: "10:30 AM", title: "Podium Ceremony & Finisher Lawn Celebration", speaker: "Event Committee" }
    ],
    tags: ["Marathon", "Fitness", "Outdoor", "Health", "Running"]
  },
  {
    id: "evt-07",
    title: "GameDev Odyssey & XR Interactive Expo",
    category: "technology",
    categoryLabel: "Technology & Gaming",
    badgeColor: "indigo",
    date: "2027-01-16T10:00:00",
    displayDate: "Saturday, Jan 16, 2027 • 10:00 AM PST",
    venue: "MegaDome Arena & Unreal Engine Broadcast",
    city: "Los Angeles, CA",
    isOnline: true,
    price: 35,
    priceLabel: "$35.00 / Pass",
    seatsTotal: 600,
    seatsLeft: 78,
    rating: 4.85,
    reviewsCount: 310,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80",
    fallbackColor: "#4f46e5",
    shortDescription: "Celebrate the craft of game creation with AAA developers, indie gems, virtual reality tech, and esports tourneys.",
    fullDescription: "Experience playable demos of unreleased indie and studio titles, participate in live speed-modeling jams, and hear technical post-mortems on ray-tracing shaders, procedural world generation, and spatial audio in gaming.",
    speakers: [
      { name: "Victor Cruz", role: "Technical Game Director", company: "Obsidian Horizon", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Lyra Thorne", role: "Narrative Lead", company: "CyberWeave Interactive", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ],
    agenda: [
      { time: "10:00 AM", title: "Keynote: Procedural Worlds and Real-time Rendering", speaker: "Victor Cruz" },
      { time: "12:00 PM", title: "Showcase: Top 20 Indie Game Show Floor Playtesting", speaker: "Indie Developers" },
      { time: "02:30 PM", title: "Panel: Emotional Impact in Non-linear Storytelling", speaker: "Lyra Thorne" },
      { time: "04:30 PM", title: "Esports Collegiate Championship Finals", speaker: "Arena Casters" }
    ],
    tags: ["Game Dev", "Unreal Engine", "VR/XR", "Esports", "Indie Games"]
  },
  {
    id: "evt-08",
    title: "Global CleanTech & Circular Economy Forum",
    category: "business",
    categoryLabel: "Business & Climate",
    badgeColor: "emerald",
    date: "2027-01-23T09:00:00",
    displayDate: "Saturday, Jan 23, 2027 • 9:00 AM MST",
    venue: "EcoSphere Innovation Campus",
    city: "Denver, CO",
    isOnline: true,
    price: 0,
    priceLabel: "Free Admission",
    seatsTotal: 500,
    seatsLeft: 112,
    rating: 4.89,
    reviewsCount: 140,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1000&q=80",
    fallbackColor: "#059669",
    shortDescription: "Catalyzing solutions for clean energy grids, carbon accounting, regenerative materials, and green venture investment.",
    fullDescription: "Join scientists, sustainability leaders, and policy architects discussing transformative technologies driving carbon neutrality. Sessions spotlight hydrogen fuel cells, grid-scale battery storage, closed-loop manufacturing, and international climate finance.",
    speakers: [
      { name: "Dr. Ananya Roy", role: "Chief Climate Scientist", company: "EarthForward Institute", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" },
      { name: "Henrik Lindqvist", role: "Head of Clean Energy", company: "Nordic Grid Alliance", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ],
    agenda: [
      { time: "09:00 AM", title: "Opening Address: The 2030 Net-Zero Technology Blueprint", speaker: "Dr. Ananya Roy" },
      { time: "11:00 AM", title: "Panel: Industrial Decarbonization and Circular Manufacturing", speaker: "Henrik Lindqvist & Industry Leaders" },
      { time: "01:30 PM", title: "Breakout: Climate Tech Seed Pitch Session", speaker: "Emerging Startups" },
      { time: "03:30 PM", title: "Roundtable: ESG Auditing & Carbon Credits Legitimacy", speaker: "Green Financial Panel" }
    ],
    tags: ["CleanTech", "Sustainability", "Green Energy", "Climate Action"]
  },
  {
    id: "evt-09",
    title: "Acoustic Sunset Jazz & Gastronomy Night",
    category: "music",
    categoryLabel: "Music & Arts",
    badgeColor: "rose",
    date: "2026-12-31T18:00:00",
    displayDate: "Thursday, Dec 31, 2026 • 6:00 PM EST",
    venue: "Biscayne Bay Sky Terrace",
    city: "Miami, FL",
    isOnline: false,
    price: 55,
    priceLabel: "$55.00 / Pass",
    seatsTotal: 180,
    seatsLeft: 12,
    rating: 4.96,
    reviewsCount: 210,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1000&q=80",
    fallbackColor: "#e11d48",
    shortDescription: "Welcome the New Year with world-class smooth jazz virtuosos, panoramic sea views, craft cocktails, and chef tasting menus.",
    fullDescription: "An intimate, soulful celebration overlooking the sparkling Miami coastline. Listen to Grammy-nominated saxophone and piano quartets while savoring handcrafted tapas pairings prepared by award-winning culinary masters. Complete with midnight toast and front-row skyline fireworks viewing.",
    speakers: [
      { name: "Miles Calloway Quartet", role: "Featured Jazz Ensemble", company: "Blue Note Records", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Chef Carmen Ruiz", role: "Executive Master Chef", company: "Biscayne Sky Dining", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" }
    ],
    agenda: [
      { time: "06:00 PM", title: "Cocktail Reception & Sunset Chilled Quartets", speaker: "Miles Calloway Quartet" },
      { time: "08:00 PM", title: "Chef Carmen 5-Course Gastronomic Tasting", speaker: "Chef Carmen Ruiz" },
      { time: "10:30 PM", title: "High-Energy Latin Jazz Fusion Set", speaker: "Calloway & Special Guests" },
      { time: "11:59 PM", title: "Champagne Countdown & Waterfront Fireworks", speaker: "All Attendees" }
    ],
    tags: ["Jazz Music", "Gourmet Dining", "New Year Eve", "Live Performance"]
  }
];

// Helper to get all unique categories
const EVENT_CATEGORIES = [
  { id: "all", label: "All Events" },
  { id: "technology", label: "Technology" },
  { id: "music", label: "Music & Arts" },
  { id: "design", label: "Design & UX" },
  { id: "business", label: "Business" },
  { id: "sports", label: "Sports & Health" }
];
