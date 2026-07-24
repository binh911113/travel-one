import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

import {
  Home,
  Map,
  Compass,
  Heart,
  MessageSquare,
  Settings,
  Mic,
  Send,
  Bell,
  ChevronRight,
  Hotel,
  Utensils,
  Landmark,
  Banknote,
  RefreshCw,
  Languages,
  Download,
  Share2,
  Bookmark,
  Sun,
  Cloud,
  Bot,
  X,
  MapPin,
  Clock,
  DollarSign,
  Backpack,
  User,
  Plus,
  Plane,
  Sparkles,
  Trash2,
  Search,
  ToggleLeft,
  ToggleRight,
  Globe,
  Volume2,
  Shield,
  CreditCard,
  Sliders,
  CalendarDays,
  CheckCircle2,
  Timer,
  ExternalLink,
  Star,
} from "lucide-react";

type View = "landing" | "dashboard";
type NavId = "home" | "trips" | "explore" | "favorites" | "history" | "settings";

const NAV_ITEMS: { id: NavId; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "trips", label: "My Trips", icon: Plane },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "history", label: "AI History", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

const CHIPS = [
  "Japan in Autumn",
  "Bali under $600",
  "Food Trip",
  "Family Vacation",
];

const DAYS = [
  {
    day: 1,
    date: "Oct 15",
    label: "Arrival Day",
    hotel: { name: "Park Hyatt Tokyo", area: "Shinjuku", pin: "blue" },
    restaurant: { name: "Sukiyabashi Jiro", area: "Ginza", pin: "teal" },
    attraction: { name: "Senso-ji Temple", area: "Asakusa", pin: "purple" },
    atm: "7-Eleven ATM, 2 min walk",
    recycler: "Narita Airport T2, Level B1",
    translation: "Japanese · Auto-detect",
  },
  {
    day: 2,
    date: "Oct 16",
    label: "City & Culture",
    hotel: { name: "Park Hyatt Tokyo", area: "Shinjuku", pin: "blue" },
    restaurant: { name: "Ichiran Ramen", area: "Shibuya", pin: "teal" },
    attraction: { name: "Meiji Shrine", area: "Harajuku", pin: "purple" },
    atm: "Japan Post ATM, 4 min walk",
    recycler: "Shinjuku Station, West Exit",
    translation: "Japanese · Auto-detect",
  },
  {
    day: 3,
    date: "Oct 17",
    label: "Day Trip · Nikko",
    hotel: { name: "Park Hyatt Tokyo", area: "Shinjuku", pin: "blue" },
    restaurant: { name: "Gyukatsu Motomura", area: "Akihabara", pin: "teal" },
    attraction: { name: "Tosho-gu Shrine", area: "Nikko", pin: "purple" },
    atm: "7-Eleven ATM, Nikko Station",
    recycler: "Ueno Station, Central Exit",
    translation: "Japanese · Auto-detect",
  },
];

