import { useState, useCallback } from "react";

const A = "#004AAD";
const GRAD = `linear-gradient(135deg, #004AAD 0%, #0066DD 100%)`;
const BG = "linear-gradient(168deg, #060B18 0%, #0A1628 40%, #071020 100%)";

const REGIONS = [
  { id: "de", label: "Deutschland", icon: "🇩🇪" },
  { id: "at", label: "Österreich", icon: "🇦🇹" },
  { id: "ch", label: "Schweiz", icon: "🇨🇭" },
  { id: "uk", label: "England / UK", icon: "🇬🇧" },
  { id: "nl", label: "Niederlande", icon: "🇳🇱" },
  { id: "eu", label: "EU (gesamt)", icon: "🇪🇺" },
  { id: "ww", label: "Weltweit", icon: "🌍" },
];

const BACHELOR_FIELDS = [
  "Betriebswirtschaftslehre (BWL)", "Informatik", "Wirtschaftsinformatik", "Maschinenbau",
  "Psychologie", "Kommunikationswissenschaft", "Wirtschaftsingenieurwesen", "Rechtswissenschaften",
  "Biologie", "Politikwissenschaft", "Soziologie", "Elektrotechnik",
  "Medien- & Kommunikationsdesign", "Mathematik", "Volkswirtschaftslehre (VWL)", "Sonstiges",
];

// ─── Personality / Hobby / Interest swipe cards ─────────────────────
// Each card has tags that later influence which masters score higher
const SWIPE_CARDS = [
  { id: 1, title: "Rätsel & Knobeleien", desc: "Du liebst Sudoku, Escape Rooms oder logische Denksportaufgaben.", icon: "🧩", tags: ["analytisch", "logik", "problemlösung"] },
  { id: 2, title: "Natur & Umwelt", desc: "Du gehst gerne wandern, interessierst dich für Nachhaltigkeit oder Umweltschutz.", icon: "🌿", tags: ["nachhaltigkeit", "umwelt", "natur"] },
  { id: 3, title: "Menschen helfen", desc: "Ehrenamt, Beratung, Zuhören – du bist für andere da.", icon: "🤝", tags: ["sozial", "empathie", "beratung"] },
  { id: "ad1", title: "TU München", desc: "Entdecke 200+ Masterstudiengänge. Jetzt für 2026 bewerben!", icon: "🎓", tags: [], sponsored: true },
  { id: 4, title: "Technik & Gadgets", desc: "Neue Apps testen, Hardware basteln oder Smart-Home einrichten – dein Ding.", icon: "📱", tags: ["technik", "digital", "innovation"] },
  { id: 5, title: "Kreativ gestalten", desc: "Zeichnen, Fotografieren, Videos schneiden oder Design – du erschaffst gerne Neues.", icon: "🎨", tags: ["kreativ", "design", "visuell"] },
  { id: 6, title: "Daten & Zahlen", desc: "Statistiken lesen, Tabellen erstellen, Muster in Daten entdecken – das macht dir Spaß.", icon: "📊", tags: ["analytisch", "daten", "zahlen"] },
  { id: 7, title: "Sprachen & Kulturen", desc: "Du lernst gerne Sprachen, reist viel oder interessierst dich für andere Kulturen.", icon: "🌍", tags: ["international", "sprachen", "kultur"] },
  { id: "ad2", title: "StudyCheck", desc: "Vergleiche 24.000+ Studiengänge. Kostenlos & unabhängig!", icon: "✨", tags: [], sponsored: true },
  { id: 8, title: "Sport & Wettkampf", desc: "Ob Teamsport, Fitness oder E-Sport – du liebst den sportlichen Ehrgeiz.", icon: "⚽", tags: ["teamwork", "disziplin", "wettbewerb"] },
  { id: 9, title: "Lesen & Schreiben", desc: "Bücher verschlingen, Tagebuch führen, Blogartikel schreiben – Worte sind dein Werkzeug.", icon: "📖", tags: ["kommunikation", "text", "recherche"] },
  { id: 10, title: "Experimentieren", desc: "Im Labor stehen, Dinge ausprobieren, Hypothesen testen – Forschen begeistert dich.", icon: "🔬", tags: ["forschung", "wissenschaft", "neugier"] },
  { id: 11, title: "Organisieren & Planen", desc: "To-do-Listen, Events koordinieren, Projekte strukturieren – du hast den Überblick.", icon: "📋", tags: ["management", "struktur", "führung"] },
  { id: 12, title: "Musik & Ausdruck", desc: "Ein Instrument spielen, Playlists kuratieren oder selbst produzieren.", icon: "🎵", tags: ["kreativ", "ausdruck", "kultur"] },
  { id: 13, title: "Diskutieren & Debattieren", desc: "Politische Debatten, philosophische Fragen, Argumentieren – du liebst den Austausch.", icon: "💬", tags: ["kommunikation", "kritisch", "gesellschaft"] },
  { id: 14, title: "Tüfteln & Bauen", desc: "3D-Druck, Modellbau, Dinge reparieren – du arbeitest gerne mit den Händen.", icon: "🔧", tags: ["technik", "ingenieur", "praktisch"] },
  { id: 15, title: "Gaming & Strategie", desc: "Videospiele, Brettspiele, Strategiespiele – taktisches Denken ist deine Stärke.", icon: "🎮", tags: ["strategie", "logik", "digital"] },
];

