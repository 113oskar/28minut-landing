import { useState, useEffect, useRef } from "react";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const PINK      = "#FF2F92";
const PINK_SOFT = "#FF6BB5";
const PINK_GLOW = "rgba(255,47,146,0.16)";
const DARK      = "#0a0a0a";
const MID_GRAY  = "#6b7280";
const SURFACE   = "#f7f6f4";

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #fff;
    color: ${DARK};
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  html { scroll-behavior: smooth; }

  /* ── Scroll reveal ── */
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1),
                transform 0.75s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* ── Navbar ── */
  .navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 200;
    padding: 0 40px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease;
    border-bottom: 1px solid transparent;
  }
  .navbar.scrolled {
    background: rgba(255,255,255,0.86);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-color: rgba(0,0,0,0.07);
  }
  @media (max-width: 640px) { .navbar { padding: 0 20px; } }

  /* ── Pill tag ── */
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 5px 14px;
    border-radius: 100px;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.055em;
    text-transform: uppercase;
  }
  .pill-pink  { background: rgba(255,47,146,0.09); color: ${PINK}; }
  .pill-light { background: rgba(255,47,146,0.15); color: #FF88C2; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 100px;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
    cursor: pointer;
    text-decoration: none;
    border: none;
    transition: transform 0.28s cubic-bezier(0.16,1,0.3,1),
                box-shadow 0.28s ease,
                background 0.2s ease;
    white-space: nowrap;
  }
  .btn-fill {
    background: ${PINK};
    color: #fff;
    padding: 15px 30px;
    box-shadow: 0 4px 20px ${PINK_GLOW};
  }
  .btn-fill:hover {
    background: ${PINK_SOFT};
    transform: translateY(-2px);
    box-shadow: 0 10px 32px rgba(255,47,146,0.28);
  }
  .btn-fill.lg { padding: 18px 38px; font-size: 16px; }

  .btn-outline-white {
    background: rgba(255,255,255,0.1);
    color: #fff;
    padding: 14px 26px;
    border: 1px solid rgba(255,255,255,0.28);
    backdrop-filter: blur(8px);
  }
  .btn-outline-white:hover {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.48);
    transform: translateY(-2px);
  }

  .btn-outline-dark {
    background: transparent;
    color: ${DARK};
    padding: 14px 26px;
    border: 1.5px solid rgba(0,0,0,0.2);
  }
  .btn-outline-dark:hover {
    border-color: ${PINK};
    color: ${PINK};
    transform: translateY(-2px);
  }

  /* ── Gradient text ── */
  .grad {
    background: linear-gradient(130deg, ${PINK} 0%, #c026d3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Card ── */
  .card {
    background: #fff;
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 22px;
    padding: 30px 26px;
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1),
                box-shadow 0.35s ease,
                border-color 0.3s ease;
  }
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 56px rgba(0,0,0,0.07);
    border-color: rgba(255,47,146,0.22);
  }

  /* ── Hero ── */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 110px 24px 80px;
    background: linear-gradient(165deg, #080808 0%, #160810 55%, #0c0814 100%);
    position: relative;
    overflow: hidden;
  }
  .hero-glow-a {
    position: absolute; top: -160px; right: -160px;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(255,47,146,0.11) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-glow-b {
    position: absolute; bottom: -80px; left: -80px;
    width: 440px; height: 440px;
    background: radial-gradient(circle, rgba(160,0,240,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 64px 64px;
    pointer-events: none;
  }

  /* ── Brand bridge ── */
  .brand-bridge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  .brand-chip {
    border-radius: 18px;
    padding: 24px 36px;
    text-align: center;
  }
  .brand-chip-dark {
    background: ${DARK};
    box-shadow: 0 16px 48px rgba(0,0,0,0.18);
  }
  .brand-chip-pink {
    background: linear-gradient(135deg, ${PINK} 0%, #c026d3 100%);
    box-shadow: 0 16px 48px rgba(255,47,146,0.22);
  }

  /* ── Arrow pulse ── */
  .arrow-pulse {
    animation: ap 2.2s ease-in-out infinite;
  }
  @keyframes ap {
    0%, 100% { transform: translateX(0); opacity: 0.65; }
    50%       { transform: translateX(7px); opacity: 1; }
  }

  /* ── Scroll caret ── */
  .scroll-caret {
    animation: sc 2.8s ease-in-out infinite;
  }
  @keyframes sc {
    0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.4; }
    50%       { transform: translateX(-50%) translateY(6px); opacity: 0.7; }
  }

  /* ── Final CTA bg ── */
  .final-bg {
    background: linear-gradient(165deg, #080808 0%, #1a0810 60%, #080808 100%);
    position: relative;
    overflow: hidden;
  }
  .final-bg::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 55% 45%, rgba(255,47,146,0.13) 0%, transparent 58%);
    pointer-events: none;
  }

  /* ── Section divider line ── */
  .div-line {
    width: 36px; height: 2px;
    background: ${PINK};
    border-radius: 2px;
    margin: 14px auto 0;
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .hero-h1 { font-size: clamp(30px, 9vw, 52px) !important; }
    .section-h  { font-size: clamp(26px, 7vw, 40px) !important; }
    .brand-chip { padding: 18px 24px; }
  }

  /* ── Icon circle ── */
  .icon-circle {
    width: 48px; height: 48px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* ── Stat ── */
  .stat-block { text-align: center; }
  .stat-n { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.04em; }
  .stat-l { font-size: 11px; color: rgba(255,255,255,0.32); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 2px; }

  /* ── Notice bar ── */
  .notice-bar {
    background: rgba(255,47,146,0.06);
    border: 1px solid rgba(255,47,146,0.14);
    border-radius: 14px;
    padding: 14px 20px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    text-align: left;
    max-width: 640px;
    margin: 0 auto;
  }
`;

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = {
  brandTag: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  ),
  lightning: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  users: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  sparkles: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/>
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  chevronDown: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  info: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  check: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  instagram: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  facebook: (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{
          display: "inline-block", width: 7, height: 7, borderRadius: "50%",
          background: PINK, boxShadow: `0 0 10px ${PINK}`,
        }} />
        <span style={{
          fontWeight: 800, fontSize: 15.5, letterSpacing: "-0.03em",
          color: scrolled ? DARK : "#fff",
          transition: "color 0.3s",
        }}>
          28minut<span style={{ color: PINK }}>.pl</span>
        </span>
      </div>

      {/* Nav CTA */}
      <a
        href="https://modelarniafitness.pl/trening-ems"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          background: PINK,
          color: "#fff",
          borderRadius: 100,
          padding: "9px 20px",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          textDecoration: "none",
          boxShadow: `0 2px 14px ${PINK_GLOW}`,
          transition: "transform 0.25s, background 0.2s",
          display: "flex", alignItems: "center", gap: 6,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = PINK_SOFT; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = PINK; e.currentTarget.style.transform = ""; }}
      >
        Trening EMS w Modelarni {Icon.arrowRight}
      </a>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useReveal();
  return (
    <section className="hero">
      <div className="hero-glow-a" />
      <div className="hero-glow-b" />
      <div className="hero-grid" />

      {/* Floating notice */}
      <div className="reveal visible" style={{ marginBottom: 28, position: "relative", zIndex: 1 }}>
        <span className="pill pill-light" style={{ gap: 6 }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#FF88C2", display: "inline-block",
            boxShadow: "0 0 8px #FF88C2",
          }} />
          Ważna informacja dla naszych klientek
        </span>
      </div>

      {/* Main content */}
      <div ref={ref} className="reveal" style={{ maxWidth: 780, position: "relative", zIndex: 1 }}>
        <h1
          className="hero-h1"
          style={{
            fontSize: "clamp(36px, 5.5vw, 68px)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
            color: "#fff",
            marginBottom: 22,
          }}
        >
          28minut jest teraz{" "}
          <br />
          <span className="grad">częścią Modelarni</span>
        </h1>

        <p style={{
          fontSize: "clamp(16px, 1.8vw, 19px)",
          color: "rgba(255,255,255,0.62)",
          lineHeight: 1.75,
          maxWidth: 560,
          margin: "0 auto 18px",
        }}>
          Trening EMS, który znasz, działa dalej — teraz w nowej odsłonie,
          w kobiecej przestrzeni Modelarni.
        </p>

        {/* Notice bar */}
        <div className="notice-bar" style={{ marginBottom: 40 }}>
          <span style={{ color: PINK, flexShrink: 0, marginTop: 1 }}>{Icon.info}</span>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
            Studio 28minut nie znikło — <strong style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>zmieniło markę</strong> i dołączyło do Modelarni.
            Wszystko, co znałaś, nadal istnieje — teraz pod nowym szyldem.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://modelarniafitness.pl/trening-ems"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-fill"
          >
            Przejdź do treningu EMS w Modelarni {Icon.arrowRight}
          </a>
          <a href="#co-sie-zmienia" className="btn btn-outline-white">
            Dowiedz się, co się zmieniło
          </a>
        </div>
      </div>

      {/* Scroll caret */}
      <div className="scroll-caret" style={{
        position: "absolute", bottom: 30, left: "50%",
        transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        opacity: 0.4, zIndex: 1,
      }}>
        <span style={{ fontSize: 10.5, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Przewiń
        </span>
        {Icon.chevronDown}
      </div>
    </section>
  );
}

// ─── CO SIĘ ZMIENIA ───────────────────────────────────────────────────────────
const changes = [
  {
    icon: Icon.brandTag,
    color: PINK,
    bg: "rgba(255,47,146,0.08)",
    title: "Nowa marka",
    text: "Studio 28minut działa teraz pod marką Modelarnia.",
    note: null,
  },
  {
    icon: Icon.lightning,
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    title: "Ta sama usługa EMS",
    text: "Trening elektrostymulacyjny EMS nadal jest dostępny — teraz jako część szerszej oferty Modelarni.",
    note: null,
  },
  {
    icon: Icon.users,
    color: "#0ea5e9",
    bg: "rgba(14,165,233,0.08)",
    title: "Tylko dla kobiet",
    text: "Modelarnia to przestrzeń treningu, regeneracji i ruchu stworzona dla kobiet.",
    note: null,
  },
  {
    icon: Icon.sparkles,
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    title: "Więcej możliwości",
    text: "Poza EMS możesz skorzystać także z siłowni, zajęć grupowych, regeneracji i opieki trenerek.",
    note: null,
  },
];

function ChangesSection() {
  const headRef = useReveal();
  return (
    <section
      id="co-sie-zmienia"
      style={{ padding: "96px 24px", background: SURFACE }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        {/* Head */}
        <div ref={headRef} className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="pill pill-pink">Co się zmienia?</span>
          <h2
            className="section-h"
            style={{
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              marginTop: 18,
              marginBottom: 12,
            }}
          >
            Zmiana nazwy, nie filozofii.
          </h2>
          <div className="div-line" />
          <p style={{
            marginTop: 22, color: MID_GRAY, fontSize: 17, lineHeight: 1.75,
            maxWidth: 500, margin: "22px auto 0",
          }}>
            Studio 28minut ewoluuje — nie znika. Poniżej wyjaśniamy, co dokładnie się zmienia.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 18,
        }}>
          {changes.map((c, i) => (
            <ChangeCard key={i} {...c} delay={i * 70} />
          ))}
        </div>

        {/* Continuity note */}
        <ContinuityNote />
      </div>
    </section>
  );
}

function ChangeCard({ icon, color, bg, title, text, delay }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal card" style={{ transitionDelay: `${delay}ms` }}>
      <div className="icon-circle" style={{ background: bg, color, marginBottom: 18 }}>
        {icon}
      </div>
      <h3 style={{
        fontWeight: 700, fontSize: 16, letterSpacing: "-0.025em", marginBottom: 10,
      }}>
        {title}
      </h3>
      <p style={{ color: MID_GRAY, fontSize: 14.5, lineHeight: 1.72 }}>
        {text}
      </p>
    </div>
  );
}

function ContinuityNote() {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ marginTop: 40 }}>
      <div style={{
        background: "#fff",
        border: `1px solid rgba(255,47,146,0.18)`,
        borderRadius: 18,
        padding: "22px 28px",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        maxWidth: 680,
        margin: "0 auto",
      }}>
        <span style={{ color: PINK, flexShrink: 0, marginTop: 1 }}>{Icon.check}</span>
        <p style={{ fontSize: 14.5, color: "#444", lineHeight: 1.7 }}>
          <strong style={{ color: DARK, fontWeight: 600 }}>Dobre wieści:</strong>{" "}
          jeśli byłaś klientką 28minut.pl, Twoje przyzwyczajenia, trenerki i podejście do treningu
          pozostają bez zmian. Zmieniamy tylko markę i otwieramy się na więcej.
        </p>
      </div>
    </div>
  );
}

// ─── BRAND BRIDGE ─────────────────────────────────────────────────────────────
function BrandBridgeSection() {
  const headRef = useReveal();
  const bridgeRef = useReveal();

  return (
    <section style={{ padding: "96px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div ref={headRef} className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="pill pill-pink">Nasza historia</span>
          <h2
            className="section-h"
            style={{
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              marginTop: 18,
              marginBottom: 12,
            }}
          >
            Jedno studio. Dwie ery.
          </h2>
          <div className="div-line" />
          <p style={{
            marginTop: 22, color: MID_GRAY, fontSize: 17, lineHeight: 1.75,
            maxWidth: 480, margin: "22px auto 0",
          }}>
            Wszystko, co zbudowałyśmy przez lata, staje się fundamentem Modelarni.
          </p>
        </div>

        {/* Brand chips */}
        <div ref={bridgeRef} className="reveal brand-bridge">
          {/* 28minut chip */}
          <div className="brand-chip brand-chip-dark">
            <div style={{
              fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.32)", marginBottom: 8,
            }}>
              Pierwotna marka
            </div>
            <div style={{
              fontSize: 30, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff",
            }}>
              28<span style={{ color: PINK }}>minut</span>
            </div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
              Studio EMS
            </div>
          </div>

          {/* Arrow */}
          <div className="arrow-pulse" style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          }}>
            <span style={{
              fontSize: 10.5, color: MID_GRAY, letterSpacing: "0.1em",
              textTransform: "uppercase", whiteSpace: "nowrap",
            }}>
              kontynuuje jako
            </span>
            <svg width="52" height="16" viewBox="0 0 52 16" fill="none">
              <path
                d="M0 8 H42 M34 2 L42 8 L34 14"
                stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Modelarnia chip */}
          <div className="brand-chip brand-chip-pink">
            <div style={{
              fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)", marginBottom: 8,
            }}>
              Nowa marka
            </div>
            <div style={{
              fontSize: 30, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff",
            }}>
              Modelarnia
            </div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
              EMS & Fitness dla kobiet
            </div>
          </div>
        </div>

        {/* Timeline */}
        <BrandTimeline />
      </div>
    </section>
  );
}

const timeline = [
  { year: "Początki", label: "Narodziny 28minut.pl", text: "Pierwsze studio EMS dedykowane kobietom. Nowe podejście do treningu w 28 minut." },
  { year: "Wzrost",   label: "Zaufanie setek kobiet",  text: "Lata efektywnych treningów, certyfikowane trenerki i sprawdzona metoda EMS." },
  { year: "2024",     label: "Dołączenie do Modelarni", text: "Studio 28minut zmienia markę i wchodzi w skład Modelarni — kobiecego ekosystemu fitness." },
  { year: "Dziś",    label: "Modelarnia EMS",          text: "Pełna oferta: EMS, siłownia, zajęcia grupowe, regeneracja. Ten sam poziom, więcej możliwości." },
];

function BrandTimeline() {
  return (
    <div style={{ marginTop: 72 }}>
      {timeline.map((item, i) => (
        <TimelineRow key={i} {...item} delay={i * 80} last={i === timeline.length - 1} />
      ))}
    </div>
  );
}

function TimelineRow({ year, label, text, delay, last }) {
  const ref = useReveal();
  const isEven = timeline.findIndex(t => t.label === label) % 2 === 0;

  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 48px 1fr",
        gap: 20,
        marginBottom: last ? 0 : 40,
        transitionDelay: `${delay}ms`,
        alignItems: "flex-start",
      }}
    >
      {/* Left */}
      <div style={{ textAlign: "right", paddingTop: 2, ...(isEven ? {} : { opacity: 0, pointerEvents: "none" }) }}>
        {isEven && <TlContent year={year} label={label} text={text} align="right" />}
      </div>

      {/* Center spine */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 13, height: 13, borderRadius: "50%",
          background: PINK,
          boxShadow: `0 0 0 4px rgba(255,47,146,0.14)`,
          flexShrink: 0,
          marginTop: 4,
        }} />
        {!last && (
          <div style={{
            width: 1, flexGrow: 1, minHeight: 40,
            background: "rgba(255,47,146,0.18)",
            marginTop: 8,
          }} />
        )}
      </div>

      {/* Right */}
      <div style={{ paddingTop: 2, ...(!isEven ? {} : { opacity: 0, pointerEvents: "none" }) }}>
        {!isEven && <TlContent year={year} label={label} text={text} align="left" />}
      </div>
    </div>
  );
}

function TlContent({ year, label, text, align }) {
  return (
    <div style={{ textAlign: align }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: PINK, letterSpacing: "0.05em" }}>
        {year}
      </span>
      <h4 style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em", margin: "4px 0 7px" }}>
        {label}
      </h4>
      <p style={{ color: MID_GRAY, fontSize: 13.5, lineHeight: 1.7 }}>{text}</p>
    </div>
  );
}

// ─── WHAT IS MODELARNIA ───────────────────────────────────────────────────────
const features = [
  { emoji: "⚡", label: "Trening EMS", sub: "28 min = efekt 2h siłowni", color: PINK },
  { emoji: "◈",  label: "Siłownia dla kobiet", sub: "Wyłącznie damska przestrzeń", color: "#c026d3" },
  { emoji: "✦",  label: "Zajęcia grupowe", sub: "Motywacja w społeczności",   color: "#7c3aed" },
  { emoji: "♻",  label: "Regeneracja", sub: "Ciało potrzebuje odpoczynku",   color: "#0ea5e9" },
  { emoji: "◎",  label: "Społeczność", sub: "Kobiety, które rozumieją",      color: "#10b981" },
  { emoji: "◇",  label: "Opieka trenerek", sub: "Bezpieczeństwo i efekty",   color: "#f59e0b" },
];

function ModelarniaSection() {
  const headRef = useReveal();
  return (
    <section style={{ padding: "96px 24px", background: SURFACE }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div ref={headRef} className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="pill pill-pink">Czym jest Modelarnia?</span>
          <h2
            className="section-h"
            style={{
              fontSize: "clamp(28px, 4vw, 46px)",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              marginTop: 18,
              marginBottom: 12,
            }}
          >
            Kompletna przestrzeń dla kobiet.
          </h2>
          <div className="div-line" />
          <p style={{
            marginTop: 22, color: MID_GRAY, fontSize: 17, lineHeight: 1.75,
            maxWidth: 500, margin: "22px auto 0",
          }}>
            Modelarnia to kobiecy ekosystem fitness — siłownia, EMS, zajęcia i regeneracja
            w jednym miejscu, z pełną opieką trenerek.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
        }}>
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ emoji, label, sub, color, delay }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: 18,
        padding: "22px 18px",
        transitionDelay: `${delay}ms`,
        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease, border-color 0.3s",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 0 0 3px ${color}22, 0 16px 36px rgba(0,0,0,0.06)`;
        e.currentTarget.style.borderColor = `${color}44`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)";
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: `${color}14`, color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 19, marginBottom: 14,
      }}>
        {emoji}
      </div>
      <div style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.015em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: MID_GRAY, fontSize: 12.5 }}>{sub}</div>
    </div>
  );
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  const ref = useReveal();
  return (
    <section className="final-bg" style={{ padding: "112px 24px", textAlign: "center" }}>
      <div
        ref={ref}
        className="reveal"
        style={{ maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}
      >
        <span className="pill pill-light">
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#FF88C2", display: "inline-block",
          }} />
          Jesteś gotowa?
        </span>

        <h2 style={{
          fontSize: "clamp(30px, 5vw, 56px)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.04em",
          color: "#fff",
          marginTop: 26,
          marginBottom: 18,
        }}>
          Kontynuuj trening EMS{" "}
          <br />
          <span className="grad">w Modelarni</span>
        </h2>

        <p style={{
          fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.75,
          marginBottom: 44, maxWidth: 480, margin: "0 auto 44px",
        }}>
          Kliknij poniżej, aby przejść do aktualnej podstrony treningu EMS
          i kontynuować to, co zaczęłaś.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://modelarniafitness.pl/trening-ems"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-fill lg"
          >
            Przejdź do strony EMS {Icon.arrowRight}
          </a>
          <a
            href="https://modelarniafitness.pl"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-white"
          >
            Poznaj całą Modelarnię
          </a>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", justifyContent: "center",
          gap: 40, flexWrap: "wrap",
          marginTop: 56,
          paddingTop: 48,
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}>
          {[
            ["500+", "klientek"],
            ["28 min", "treningu"],
            ["5★", "ocena"],
          ].map(([n, l]) => (
            <div key={l} className="stat-block">
              <div className="stat-n">{n}</div>
              <div className="stat-l">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const socialStyle = {
    width: 34, height: 34, borderRadius: 9,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "rgba(255,255,255,0.42)",
    textDecoration: "none",
    transition: "all 0.25s",
  };

  return (
    <footer style={{ background: DARK, padding: "60px 24px 36px" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40,
          marginBottom: 48,
          paddingBottom: 48,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          {/* Brand col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: PINK, display: "inline-block" }} />
              <span style={{ fontWeight: 800, fontSize: 15.5, color: "#fff", letterSpacing: "-0.03em" }}>
                28minut<span style={{ color: PINK }}>.pl</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.75 }}>
              28minut.pl to teraz część Modelarni — kobiecego ekosystemu fitness nowej generacji.
            </p>
            {/* Social */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {[
                { icon: Icon.instagram, href: "https://instagram.com/modelarniafitness" },
                { icon: Icon.facebook,  href: "https://facebook.com/modelarniafitness" },
              ].map((s, i) => (
                <a
                  key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={socialStyle}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,47,146,0.14)";
                    e.currentTarget.style.color = PINK;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.42)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links col */}
          <div>
            <h5 style={{
              fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.32)",
              marginBottom: 16,
            }}>
              Modelarnia
            </h5>
            {[
              ["Trening EMS",      "https://modelarniafitness.pl/trening-ems"],
              ["Siłownia",         "https://modelarniafitness.pl"],
              ["Zajęcia grupowe",  "https://modelarniafitness.pl"],
              ["Kontakt",          "https://modelarniafitness.pl"],
            ].map(([label, href]) => (
              <a
                key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", fontSize: 13.5, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 10, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Contact col */}
          <div>
            <h5 style={{
              fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.32)",
              marginBottom: 16,
            }}>
              Kontakt
            </h5>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.9 }}>
              modelarniafitness.pl<br />
              Warszawa, Polska<br />
              <a href="mailto:kontakt@modelarniafitness.pl"
                style={{ color: PINK, textDecoration: "none" }}>
                kontakt@modelarniafitness.pl
              </a>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 14,
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.18)" }}>
            © 2024 Modelarnia Fitness. 28minut.pl jest częścią Modelarni.
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", gap: 5 }}>
            Zbudowane z <span style={{ color: PINK }}>♥</span> dla kobiet
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{css}</style>
      <Navbar />
      <main>
        <Hero />
        <ChangesSection />
        <BrandBridgeSection />
        <ModelarniaSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