const MAP_PINS = [
  { x: 38, y: 30, label: "Senso-ji", color: "#2563eb" },
  { x: 52, y: 48, label: "Shinjuku", color: "#2563eb" },
  { x: 44, y: 62, label: "Shibuya", color: "#14b8a6" },
  { x: 61, y: 41, label: "Ginza", color: "#14b8a6" },
  { x: 28, y: 55, label: "Harajuku", color: "#8b5cf6" },
  { x: 70, y: 25, label: "Akihabara", color: "#f59e0b" },
];

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [activeNav, setActiveNav] = useState<NavId>("home");
  const [prompt, setPrompt] = useState("");
  const [listening, setListening] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [showAIO, setShowAIO] = useState(false);
  const [savedTrip, setSavedTrip] = useState(false);

  const [aioPrompt, setAioPrompt] = useState("");
  const [aioResponse, setAioResponse] = useState("");
  const [loading, setLoading] = useState(false);
  
  function handleSubmit(text?: string) {
    const value = text ?? prompt;
    if (!value.trim()) return;
    setView("dashboard");
    setActiveNav("home");
    setPrompt("");
  }

  function handleChip(chip: string) {
    setPrompt(chip);
    handleSubmit(chip);
  }
  async function askAIO() {
  if (!aioPrompt.trim()) return;

  setLoading(true);

  try {
    const ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    });
    
    console.log("API Key:", import.meta.env.VITE_GEMINI_API_KEY);

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: aioPrompt,
    });

    setAioResponse(response.text ?? "No response.");
  } catch (error) {
    console.error(error);
    setAioResponse("Something went wrong.");
  }

  setLoading(false);
}

  const day = DAYS[activeDay];

  function renderPage() {
    if (activeNav === "home") {
      return view === "landing" ? (
        <LandingView
          prompt={prompt}
          setPrompt={setPrompt}
          listening={listening}
          setListening={setListening}
          onSubmit={handleSubmit}
          onChip={handleChip}
        />
      ) : (
        <DashboardView
          day={day}
          activeDay={activeDay}
          setActiveDay={setActiveDay}
          savedTrip={savedTrip}
          setSavedTrip={setSavedTrip}
        />
      );
    }
    if (activeNav === "trips") return <MyTripsPage />;
    if (activeNav === "explore") return <ExplorePage />;
    if (activeNav === "favorites") return <FavoritesPage />;
    if (activeNav === "history") return <AIHistoryPage />;
    if (activeNav === "settings") return <SettingsPage />;
    return null;
  }

  return (
    <div
      className="flex h-screen w-screen overflow-hidden bg-background"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Sidebar ── */}
      <aside className="flex flex-col w-60 min-w-60 bg-card border-r border-border h-full py-6">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight">
              Travel One
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeNav === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveNav(id);
                  if (id === "home") setView("landing");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 mt-4">
          <button
            onClick={() => { setView("landing"); setActiveNav("home"); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-blue-600 transition-colors duration-150"
          >
            <Plus className="w-4 h-4" />
            New Trip
          </button>
        </div>

        <div className="px-4 mt-6 pt-4 border-t border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Nguyen Xuan Binh</p>
            <p className="text-xs text-muted-foreground truncate">Pro Plan</p>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-end gap-3 px-8 py-4 bg-card border-b border-border flex-shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-sm text-foreground">
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="font-medium">24°C</span>
            <span className="text-muted-foreground">Tokyo</span>
          </div>
          <button className="relative w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-secondary transition-colors">
            <Bell className="w-4 h-4 text-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
            <User className="w-4 h-4 text-primary" />
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          {renderPage()}
        </main>
      </div>

      {/* Floating AIO button */}
      <div className="fixed bottom-6 right-6 z-50">
        {showAIO && (
          <div className="absolute bottom-14 right-0 w-72 bg-card rounded-2xl shadow-xl border border-border p-4 mb-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>

              <span className="text-sm font-semibold text-foreground">
                AIO Assistant
              </span>

              <button 
                onClick={() => setShowAIO(false)}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Hey Binh! Need help adjusting your itinerary, finding alternatives, or translating something?
            </p>

            <div className="flex gap-2">
              <input
                value={aioPrompt}
                onChange={(e) => setAioPrompt(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-lg bg-muted border border-border outline-none placeholder:text-muted-foreground focus:border-primary transition-colors"
                placeholder="Ask AIO anything..."
              />

              <button
                onClick={askAIO}
                className="px-3 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {loading && (
              <p className="mt-3 text-xs text-muted-foreground">
                AIO is thinking...
              </p>
            )}

            {aioResponse && (
              <div className="mt-3 rounded-lg bg-muted p-3 text-xs text-foreground whitespace-pre-wrap">
                {aioResponse}
              </div>
            )}
          </div>
        )}
        <button
          onClick={() => setShowAIO(!showAIO)}
          className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all hover:scale-105 active:scale-95"
        >
          <Bot className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/* ────────────────────── Landing View ────────────────────── */

function LandingView({
  prompt,
  setPrompt,
  listening,
  setListening,
  onSubmit,
  onChip,
}: {
  prompt: string;
  setPrompt: (v: string) => void;
  listening: boolean;
  setListening: (v: boolean) => void;
  onSubmit: () => void;
  onChip: (chip: string) => void;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8 overflow-y-auto">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-blue-100 text-xs font-medium text-primary mb-2">
            <Sparkles className="w-3 h-3" />
            Powered by AIO
          </div>
          <h1 className="text-5xl font-bold text-foreground tracking-tight leading-tight">
            Travel One
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Every Journey. One Solution.
          </p>
        </div>

        <div className="w-full bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            <button
              onClick={() => setListening(!listening)}
              className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 ${
                listening
                  ? "bg-primary text-white shadow-md shadow-blue-200 scale-95"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-primary"
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              placeholder="Ask AIO to plan your journey..."
              className="flex-1 text-sm text-foreground bg-transparent outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={() => onSubmit()}
              disabled={!prompt.trim()}
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 px-4 pb-4 flex-wrap">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => onChip(chip)}
                className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-colors duration-150 flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 opacity-60" />
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full grid grid-cols-3 gap-3">
          {[
            { dest: "Kyoto", dates: "Nov 2–8", img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=200&fit=crop&auto=format" },
            { dest: "Santorini", dates: "Dec 14–20", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=200&fit=crop&auto=format" },
            { dest: "New York", dates: "Jan 3–7", img: "https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=400&h=200&fit=crop&auto=format" },
          ].map(({ dest, dates, img }) => (
            <button
              key={dest}
              onClick={() => onChip(`${dest} trip`)}
              className="relative rounded-xl overflow-hidden h-24 group bg-muted"
            >
              <img src={img} alt={dest} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-3 text-left">
                <p className="text-white text-sm font-semibold">{dest}</p>
                <p className="text-white/70 text-xs">{dates}</p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-white" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────── Dashboard View ────────────────────── */

function DashboardView({
  day,
  activeDay,
  setActiveDay,
  savedTrip,
  setSavedTrip,
}: {
  day: (typeof DAYS)[0];
  activeDay: number;
  setActiveDay: (i: number) => void;
  savedTrip: boolean;
  setSavedTrip: (v: boolean) => void;
}) {
  return (
    <div className="h-full flex overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-shrink-0 px-8 pt-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Japan in Autumn</h2>
              <p className="text-sm text-muted-foreground mt-0.5">AI-generated itinerary · 3 days · Tokyo</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSavedTrip(!savedTrip)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  savedTrip
                    ? "bg-primary text-white border-primary"
                    : "bg-card text-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${savedTrip ? "fill-white" : ""}`} />
                {savedTrip ? "Saved" : "Save Trip"}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors">
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-border bg-card text-foreground hover:border-primary hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {[
              { icon: MapPin, label: "Destination", value: "Tokyo, Japan", color: "text-primary" },
              { icon: Clock, label: "Duration", value: "3 Days · 2 Nights", color: "text-primary" },
              { icon: DollarSign, label: "Budget", value: "$1,200 total", color: "text-accent" },
              { icon: Backpack, label: "Travel Style", value: "Culture & Food", color: "text-purple-500" },
              { icon: Cloud, label: "Est. Cost", value: "$980 / person", color: "text-amber-500" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-3.5">
                <div className={`${color} mb-1.5`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-foreground leading-tight">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 px-8 pb-3 flex items-center gap-2">
          {DAYS.map((d, i) => (
            <button
              key={d.day}
              onClick={() => setActiveDay(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeDay === i
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <span>Day {d.day}</span>
              <span className={`text-xs ${activeDay === i ? "text-blue-100" : "text-muted-foreground"}`}>{d.date}</span>
            </button>
          ))}
          <span className="ml-2 text-sm font-medium text-foreground">{day.label}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-3">
          <TimelineCard
            icon={Hotel}
            iconColor="bg-blue-50 text-primary"
            category="Hotel"
            title={day.hotel.name}
            subtitle={day.hotel.area}
            badge="Confirmed"
            badgeColor="bg-green-50 text-green-600"
          />
          <TimelineCard
            icon={Utensils}
            iconColor="bg-teal-50 text-accent"
            category="Restaurant"
            title={day.restaurant.name}
            subtitle={day.restaurant.area}
            badge="Dinner · 7:30 PM"
            badgeColor="bg-teal-50 text-teal-600"
          />
          <TimelineCard
            icon={Landmark}
            iconColor="bg-purple-50 text-purple-500"
            category="Attraction"
            title={day.attraction.name}
            subtitle={day.attraction.area}
            badge="9:00 AM"
            badgeColor="bg-purple-50 text-purple-600"
          />
          <div className="grid grid-cols-3 gap-3">
            <MiniCard icon={Banknote} label="Nearby ATM" value={day.atm} color="text-amber-500" />
            <MiniCard icon={RefreshCw} label="Cash Recycler" value={day.recycler} color="text-blue-400" />
            <MiniCard icon={Languages} label="Translation" value={day.translation} color="text-accent" />
          </div>
        </div>
      </div>

      {/* Map panel */}
      <div className="w-80 flex-shrink-0 border-l border-border bg-card flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Map View</h3>
          <span className="text-xs text-muted-foreground">Tokyo, Japan</span>
        </div>
        <div className="flex-1 relative bg-[#EEF2FF] overflow-hidden">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-30">
            <line x1="20" y1="0" x2="20" y2="100" stroke="#94a3b8" strokeWidth="0.4" />
            <line x1="45" y1="0" x2="45" y2="100" stroke="#94a3b8" strokeWidth="0.4" />
            <line x1="65" y1="0" x2="65" y2="100" stroke="#94a3b8" strokeWidth="0.4" />
            <line x1="80" y1="0" x2="80" y2="100" stroke="#94a3b8" strokeWidth="0.4" />
            <line x1="0" y1="20" x2="100" y2="20" stroke="#94a3b8" strokeWidth="0.4" />
            <line x1="0" y1="40" x2="100" y2="40" stroke="#94a3b8" strokeWidth="0.4" />
            <line x1="0" y1="60" x2="100" y2="60" stroke="#94a3b8" strokeWidth="0.4" />
            <line x1="0" y1="80" x2="100" y2="80" stroke="#94a3b8" strokeWidth="0.4" />
            <line x1="10" y1="35" x2="90" y2="35" stroke="#cbd5e1" strokeWidth="0.8" />
            <line x1="35" y1="10" x2="55" y2="90" stroke="#cbd5e1" strokeWidth="0.8" />
            <rect x="22" y="22" width="20" height="15" rx="1" fill="#dbeafe" opacity="0.6" />
            <rect x="47" y="42" width="15" height="15" rx="1" fill="#d1fae5" opacity="0.6" />
            <rect x="22" y="62" width="18" height="15" rx="1" fill="#ede9fe" opacity="0.6" />
            <rect x="66" y="22" width="12" height="16" rx="1" fill="#fef3c7" opacity="0.6" />
          </svg>
          {MAP_PINS.map(({ x, y, label, color }) => (
            <div
              key={label}
              className="absolute group"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -100%)" }}
            >
              <div className="flex flex-col items-center cursor-pointer">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                  style={{ backgroundColor: color }}
                >
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: color }} />
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-foreground text-white text-[10px] font-medium px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-border space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Legend</p>
          {[
            { color: "#2563eb", label: "Hotels" },
            { color: "#14b8a6", label: "Restaurants" },
            { color: "#8b5cf6", label: "Attractions" },
            { color: "#f59e0b", label: "ATM / Services" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────── Shared Components ────────────────────── */

function TimelineCard({
  icon: Icon,
  iconColor,
  category,
  title,
  subtitle,
  badge,
  badgeColor,
}: {
  icon: React.ElementType;
  iconColor: string;
  category: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 hover:shadow-sm transition-all duration-150 cursor-pointer group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs text-muted-foreground">{category}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${badgeColor}`}>{badge}</span>
        </div>
        <p className="text-sm font-semibold text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </div>
  );
}

function MiniCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-3.5 hover:border-primary/30 transition-colors cursor-pointer">
      <div className={`${color} mb-1.5`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-xs font-medium text-foreground leading-snug">{value}</p>
    </div>
  );
}

/* ────────────────────── My Trips Page ────────────────────── */

const TRIPS_DATA = {
  upcoming: [
    {
      id: 1,
      name: "Japan in Autumn",
      dates: "Oct 15 – Oct 18, 2025",
      status: "Upcoming",
      img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=300&fit=crop&auto=format",
    },
    {
      id: 2,
      name: "Seoul Adventure",
      dates: "Nov 3 – Nov 9, 2025",
      status: "Upcoming",
      img: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&h=300&fit=crop&auto=format",
    },
  ],
  saved: [
    {
      id: 3,
      name: "Singapore City Break",
      dates: "Dec 20 – Dec 24, 2025",
      status: "Saved",
      img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=300&fit=crop&auto=format",
    },
    {
      id: 4,
      name: "Thailand Beach Escape",
      dates: "Jan 5 – Jan 12, 2026",
      status: "Saved",
      img: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=600&h=300&fit=crop&auto=format",
    },
  ],
  completed: [
    {
      id: 5,
      name: "Da Nang Summer",
      dates: "Jun 10 – Jun 15, 2025",
      status: "Completed",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop&auto=format",
    },
    {
      id: 6,
      name: "Paris Weekend",
      dates: "Apr 3 – Apr 6, 2025",
      status: "Completed",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=300&fit=crop&auto=format",
    },
  ],
};

const STATUS_STYLES: Record<string, string> = {
  Upcoming: "bg-blue-50 text-primary",
  Saved: "bg-amber-50 text-amber-600",
  Completed: "bg-green-50 text-green-600",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  Upcoming: Timer,
  Saved: Bookmark,
  Completed: CheckCircle2,
};

function TripCard({ trip, onDelete }: { trip: typeof TRIPS_DATA.upcoming[0]; onDelete: (id: number) => void }) {
  const StatusIcon = STATUS_ICONS[trip.status];
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-sm transition-all duration-150 group">
      <div className="relative h-36 bg-muted">
        <img src={trip.img} alt={trip.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <button
          onClick={() => onDelete(trip.id)}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500 text-muted-foreground"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1.5">
          <h3 className="text-sm font-semibold text-foreground">{trip.name}</h3>
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${STATUS_STYLES[trip.status]}`}>
            <StatusIcon className="w-3 h-3" />
            {trip.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
          <CalendarDays className="w-3 h-3" />
          {trip.dates}
        </p>
        <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-secondary text-primary text-xs font-medium hover:bg-primary hover:text-white transition-colors duration-150">
          <ExternalLink className="w-3.5 h-3.5" />
          Open Trip
        </button>
      </div>
    </div>
  );
}

function MyTripsPage() {
  const [trips, setTrips] = useState(TRIPS_DATA);

  function deleteTrip(id: number) {
    setTrips((prev) => ({
      upcoming: prev.upcoming.filter((t) => t.id !== id),
      saved: prev.saved.filter((t) => t.id !== id),
      completed: prev.completed.filter((t) => t.id !== id),
    }));
  }

  const sections = [
    { label: "Upcoming Trips", key: "upcoming" as const, color: "text-primary" },
    { label: "Saved Trips", key: "saved" as const, color: "text-amber-500" },
    { label: "Completed Trips", key: "completed" as const, color: "text-green-600" },
  ];

  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">My Trips</h2>
        <p className="text-sm text-muted-foreground mt-0.5">All your travel plans in one place</p>
      </div>
      <div className="space-y-8">
        {sections.map(({ label, key, color }) => (
          <div key={key}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className={`text-sm font-semibold ${color}`}>{label}</h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {trips[key].length}
              </span>
            </div>
            {trips[key].length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-6 text-center text-sm text-muted-foreground">
                No trips here yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {trips[key].map((trip) => (
                  <TripCard key={trip.id} trip={trip} onDelete={deleteTrip} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────── Explore Page ────────────────────── */

const DESTINATIONS = [
  {
    id: 1,
    country: "Japan",
    desc: "Ancient temples, cherry blossoms, and world-class cuisine.",
    budget: "From $900",
    img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=340&fit=crop&auto=format",
    tag: "Culture",
  },
  {
    id: 2,
    country: "South Korea",
    desc: "K-culture, street food, and stunning mountain scenery.",
    budget: "From $750",
    img: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&h=340&fit=crop&auto=format",
    tag: "City",
  },
  {
    id: 3,
    country: "Singapore",
    desc: "A modern city-state blending cultures and cuisines.",
    budget: "From $650",
    img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=340&fit=crop&auto=format",
    tag: "Urban",
  },
  {
    id: 4,
    country: "Thailand",
    desc: "Tropical beaches, vibrant nightlife, and golden temples.",
    budget: "From $500",
    img: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=600&h=340&fit=crop&auto=format",
    tag: "Beach",
  },
  {
    id: 5,
    country: "Italy",
    desc: "Renaissance art, rolling hills, and legendary food.",
    budget: "From $1,100",
    img: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&h=340&fit=crop&auto=format",
    tag: "History",
  },
  {
    id: 6,
    country: "France",
    desc: "Fashion, fine dining, and the Eiffel Tower.",
    budget: "From $1,200",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=340&fit=crop&auto=format",
    tag: "Romance",
  },
];

function ExplorePage() {
  const [search, setSearch] = useState("");
  const filtered = DESTINATIONS.filter((d) =>
    d.country.toLowerCase().includes(search.toLowerCase()) ||
    d.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Explore</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Discover your next destination</p>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 mb-6 max-w-lg focus-within:border-primary transition-colors">
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search destinations..."
          className="flex-1 text-sm text-foreground bg-transparent outline-none placeholder:text-muted-foreground"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((dest) => (
          <div
            key={dest.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-sm transition-all duration-150 group"
          >
            <div className="relative h-44 bg-muted">
              <img src={dest.img} alt={dest.country} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-foreground">
                {dest.tag}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-base font-semibold text-foreground">{dest.country}</h3>
                <span className="text-xs font-medium text-accent">{dest.budget}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{dest.desc}</p>
              <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-secondary text-primary text-xs font-medium hover:bg-primary hover:text-white transition-colors duration-150">
                <Compass className="w-3.5 h-3.5" />
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No destinations match "{search}".
        </div>
      )}
    </div>
  );
}

/* ────────────────────── Favorites Page ────────────────────── */

const FAV_HOTELS = [
  { name: "Park Hyatt Tokyo", area: "Shinjuku, Japan", rating: 4.9 },
  { name: "The Shilla Seoul", area: "Jung-gu, South Korea", rating: 4.8 },
];
const FAV_RESTAURANTS = [
  { name: "Sukiyabashi Jiro", area: "Ginza, Tokyo", rating: 5.0 },
  { name: "Hawker Chan", area: "Chinatown, Singapore", rating: 4.7 },
];
const FAV_ATTRACTIONS = [
  { name: "Senso-ji Temple", area: "Asakusa, Tokyo", rating: 4.8 },
  { name: "Gyeongbokgung Palace", area: "Jongno-gu, Seoul", rating: 4.9 },
];
const FAV_TRIPS = [
  { name: "Japan in Autumn", area: "3 Days · Tokyo", rating: null },
  { name: "Seoul Adventure", area: "7 Days · Seoul", rating: null },
];

function FavSection({
  label,
  icon: Icon,
  iconColor,
  items,
  category,
}: {
  label: string;
  icon: React.ElementType;
  iconColor: string;
  items: { name: string; area: string; rating: number | null }[];
  category: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">{label}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 hover:shadow-sm transition-all duration-150 cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">{category}</p>
              <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.area}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {item.rating !== null && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium text-foreground">{item.rating.toFixed(1)}</span>
                </div>
              )}
              <button className="text-muted-foreground hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4 fill-red-400 text-red-400" />
              </button>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FavoritesPage() {
  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Favorites</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Your saved places and trips</p>
      </div>
      <div className="max-w-2xl space-y-6">
        <FavSection label="Favorite Hotels" icon={Hotel} iconColor="bg-blue-50 text-primary" items={FAV_HOTELS} category="Hotel" />
        <FavSection label="Favorite Restaurants" icon={Utensils} iconColor="bg-teal-50 text-accent" items={FAV_RESTAURANTS} category="Restaurant" />
        <FavSection label="Favorite Attractions" icon={Landmark} iconColor="bg-purple-50 text-purple-500" items={FAV_ATTRACTIONS} category="Attraction" />
        <FavSection label="Favorite Trips" icon={Plane} iconColor="bg-amber-50 text-amber-500" items={FAV_TRIPS} category="Trip" />
      </div>
    </div>
  );
}

/* ────────────────────── AI History Page ────────────────────── */

const HISTORY_ITEMS = [
  { id: 1, title: "Plan a 5-day Japan trip", date: "Today, 10:24 AM", preview: "Tokyo · Kyoto · Osaka itinerary with hotels..." },
  { id: 2, title: "Find cheap hotels in Tokyo", date: "Today, 9:05 AM", preview: "Budget options under $80/night in Shinjuku..." },
  { id: 3, title: "Translate English to Japanese", date: "Yesterday, 7:48 PM", preview: '"Where is the nearest station?" → "最寄り駅はどこですか？"' },
  { id: 4, title: "Find nearby ATM", date: "Yesterday, 3:12 PM", preview: "7-Eleven ATM at Shinjuku East Exit, 2 min walk..." },
  { id: 5, title: "Recommend sushi restaurants", date: "Oct 13, 11:30 AM", preview: "Top 5 sushi spots in Ginza under ¥5,000..." },
  { id: 6, title: "Seoul Adventure planning", date: "Oct 10, 2:15 PM", preview: "7-day itinerary · Gyeongbokgung · Myeongdong..." },
];

function AIHistoryPage() {
  const [deleted, setDeleted] = useState<number[]>([]);
  const visible = HISTORY_ITEMS.filter((h) => !deleted.includes(h.id));

  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">AI History</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Your previous conversations with AIO</p>
      </div>
      <div className="max-w-2xl space-y-2">
        {visible.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 hover:shadow-sm transition-all duration-150 group"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{item.preview}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.date}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-primary text-xs font-medium hover:bg-primary hover:text-white transition-colors">
                <MessageSquare className="w-3 h-3" />
                Continue
              </button>
              <button
                onClick={() => setDeleted((d) => [...d, item.id])}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground bg-card border border-border rounded-xl">
            No conversation history yet. Start a new trip with AIO!
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────── Settings Page ────────────────────── */

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      style={{ width: 40, height: 24 }}
      className={`relative rounded-full transition-colors duration-200 flex-shrink-0 flex items-center ${
        on ? "bg-primary" : "bg-slate-200"
      }`}
    >
      <span
        style={{
          width: 18,
          height: 18,
          transform: on ? "translateX(19px)" : "translateX(3px)",
        }}
        className="absolute rounded-full bg-white shadow-sm transition-transform duration-200"
      />
    </button>
  );
}

function SettingsRow({
  icon: Icon,
  iconColor,
  label,
  value,
  toggle,
  onToggle,
  select,
  selectOptions,
  onSelect,
}: {
  icon: React.ElementType;
  iconColor: string;
  label: string;
  value?: string;
  toggle?: boolean;
  onToggle?: () => void;
  select?: string;
  selectOptions?: string[];
  onSelect?: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-border last:border-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {value && <p className="text-xs text-muted-foreground mt-0.5">{value}</p>}
      </div>
      {toggle !== undefined && onToggle && (
        <Toggle on={toggle} onToggle={onToggle} />
      )}
      {select && selectOptions && onSelect && (
        <select
          value={select}
          onChange={(e) => onSelect(e.target.value)}
          className="text-xs font-medium text-foreground bg-muted border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-primary transition-colors cursor-pointer"
        >
          {selectOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      )}
    </div>
  );
}

function SettingsPage() {
  const [lang, setLang] = useState("English");
  const [currency, setCurrency] = useState("USD ($)");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [voice, setVoice] = useState(true);
  const [aiPref, setAiPref] = useState("Balanced");

  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your Travel One preferences</p>
      </div>

      <div className="max-w-xl space-y-4">
        {/* Preferences */}
        <div className="bg-card border border-border rounded-xl px-4 overflow-hidden">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-4 pb-1">Preferences</p>
          <SettingsRow
            icon={Globe}
            iconColor="bg-blue-50 text-primary"
            label="Language"
            select={lang}
            selectOptions={["English", "Vietnamese", "Japanese", "Korean", "French"]}
            onSelect={setLang}
          />
          <SettingsRow
            icon={CreditCard}
            iconColor="bg-teal-50 text-accent"
            label="Currency"
            select={currency}
            selectOptions={["USD ($)", "EUR (€)", "VND (₫)", "JPY (¥)", "SGD (S$)"]}
            onSelect={setCurrency}
          />
          <SettingsRow
            icon={Sun}
            iconColor="bg-amber-50 text-amber-500"
            label="Dark Mode"
            value="Switch to dark theme"
            toggle={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
        </div>

        {/* Notifications & Assistant */}
        <div className="bg-card border border-border rounded-xl px-4 overflow-hidden">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-4 pb-1">Assistant</p>
          <SettingsRow
            icon={Bell}
            iconColor="bg-purple-50 text-purple-500"
            label="Notifications"
            value="Trip reminders and AIO updates"
            toggle={notifications}
            onToggle={() => setNotifications(!notifications)}
          />
          <SettingsRow
            icon={Volume2}
            iconColor="bg-blue-50 text-primary"
            label="Voice Assistant"
            value="Enable AIO microphone input"
            toggle={voice}
            onToggle={() => setVoice(!voice)}
          />
          <SettingsRow
            icon={Sliders}
            iconColor="bg-teal-50 text-accent"
            label="AI Preferences"
            select={aiPref}
            selectOptions={["Balanced", "Budget-focused", "Luxury", "Adventure", "Family-friendly"]}
            onSelect={setAiPref}
          />
        </div>

        {/* Account */}
        <div className="bg-card border border-border rounded-xl px-4 overflow-hidden">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-4 pb-1">Account</p>
          <SettingsRow
            icon={User}
            iconColor="bg-blue-50 text-primary"
            label="Account"
            value="Nguyen Xuan Binh · Pro Plan"
          />
          <SettingsRow
            icon={Shield}
            iconColor="bg-green-50 text-green-600"
            label="Privacy"
            value="Data usage and permissions"
          />
        </div>

        {/* Danger zone */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Account Actions</p>
          <div className="flex gap-3">
            <button className="flex-1 py-2 rounded-xl text-xs font-medium border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              Export My Data
            </button>
            <button className="flex-1 py-2 rounded-xl text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