// ─── Master programs with tag affinities ────────────────────────────
const PROGRAMS = [
  { id: 1, name: "M.Sc. Data Science & Machine Learning", uni: "Technische Universität Nordstadt", loc: "München, DE", basem: 70, tuition: "€ 350/Sem.", duration: "4 Semester", desc: "Statistisches Modellieren, Deep Learning und praxisnahe Industrieprojekte. Absolvent:innen werden von führenden Tech-Unternehmen rekrutiert.", rating: 4.8, nc: "2.3", tags: ["analytisch", "daten", "logik", "zahlen", "digital", "technik"] },
  { id: 2, name: "M.Sc. Nachhaltige Innovation", uni: "Grünfeld-Institut", loc: "Wien, AT", basem: 68, tuition: "€ 726/Sem.", duration: "3 Semester", desc: "Für Changemaker, die grüne Transformation in Wirtschaft und Politik vorantreiben wollen. Inklusive Praxissemester.", rating: 4.6, nc: "2.5", tags: ["nachhaltigkeit", "umwelt", "natur", "gesellschaft", "innovation"] },
  { id: 3, name: "M.A. Klinische Psychologie", uni: "Westlake Universität", loc: "Amsterdam, NL", basem: 67, tuition: "€ 2.200/Jahr", duration: "4 Semester", desc: "Wissenschaft von Geist und Verhalten durch experimentelle Forschung, Neuroimaging und klinische Praktika.", rating: 4.7, nc: "1.9", tags: ["sozial", "empathie", "beratung", "forschung", "wissenschaft"] },
  { id: 4, name: "MBA Strategic Management", uni: "Brückenmont Hochschule", loc: "München, DE", basem: 66, tuition: "€ 8.500/Jahr", duration: "2 Semester", desc: "Intensiver MBA: datengetriebene Strategie, Fintech und Unternehmertum mit starkem Alumni-Netzwerk.", rating: 4.5, nc: "2.1", tags: ["management", "struktur", "führung", "strategie", "wettbewerb", "zahlen"] },
  { id: 5, name: "M.Sc. Mensch-Computer-Interaktion", uni: "Elmsberg Tech", loc: "Stockholm, SE", basem: 65, tuition: "Gebührenfrei", duration: "4 Semester", desc: "Top-bewerteter HCI-Studiengang. UX-Forschung, Interaktionsdesign und Emerging Interfaces.", rating: 4.9, nc: "2.0", tags: ["kreativ", "design", "visuell", "digital", "technik", "innovation"] },
  { id: 6, name: "M.Sc. Cybersecurity", uni: "Eisenschild Universität", loc: "Zürich, CH", basem: 64, tuition: "CHF 1.500/Sem.", duration: "3 Semester", desc: "Ethisches Hacking, Kryptographie und Incident Response. Partnerschaften mit Cybersecurity-Firmen.", rating: 4.4, nc: "2.4", tags: ["technik", "logik", "problemlösung", "digital", "analytisch"] },
  { id: 7, name: "M.A. Internationale Beziehungen", uni: "Europa-Akademie Berlin", loc: "Berlin, DE", basem: 63, tuition: "€ 320/Sem.", duration: "4 Semester", desc: "Globale Diplomatie, Konfliktlösung und Politikanalyse mit Fokus auf die Europäische Union.", rating: 4.6, nc: "2.2", tags: ["international", "sprachen", "kultur", "gesellschaft", "kommunikation", "kritisch"] },
  { id: 8, name: "M.Sc. Biomedizintechnik", uni: "MedTech Hochschule Aachen", loc: "Aachen, DE", basem: 62, tuition: "€ 300/Sem.", duration: "4 Semester", desc: "Medizinprodukte, Tissue Engineering und Gesundheitstechnologie an der Schnittstelle von Technik und Medizin.", rating: 4.5, nc: "2.0", tags: ["forschung", "wissenschaft", "neugier", "technik", "ingenieur", "praktisch"] },
  { id: 9, name: "M.A. Journalismus & Medien", uni: "Medienhaus Hamburg", loc: "Hamburg, DE", basem: 61, tuition: "€ 400/Sem.", duration: "4 Semester", desc: "Investigativer Journalismus, digitale Medienproduktion und Storytelling für die Medienwelt von morgen.", rating: 4.3, nc: "2.3", tags: ["kommunikation", "text", "recherche", "kreativ", "ausdruck", "kultur"] },
  { id: 10, name: "M.Sc. Robotik & Autonome Systeme", uni: "TU Darmstadt", loc: "Darmstadt, DE", basem: 60, tuition: "€ 280/Sem.", duration: "4 Semester", desc: "Mechatronik, Computer Vision und autonome Systeme. Praxislabore mit modernster Robotertechnik.", rating: 4.7, nc: "1.8", tags: ["technik", "ingenieur", "praktisch", "logik", "innovation", "problemlösung"] },
];

const CATEGORIES = [
  { name: "Wirtschaft & Finanzen", icon: "💼", count: 342 },
  { name: "Technologie & IT", icon: "💻", count: 518 },
  { name: "Sozialwissenschaften", icon: "🏛️", count: 231 },
  { name: "Gesundheit & Medizin", icon: "🏥", count: 189 },
  { name: "Ingenieurwesen", icon: "⚙️", count: 407 },
  { name: "Kunst & Design", icon: "🎭", count: 156 },
  { name: "Naturwissenschaften", icon: "🔬", count: 274 },
  { name: "Recht & Politik", icon: "⚖️", count: 198 },
];

const FAQS = [
  { q: "Wie funktioniert das Matching?", a: "Unser Algorithmus erstellt ein Persönlichkeitsprofil aus deinen Hobbies und Interessen und kombiniert es mit deinem Bachelor und Notendurchschnitt, um die besten Masterstudiengänge zu finden." },
  { q: "Ist NextDegree kostenlos?", a: "Ja! Die Kernfunktionen sind kostenlos. Premium schaltet erweiterte Filter, unbegrenztes Speichern und werbefreie Nutzung frei." },
  { q: "Kann ich meine Angaben später ändern?", a: "Natürlich. Besuche dein Profil, um das Interessenquiz erneut zu starten oder deine Angaben anzupassen." },
  { q: "Welche Länder sind abgedeckt?", a: "Wir decken aktuell Studiengänge in über 35 Ländern ab – in Europa, Nordamerika, Asien und Ozeanien." },
];

const S = {
  phone: { width: 393, height: 852, borderRadius: 48, background: "#060B18", position: "relative", overflow: "hidden", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", color: "#fff", boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)" },
  btn: { padding: "16px 32px", borderRadius: 14, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", textAlign: "center", fontFamily: "inherit" },
  btnP: { background: GRAD, color: "#fff", width: "100%", boxShadow: `0 8px 32px ${A}55` },
  btnS: { background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", width: "100%" },
  card: { background: "rgba(255,255,255,0.05)", borderRadius: 18, border: "1px solid rgba(255,255,255,0.07)" },
};

// ─── Match calculation ──────────────────────────────────────────────
function calcMatches(likedCards, bachelorField, gradeVal) {
  const likedTags = {};
  likedCards.forEach(id => {
    const c = SWIPE_CARDS.find(s => s.id === id);
    if (c) c.tags.forEach(t => { likedTags[t] = (likedTags[t] || 0) + 1; });
  });
  const totalLikedTags = Object.values(likedTags).reduce((a, b) => a + b, 0) || 1;

  return PROGRAMS.map(p => {
    // Interest match (0-40 points)
    let tagOverlap = 0;
    p.tags.forEach(t => { if (likedTags[t]) tagOverlap += likedTags[t]; });
    const interestScore = Math.min(40, Math.round((tagOverlap / totalLikedTags) * 55));

    // Bachelor relevance (0-25 points) — simple heuristic
    const bLower = (bachelorField || "").toLowerCase();
    let bachelorScore = 10;
    const bMap = {
      "informatik": ["technik", "digital", "logik", "daten"],
      "bwl": ["management", "strategie", "führung", "zahlen"],
      "betriebswirtschaftslehre": ["management", "strategie", "führung", "zahlen"],
      "psychologie": ["sozial", "empathie", "beratung", "forschung"],
      "maschinenbau": ["technik", "ingenieur", "praktisch"],
      "elektrotechnik": ["technik", "ingenieur", "digital"],
      "wirtschaftsinformatik": ["technik", "digital", "management", "daten"],
      "wirtschaftsingenieurwesen": ["technik", "management", "ingenieur"],
      "biologie": ["forschung", "wissenschaft", "neugier", "natur"],
      "kommunikationswissenschaft": ["kommunikation", "text", "kreativ"],
      "medien": ["kreativ", "design", "kommunikation", "visuell"],
      "mathematik": ["analytisch", "logik", "zahlen"],
      "volkswirtschaftslehre": ["analytisch", "zahlen", "gesellschaft"],
      "politikwissenschaft": ["gesellschaft", "kritisch", "international"],
      "soziologie": ["sozial", "gesellschaft", "forschung"],
      "rechtswissenschaften": ["kritisch", "kommunikation", "gesellschaft"],
    };
    for (const [key, tags] of Object.entries(bMap)) {
      if (bLower.includes(key)) {
        const overlap = tags.filter(t => p.tags.includes(t)).length;
        bachelorScore = Math.min(25, Math.round((overlap / tags.length) * 25));
        break;
      }
    }

    // Grade score (0-20 points)
    const ncVal = parseFloat(p.nc);
    let gradeScore = gradeVal <= ncVal ? 20 : Math.max(0, 20 - Math.round((gradeVal - ncVal) * 12));

    // Base affinity (10-15 points)
    const base = 10 + Math.round(Math.random() * 5);

    const total = Math.min(99, interestScore + bachelorScore + gradeScore + base);
    return { ...p, match: total, _interest: interestScore, _bachelor: bachelorScore, _grade: gradeScore };
  }).sort((x, y) => y.match - x.match);
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [prevScreen, setPrevScreen] = useState(null);
  const [anim, setAnim] = useState(false);
  const [selProgram, setSelProgram] = useState(null);
  const [likes, setLikes] = useState([]);
  const [curCard, setCurCard] = useState(0);
  const [saved, setSaved] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadTxt, setLoadTxt] = useState("");
  const [swipeDir, setSwipeDir] = useState(null);
  const [expFaq, setExpFaq] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [onboardStep, setOnboardStep] = useState(0);
  const [selRegions, setSelRegions] = useState([]);
  const [bachelor, setBachelor] = useState("");
  const [bachelorSearch, setBachelorSearch] = useState("");
  const [grade, setGrade] = useState(2.0);
  const [matchedPrograms, setMatchedPrograms] = useState(PROGRAMS);

  const nav = useCallback((to) => {
    if (anim) return;
    setAnim(true);
    setPrevScreen(screen);
    setTimeout(() => { setScreen(to); setAnim(false); }, 200);
  }, [screen, anim]);

  const realCards = SWIPE_CARDS.filter(i => !i.sponsored);
  const currentReal = realCards.filter(r => SWIPE_CARDS.indexOf(r) <= curCard).length;

  const handleSwipe = (dir) => {
    setSwipeDir(dir);
    const card = SWIPE_CARDS[curCard];
    let newLikes = likes;
    if (dir === "right" && card && !card.sponsored) {
      newLikes = [...likes, card.id];
      setLikes(newLikes);
    }
    setTimeout(() => {
      setSwipeDir(null);
      if (curCard < SWIPE_CARDS.length - 1) setCurCard(p => p + 1);
      else {
        setLoading(true);
        setLoadTxt("Dein Persönlichkeitsprofil wird erstellt…");
        setTimeout(() => setLoadTxt("Abgleich mit deinem Bachelor & Notenschnitt…"), 1100);
        setTimeout(() => setLoadTxt("Passende Masterstudiengänge werden gesucht…"), 2200);
        setTimeout(() => {
          const results = calcMatches(newLikes, bachelor, grade);
          setMatchedPrograms(results);
          setLoading(false);
          nav("results");
        }, 3400);
      }
    }, 300);
  };

  const toggleSave = (id) => setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  // ─── Shared UI ──────────────────────────────────────────────────────
  const StatusBar = () => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px 0", fontSize: 13, fontWeight: 600, position: "relative", zIndex: 100 }}>
      <span>9:41</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="white"><rect x="0" y="5" width="3" height="7" rx="1"/><rect x="4.5" y="3" width="3" height="9" rx="1"/><rect x="9" y="1" width="3" height="11" rx="1"/><rect x="13" y="0" width="3" height="12" rx="1" opacity=".3"/></svg>
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none"><rect x=".5" y=".5" width="23" height="11" rx="3.5" stroke="white" strokeOpacity=".35"/><rect x="25" y="4" width="2" height="4.5" rx="1" fill="white" fillOpacity=".4"/><rect x="2" y="2" width="17" height="7.5" rx="2" fill={A}/></svg>
      </div>
    </div>
  );

  const TabBar = ({ active }) => (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(6,11,24,0.94)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-around", padding: "10px 0 34px", zIndex: 90 }}>
      {[{ id: "discover", label: "Entdecken", icon: "◇" }, { id: "explorer", label: "Erkunden", icon: "☰" }, { id: "results", label: "Matches", icon: "♡" }, { id: "profile", label: "Profil", icon: "●" }].map(t => (
        <button key={t.id} onClick={() => nav(t.id === "discover" ? (onboardStep >= 3 ? "swipe" : "onboard") : t.id)} style={{ background: "none", border: "none", color: active === t.id ? A : "rgba(255,255,255,0.35)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 10, fontWeight: 600, fontFamily: "inherit" }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>{t.icon}</span>{t.label}
        </button>
      ))}
    </div>
  );

  const NavH = ({ title, onBack, right }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 12px" }}>
      {onBack ? <button onClick={onBack} style={{ background: "none", border: "none", color: "#fff", fontSize: 24, cursor: "pointer", padding: 4 }}>‹</button> : <div style={{ width: 32 }}/>}
      <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>{title}</span>
      {right || <div style={{ width: 32 }}/>}
    </div>
  );

  const MBadge = ({ val, size = "sm" }) => {
    const bg = val >= 85 ? "#00875A" : val >= 70 ? A : val >= 55 ? "#E67E22" : "#95A5A6";
    const sz = size === "lg" ? { padding: "5px 14px", fontSize: 15, borderRadius: 10 } : { padding: "3px 10px", fontSize: 12, borderRadius: 8 };
    return <span style={{ ...sz, background: bg, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }}>{val}%</span>;
  };

  const ProgressBar = ({ value, total }) => (
    <div style={{ padding: "0 24px", marginBottom: 8 }}><div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}><div style={{ height: "100%", width: `${(value / total) * 100}%`, background: A, borderRadius: 4, transition: "width 0.4s" }}/></div></div>
  );

  // ─── Landing ────────────────────────────────────────────────────────
  const Landing = () => (
    <div style={{ height: "100%", background: BG, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "0 28px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -120, right: -120, width: 340, height: 340, borderRadius: "50%", background: `radial-gradient(circle, ${A}30 0%, transparent 70%)` }}/>
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, ${A}18 0%, transparent 70%)` }}/>
      <div style={{ paddingTop: 80, position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>Willkommen bei</div>
        <h1 style={{ fontSize: 44, fontWeight: 800, margin: 0, lineHeight: 1.05, letterSpacing: -1.5 }}>Next<span style={{ color: A }}>Degree</span></h1>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", marginTop: 16, lineHeight: 1.55 }}>Finde den perfekten Masterstudiengang — basierend auf deiner Persönlichkeit, deinem Bachelor und deinen Zielen.</p>
        <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
          {[{ e: "🧩", l: "Persönlichkeit" }, { e: "🎓", l: "Bachelor" }, { e: "🎯", l: "Matching" }].map((s, i) => (
            <div key={i} style={{ ...S.card, flex: 1, padding: "16px 10px", textAlign: "center" }}>
              <span style={{ fontSize: 26 }}>{s.e}</span>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 6, fontWeight: 600 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 28 }}>
          {[{ n: "10.000+", l: "Studiengänge" }, { n: "35+", l: "Länder" }, { n: "500K", l: "Nutzer:innen" }].map(s => (
            <div key={s.l}><div style={{ fontSize: 20, fontWeight: 800, color: A }}>{s.n}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.l}</div></div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 72, position: "relative", zIndex: 2 }}>
        <button onClick={() => { setOnboardStep(0); nav("onboard"); }} style={{ ...S.btn, ...S.btnP }}>Jetzt starten</button>
        <button onClick={() => nav("login")} style={{ ...S.btn, ...S.btnS }}>Ich habe bereits ein Konto</button>
      </div>
    </div>
  );

  // ─── Onboarding ─────────────────────────────────────────────────────
  const Onboard = () => {
    const toggleRegion = (id) => setSelRegions(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    const filteredB = BACHELOR_FIELDS.filter(b => b.toLowerCase().includes(bachelorSearch.toLowerCase()));
    const canNext = onboardStep === 0 ? selRegions.length > 0 : onboardStep === 1 ? bachelor !== "" : true;
    if (onboardStep >= 3) { nav("swipe"); return null; }

    return (
      <div style={{ height: "100%", background: BG, display: "flex", flexDirection: "column" }}>
        <NavH title="Profil erstellen" onBack={() => onboardStep === 0 ? nav("landing") : setOnboardStep(p => p - 1)} right={<span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>Schritt {onboardStep + 1}/3</span>}/>
        <ProgressBar value={onboardStep + 1} total={3}/>

        <div style={{ flex: 1, overflow: "auto", padding: "16px 24px 120px" }}>
          {onboardStep === 0 && (<>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>Wo möchtest du studieren?</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: "0 0 20px" }}>Wähle eine oder mehrere Regionen aus.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {REGIONS.map(r => { const sel = selRegions.includes(r.id); return (
                <button key={r.id} onClick={() => toggleRegion(r.id)} style={{ ...S.card, padding: "15px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", fontFamily: "inherit", border: sel ? `2px solid ${A}` : "1px solid rgba(255,255,255,0.07)", background: sel ? `${A}12` : "rgba(255,255,255,0.04)", transition: "all 0.15s" }}>
                  <span style={{ fontSize: 26 }}>{r.icon}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", flex: 1, textAlign: "left" }}>{r.label}</span>
                  <div style={{ width: 24, height: 24, borderRadius: 7, border: sel ? `2px solid ${A}` : "2px solid rgba(255,255,255,0.15)", background: sel ? A : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{sel && <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>✓</span>}</div>
                </button>
              ); })}
            </div>
          </>)}

          {onboardStep === 1 && (<>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>Dein Bachelorstudiengang?</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: "0 0 16px" }}>Welchen Bachelor hast du abgeschlossen oder studierst du gerade?</p>
            <div style={{ ...S.card, display: "flex", alignItems: "center", padding: "12px 16px", gap: 10, marginBottom: 14 }}>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>🔍</span>
              <input value={bachelorSearch} onChange={e => setBachelorSearch(e.target.value)} placeholder="Studiengang suchen…" style={{ background: "none", border: "none", outline: "none", color: "#fff", flex: 1, fontSize: 14, fontFamily: "inherit" }}/>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredB.map(b => { const sel = bachelor === b; return (
                <button key={b} onClick={() => setBachelor(b)} style={{ ...S.card, padding: "13px 16px", cursor: "pointer", fontFamily: "inherit", textAlign: "left", border: sel ? `2px solid ${A}` : "1px solid rgba(255,255,255,0.07)", background: sel ? `${A}12` : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: sel ? "#fff" : "rgba(255,255,255,0.7)" }}>{b}</span>
                  {sel && <span style={{ color: A, fontWeight: 800 }}>✓</span>}
                </button>
              ); })}
            </div>
          </>)}

          {onboardStep === 2 && (<>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>Dein Notendurchschnitt?</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: "0 0 36px" }}>Aktueller oder voraussichtlicher Schnitt deines Bachelors.</p>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 72, fontWeight: 800, color: A, lineHeight: 1 }}>{grade.toFixed(1)}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>{grade <= 1.5 ? "Sehr gut" : grade <= 2.5 ? "Gut" : grade <= 3.5 ? "Befriedigend" : "Ausreichend"}</div>
            </div>
            <div style={{ padding: "0 8px" }}>
              <input type="range" min="1.0" max="4.0" step="0.1" value={grade} onChange={e => setGrade(parseFloat(e.target.value))} style={{ width: "100%", accentColor: A, height: 6, cursor: "pointer" }}/>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.3)" }}><span>1,0 (Beste)</span><span>4,0</span></div>
            </div>
            <div style={{ ...S.card, padding: 16, marginTop: 28 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>💡 <strong style={{ color: "rgba(255,255,255,0.7)" }}>Hinweis:</strong> Dein Notenschnitt fließt in das Matching ein, um dir Studiengänge vorzuschlagen, deren NC zu deinem Profil passt.</div>
            </div>
          </>)}
        </div>

        <div style={{ position: "absolute", bottom: 40, left: 24, right: 24, zIndex: 50 }}>
          <button onClick={() => setOnboardStep(p => p + 1)} disabled={!canNext} style={{ ...S.btn, ...S.btnP, opacity: canNext ? 1 : 0.35, pointerEvents: canNext ? "auto" : "none" }}>
            {onboardStep === 2 ? "Persönlichkeitsquiz starten →" : "Weiter →"}
          </button>
        </div>
      </div>
    );
  };

  // ─── Swipe (Hobbies & Interests) ───────────────────────────────────
  const SwipeScreen = () => {
    const card = SWIPE_CARDS[curCard]; if (!card) return null;
    return (
      <div style={{ height: "100%", background: BG, display: "flex", flexDirection: "column" }}>
        <NavH title="Was begeistert dich?" onBack={() => { setOnboardStep(2); nav("onboard"); }} right={<span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>{currentReal}/{realCards.length}</span>}/>
        <ProgressBar value={currentReal} total={realCards.length}/>

        <div style={{ padding: "0 24px", marginBottom: 4 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0, textAlign: "center" }}>Swipe nach rechts, wenn es zu dir passt – nach links, wenn nicht.</p>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
          <div style={{ ...S.card, width: "100%", maxWidth: 340, padding: 0, overflow: "hidden", transform: swipeDir === "right" ? "translateX(120px) rotate(12deg)" : swipeDir === "left" ? "translateX(-120px) rotate(-12deg)" : "none", opacity: swipeDir ? 0.3 : 1, transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
            <div style={{ height: 180, background: card.sponsored ? "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))" : `linear-gradient(135deg, ${A}20 0%, ${A}08 100%)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <span style={{ fontSize: 64 }}>{card.icon}</span>
              {card.sponsored && <span style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.12)", padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 700 }}>ANZEIGE</span>}
              {swipeDir === "right" && <div style={{ position: "absolute", top: 20, left: 20, background: "#00875A", padding: "6px 16px", borderRadius: 10, fontSize: 14, fontWeight: 800, transform: "rotate(-12deg)" }}>PASST!</div>}
              {swipeDir === "left" && <div style={{ position: "absolute", top: 20, right: 20, background: "#D63031", padding: "6px 16px", borderRadius: 10, fontSize: 14, fontWeight: 800, transform: "rotate(12deg)" }}>NICHT SO</div>}
            </div>
            <div style={{ padding: "22px 22px 26px" }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{card.title}</h2>
              <p style={{ margin: "8px 0 0", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.55 }}>{card.desc}</p>
              {!card.sponsored && card.tags && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
                  {card.tags.slice(0, 3).map(t => <span key={t} style={{ padding: "4px 10px", borderRadius: 8, background: `${A}15`, border: `1px solid ${A}30`, fontSize: 11, fontWeight: 600, color: `${A}dd`, textTransform: "capitalize" }}>{t}</span>)}
                </div>
              )}
              {card.sponsored && <button style={{ ...S.btn, ...S.btnP, marginTop: 14, padding: "11px 24px", fontSize: 13 }}>Mehr erfahren →</button>}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 24, padding: "12px 0 110px" }}>
          <button onClick={() => handleSwipe("left")} style={{ width: 62, height: 62, borderRadius: "50%", border: "2px solid rgba(214,48,49,0.35)", background: "rgba(214,48,49,0.08)", color: "#D63031", fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          <button onClick={() => handleSwipe("right")} style={{ width: 62, height: 62, borderRadius: "50%", border: `2px solid ${A}55`, background: `${A}15`, color: A, fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>♥</button>
        </div>
        <TabBar active="discover"/>
      </div>
    );
  };

  const LoadingScreen = () => (
    <div style={{ height: "100%", background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
      <div style={{ width: 60, height: 60, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.08)", borderTopColor: A, animation: "spin .8s linear infinite" }}/>
      <div style={{ textAlign: "center" }}><p style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{loadTxt}</p><p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>Einen Moment bitte</p></div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ─── Results ────────────────────────────────────────────────────────
  const Results = () => (
    <div style={{ height: "100%", background: BG, display: "flex", flexDirection: "column" }}>
      <NavH title="Deine Matches" right={<button onClick={() => setFilterOpen(!filterOpen)} style={{ background: "none", border: "none", color: A, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Filter</button>}/>
      {filterOpen && <div style={{ padding: "0 20px 10px", display: "flex", gap: 8, flexWrap: "wrap" }}>{[selRegions.length > 0 ? REGIONS.filter(r => selRegions.includes(r.id)).map(r => r.icon).join(" ") : "Alle Regionen", `Ø ${grade.toFixed(1)}`, bachelor ? bachelor.split("(")[0].trim() : "Alle Bachelor"].map(f => <span key={f} style={{ padding: "6px 14px", borderRadius: 20, background: `${A}18`, border: `1px solid ${A}40`, fontSize: 11, fontWeight: 600, color: A }}>{f}</span>)}</div>}
      <div style={{ flex: 1, overflow: "auto", padding: "0 20px 120px" }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "4px 0 14px" }}>{matchedPrograms.length} Studiengänge passen zu deinem Profil</p>
        {matchedPrograms.map((p, i) => (
          <div key={p.id}>
            <button onClick={() => { setSelProgram(p); nav("detail"); }} style={{ ...S.card, width: "100%", padding: 16, marginBottom: 10, cursor: "pointer", textAlign: "left", fontFamily: "inherit", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: `${A}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 22 }}>🎓</span></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff" }}>{p.name}</h3>
                  <MBadge val={p.match}/>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{p.uni}</p>
                <div style={{ display: "flex", gap: 10, marginTop: 7, fontSize: 11, color: "rgba(255,255,255,0.3)" }}><span>📍 {p.loc}</span><span>💰 {p.tuition}</span><span>⏱ {p.duration}</span></div>
              </div>
            </button>
            {i === 1 && !isPremium && (
              <div style={{ ...S.card, padding: 14, marginBottom: 10, border: `1px solid ${A}25`, background: `${A}08` }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>ANZEIGE</span>
                <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 600 }}>🎓 QS World University Rankings 2026</p>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Entdecke die besten Universitäten weltweit.</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {!isPremium && <div style={{ position: "absolute", bottom: 88, left: 0, right: 0, padding: "9px 20px", background: "rgba(6,11,24,0.85)", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}><span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Anzeige · StudyCheck.de — 24.000+ Bewertungen</span></div>}
      <TabBar active="results"/>
    </div>
  );

  // ─── Detail ─────────────────────────────────────────────────────────
  const Detail = () => {
    const p = selProgram; if (!p) return null;
    const isSaved = saved.includes(p.id);
    // Build per-category breakdown
    const interestPct = Math.min(100, Math.round((p._interest || 20) * 2.5));
    const bachelorPct = Math.min(100, Math.round((p._bachelor || 12) * 4));
    const gradePct = Math.min(100, Math.round((p._grade || 10) * 5));
    const regionPct = selRegions.length === 0 ? 80 : (p.loc.includes("DE") && selRegions.includes("de")) || (p.loc.includes("AT") && selRegions.includes("at")) || (p.loc.includes("CH") && selRegions.includes("ch")) || (p.loc.includes("SE") && selRegions.includes("eu")) || (p.loc.includes("NL") && selRegions.includes("nl")) || selRegions.includes("ww") || selRegions.includes("eu") ? 95 : 40;

    return (
      <div style={{ height: "100%", background: BG, display: "flex", flexDirection: "column" }}>
        <NavH title="" onBack={() => nav(prevScreen === "explorer" ? "explorer" : "results")} right={<button onClick={() => toggleSave(p.id)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: isSaved ? A : "rgba(255,255,255,0.35)" }}>{isSaved ? "♥" : "♡"}</button>}/>
        <div style={{ flex: 1, overflow: "auto", padding: "0 24px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <MBadge val={p.match} size="lg"/>
            <span style={{ padding: "5px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}>★ {p.rating}</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{p.name}</h1>
          <p style={{ fontSize: 15, color: A, fontWeight: 600, margin: "8px 0 0" }}>{p.uni}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            {[{ icon: "📍", l: p.loc }, { icon: "💰", l: p.tuition }, { icon: "⏱", l: p.duration }, { icon: "📋", l: `NC: ${p.nc}` }].map(d => (
              <div key={d.l} style={{ ...S.card, padding: "10px 14px", display: "flex", alignItems: "center", gap: 7, fontSize: 13 }}><span>{d.icon}</span><span style={{ color: "rgba(255,255,255,0.65)" }}>{d.l}</span></div>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Über diesen Studiengang</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
          </div>

          {/* Match breakdown */}
          <div style={{ ...S.card, padding: 18, marginTop: 20, border: `1px solid ${A}30`, background: `${A}08` }}>
            <h4 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: A }}>Warum {p.match}% Match?</h4>
            {[
              { label: "🧩 Persönlichkeit & Interessen", val: interestPct },
              { label: "🎓 Bachelor-Passung", val: bachelorPct },
              { label: "📝 Notendurchschnitt vs. NC", val: gradePct },
              { label: "📍 Standort-Präferenz", val: regionPct },
            ].map(item => (
              <div key={item.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 5 }}>
                  <span>{item.label}</span><span style={{ fontWeight: 700, color: item.val >= 70 ? "#fff" : "#E67E22" }}>{Math.round(item.val)}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}>
                  <div style={{ height: "100%", width: `${item.val}%`, background: item.val >= 75 ? A : item.val >= 50 ? "#E67E22" : "#D63031", borderRadius: 4, transition: "width 0.6s ease" }}/>
                </div>
              </div>
            ))}
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "8px 0 0", lineHeight: 1.5 }}>Das Matching basiert auf deinen Hobby-Swipes, deinem Bachelor ({bachelor || "k.A."}), deinem Notenschnitt ({grade.toFixed(1)}) und deiner Standortwahl.</p>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Highlights</h3>
            {["Praxispartner & Pflichtpraktika", "Internationale Studierendenschaft", "Career Services & Alumni-Netzwerk", "Stipendienmöglichkeiten vorhanden"].map(h => (
              <div key={h} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: A, flexShrink: 0 }}/><span style={{ fontSize: 14, color: "rgba(255,255,255,0.55)" }}>{h}</span></div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <button style={{ ...S.btn, ...S.btnP, flex: 1 }}>Jetzt bewerben</button>
            <button onClick={() => toggleSave(p.id)} style={{ ...S.btn, ...S.btnS, flex: 1 }}>{isSaved ? "Gespeichert ♥" : "Speichern ♡"}</button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Explorer ───────────────────────────────────────────────────────
  const Explorer = () => (
    <div style={{ height: "100%", background: BG, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "8px 20px 0" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 14px" }}>Erkunden</h2>
        <div style={{ ...S.card, display: "flex", alignItems: "center", padding: "12px 16px", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>🔍</span>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Studiengänge, Universitäten suchen…" style={{ background: "none", border: "none", outline: "none", color: "#fff", flex: 1, fontSize: 14, fontFamily: "inherit" }}/>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "18px 20px 120px" }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>Kategorien</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
          {CATEGORIES.map(c => (
            <button key={c.name} style={{ ...S.card, padding: "16px 14px", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
              <span style={{ fontSize: 26 }}>{c.icon}</span>
              <h4 style={{ margin: "6px 0 2px", fontSize: 13, fontWeight: 700, color: "#fff" }}>{c.name}</h4>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{c.count} Studiengänge</span>
            </button>
          ))}
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>Im Trend</h3>
        {matchedPrograms.slice(0, 3).map(p => (
          <button key={p.id} onClick={() => { setSelProgram(p); nav("detail"); }} style={{ ...S.card, width: "100%", padding: 14, marginBottom: 8, cursor: "pointer", textAlign: "left", fontFamily: "inherit", display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${A}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🔥</div>
            <div style={{ flex: 1 }}><h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>{p.name}</h4><p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{p.uni}</p></div>
            <MBadge val={p.match}/>
          </button>
        ))}
      </div>
      <TabBar active="explorer"/>
    </div>
  );

  // ─── Profile ────────────────────────────────────────────────────────
  const Profile = () => {
    const likedInterests = SWIPE_CARDS.filter(c => likes.includes(c.id) && !c.sponsored);
    return (
      <div style={{ height: "100%", background: BG, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 24px 0" }}><h2 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Profil</h2></div>
        <div style={{ flex: 1, overflow: "auto", padding: "18px 24px 120px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 800 }}>A</div>
            <div><h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Alex Müller</h3><p style={{ margin: "2px 0 0", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>alex.mueller@email.com</p></div>
          </div>

          <div style={{ ...S.card, padding: 16, marginBottom: 16 }}>
            <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: .5, textTransform: "uppercase" }}>Dein Studienprofil</h4>
            {[{ l: "Bachelor", v: bachelor || "Nicht angegeben" }, { l: "Notendurchschnitt", v: grade.toFixed(1) }, { l: "Regionen", v: selRegions.map(r => REGIONS.find(x => x.id === r)?.icon).join(" ") || "—" }].map(r => (
              <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}><span style={{ color: "rgba(255,255,255,0.5)" }}>{r.l}</span><span style={{ fontWeight: 600 }}>{r.v}</span></div>
            ))}
          </div>

          <button onClick={() => nav("pricing")} style={{ ...S.card, width: "100%", padding: 16, marginBottom: 18, cursor: "pointer", textAlign: "left", fontFamily: "inherit", background: isPremium ? "rgba(0,135,90,0.08)" : `${A}08`, border: isPremium ? "1px solid rgba(0,135,90,0.2)" : `1px solid ${A}25` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><span style={{ fontSize: 12, fontWeight: 700, color: isPremium ? "#00875A" : A }}>{isPremium ? "✦ PREMIUM AKTIV" : "KOSTENLOSER PLAN"}</span><p style={{ margin: "4px 0 0", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{isPremium ? "Voller Zugriff" : "Upgrade für alle Funktionen"}</p></div>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 18 }}>›</span>
            </div>
          </button>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.4)", margin: "0 0 10px" }}>Dein Persönlichkeitsprofil</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {likedInterests.length > 0 ? likedInterests.map(i => (
              <span key={i.id} style={{ padding: "7px 12px", borderRadius: 10, background: `${A}18`, border: `1px solid ${A}35`, fontSize: 12, fontWeight: 600 }}>{i.icon} {i.title}</span>
            )) : <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Absolviere das Persönlichkeitsquiz</p>}
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.4)", margin: "0 0 10px" }}>Gespeicherte Studiengänge</h3>
          {saved.length > 0 ? matchedPrograms.filter(p => saved.includes(p.id)).map(p => (
            <div key={p.id} style={{ ...S.card, padding: 12, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{p.name}</p><p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{p.uni}</p></div>
              <MBadge val={p.match}/>
            </div>
          )) : <div style={{ textAlign: "center", padding: "20px 0" }}><p style={{ fontSize: 32, margin: "0 0 6px" }}>📚</p><p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", margin: 0 }}>Noch keine gespeicherten Studiengänge</p></div>}

          <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.4)", margin: "20px 0 10px" }}>Einstellungen</h3>
          {["Benachrichtigungen", "Datenschutz", "Über NextDegree", "Hilfe & Support"].map(s => (
            <button key={s} onClick={s === "Über NextDegree" ? () => nav("about") : undefined} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "13px 0", background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", fontFamily: "inherit" }}>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{s}</span><span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
            </button>
          ))}
          <button onClick={() => nav("landing")} style={{ ...S.btn, background: "rgba(214,48,49,0.08)", color: "#D63031", border: "1px solid rgba(214,48,49,0.2)", width: "100%", marginTop: 20 }}>Abmelden</button>
        </div>
        <TabBar active="profile"/>
      </div>
    );
  };

  // ─── Pricing ────────────────────────────────────────────────────────
  const Pricing = () => (
    <div style={{ height: "100%", background: BG, display: "flex", flexDirection: "column" }}>
      <NavH title="Premium werden" onBack={() => nav("profile")}/>
      <div style={{ flex: 1, overflow: "auto", padding: "0 24px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}><span style={{ fontSize: 44 }}>✦</span><h2 style={{ fontSize: 26, fontWeight: 800, margin: "8px 0 4px" }}>Alles freischalten</h2><p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0 }}>Finde deinen Traumstudiengang – schneller</p></div>
        {[
          { name: "Kostenlos", price: "€0", features: ["Persönlichkeitsquiz", "5 Studiengang-Matches", "Basis-Filter", "Werbung enthalten"], active: !isPremium, cta: false },
          { name: "Premium", price: "€3,99", features: ["Unbegrenztes Swipen", "Alle Studiengang-Matches", "Erweiterte Filter & Sortierung", "Unbegrenzt Favoriten speichern", "Keine Werbung"], active: isPremium, cta: true },
        ].map(plan => (
          <div key={plan.name} style={{ ...S.card, padding: 22, marginBottom: 14, border: plan.cta ? `1px solid ${A}50` : "1px solid rgba(255,255,255,0.07)", background: plan.cta ? `${A}08` : "rgba(255,255,255,0.03)", position: "relative", overflow: "hidden" }}>
            {plan.cta && <div style={{ position: "absolute", top: 12, right: -28, background: GRAD, padding: "4px 36px", fontSize: 10, fontWeight: 800, transform: "rotate(45deg)" }}>EMPFOHLEN</div>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}><h3 style={{ margin: 0, fontSize: 19, fontWeight: 800 }}>{plan.name}</h3><div><span style={{ fontSize: 26, fontWeight: 800 }}>{plan.price}</span>{plan.cta && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}> einmalig</span>}</div></div>
            {plan.features.map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}><span style={{ color: plan.cta ? A : "rgba(255,255,255,0.25)", fontSize: 13 }}>✓</span><span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{f}</span></div>)}
            {plan.cta && !isPremium && <button onClick={() => setShowUpgrade(true)} style={{ ...S.btn, ...S.btnP, marginTop: 14 }}>Für €3,99 upgraden</button>}
            {plan.active && <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: "#00875A", textAlign: "center" }}>✓ Aktueller Plan</div>}
          </div>
        ))}
      </div>
      {showUpgrade && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}><div style={{ ...S.card, padding: 28, maxWidth: 320, textAlign: "center", background: "#0D1525" }}><span style={{ fontSize: 44 }}>🎉</span><h3 style={{ fontSize: 22, fontWeight: 800, margin: "12px 0 8px" }}>Willkommen bei Premium!</h3><p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 0 24px", lineHeight: 1.5 }}>Voller Zugriff auf alle Funktionen. Viel Erfolg!</p><button onClick={() => { setIsPremium(true); setShowUpgrade(false); }} style={{ ...S.btn, ...S.btnP }}>Weiter</button></div></div>}
    </div>
  );

  // ─── Login ──────────────────────────────────────────────────────────
  const Login = () => (
    <div style={{ height: "100%", background: BG, display: "flex", flexDirection: "column" }}>
      <NavH title="" onBack={() => nav("landing")}/>
      <div style={{ flex: 1, padding: "20px 28px", display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 6px" }}>Willkommen zurück</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: "0 0 28px" }}>Melde dich an, um fortzufahren</p>
        {["Mit Google fortfahren", "Mit Apple fortfahren"].map(b => <button key={b} onClick={() => { setOnboardStep(0); nav("onboard"); }} style={{ ...S.btn, ...S.btnS, marginBottom: 10 }}>{b}</button>)}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "18px 0" }}><div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}/><span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>oder</span><div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}/></div>
        {["E-Mail-Adresse", "Passwort"].map((l, i) => <div key={l} style={{ marginBottom: 14 }}><label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)", display: "block", marginBottom: 6 }}>{l}</label><input type={i === 1 ? "password" : "email"} placeholder={i === 0 ? "du@beispiel.de" : "••••••••"} style={{ width: "100%", boxSizing: "border-box", padding: "13px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none" }}/></div>)}
        <button style={{ background: "none", border: "none", color: A, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "right", marginBottom: 20, fontFamily: "inherit" }}>Passwort vergessen?</button>
        <button onClick={() => { setOnboardStep(0); nav("onboard"); }} style={{ ...S.btn, ...S.btnP }}>Anmelden</button>
        <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Noch kein Konto? <button onClick={() => { setOnboardStep(0); nav("onboard"); }} style={{ background: "none", border: "none", color: A, fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Registrieren</button></p>
      </div>
    </div>
  );

  // ─── About ──────────────────────────────────────────────────────────
  const About = () => (
    <div style={{ height: "100%", background: BG, display: "flex", flexDirection: "column" }}>
      <NavH title="Über uns" onBack={() => nav("profile")}/>
      <div style={{ flex: 1, overflow: "auto", padding: "0 24px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 8px" }}>Next<span style={{ color: A }}>Degree</span></h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.55, margin: 0 }}>Wir helfen Studierenden, den passenden Master zu finden — basierend auf Persönlichkeit, Interessen und akademischem Profil.</p>
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>Unser Team</h3>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[{ name: "Sarah L.", role: "CEO", color: A }, { name: "Max R.", role: "CTO", color: "#0066DD" }, { name: "Lina K.", role: "Design", color: "#E84393" }].map(m => (
            <div key={m.name} style={{ ...S.card, flex: 1, padding: 14, textAlign: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${m.color}28`, margin: "0 auto 6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: m.color }}>{m.name[0]}</div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700 }}>{m.name}</p><p style={{ margin: "2px 0 0", fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{m.role}</p>
            </div>
          ))}
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>Kontakt</h3>
        <div style={{ ...S.card, padding: 18, marginBottom: 20 }}>
          {["Dein Name", "E-Mail-Adresse", "Nachricht"].map((l, i) => <div key={l} style={{ marginBottom: 12 }}><input placeholder={l} style={{ width: "100%", boxSizing: "border-box", padding: i === 2 ? "12px 14px 44px" : "11px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }}/></div>)}
          <button style={{ ...S.btn, ...S.btnP, fontSize: 13 }}>Nachricht senden</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
          {["Twitter", "LinkedIn", "Instagram"].map(s => <span key={s} style={{ padding: "7px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>{s}</span>)}
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>Häufige Fragen</h3>
        {FAQS.map((f, i) => (
          <button key={i} onClick={() => setExpFaq(expFaq === i ? null : i)} style={{ ...S.card, width: "100%", padding: "14px 16px", marginBottom: 8, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{f.q}</span><span style={{ color: "rgba(255,255,255,0.25)", transform: expFaq === i ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</span></div>
            {expFaq === i && <p style={{ margin: "8px 0 0", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.55 }}>{f.a}</p>}
          </button>
        ))}
      </div>
    </div>
  );

  const screens = { landing: Landing, onboard: Onboard, swipe: SwipeScreen, results: Results, detail: Detail, explorer: Explorer, profile: Profile, pricing: Pricing, login: Login, about: About };
  const Cur = loading ? LoadingScreen : (screens[screen] || Landing);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", padding: 20 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <div style={S.phone}>
        <StatusBar/>
        <div style={{ height: "calc(100% - 32px)", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, opacity: anim ? 0 : 1, transform: anim ? "scale(0.97)" : "scale(1)", transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)" }}><Cur/></div>
        </div>
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 134, height: 5, borderRadius: 100, background: "rgba(255,255,255,0.25)", zIndex: 200 }}/>
      </div>
    </div>
  );
}
