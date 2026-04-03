import React, { useState, useEffect } from 'react';
import { Star, Mail, Video, Send } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ── SUPABASE ───────────────────────────────────────────────────────────────
const supabaseUrl = 'https://fvmkfpqstkadeihudcty.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bWtmcHFzdGthZGVpaHVkY3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzYxODMsImV4cCI6MjA3ODExMjE4M30.4J0g_Fc9w7fNodK5-BIjV889-npNE1AhM2-0UA4ZccQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// ── KONSTANTEN ─────────────────────────────────────────────────────────────
const WA_EIER = '4915168472345';
const WA_DRUCK = 'DEINE_DRUCKWELT_NUMMER'; // <-- hier ersetzen
const ADMIN_PW = 'Fredeggs2024';
const PREIS_EI = 0.35;

const PRODUKTE = [
  { id: 1, name: 'Osterhase',          desc: 'Dekorative Hasen-Figur mit feiner Rillenstruktur — perfekt für Ostern oder als Wohndeko das ganze Jahr.' },
  { id: 2, name: 'Hase im Ei',         desc: 'Charmante Deko-Figur: ein Hase, der aus einem Ei schlüpft — ein besonderes Ostergeschenk oder Tischdeko.' },
  { id: 3, name: 'Serviettenring Hase',desc: 'Eleganter Serviettenring in Hasenform — perfekt für den gedeckten Ostertisch und als bleibendes Deko-Accessoire.' },
];

const FARBEN = [
  { hex: '#3a7d44', label: 'Grün' },
  { hex: '#c0392b', label: 'Rot' },
  { hex: '#f0c040', label: 'Gelb' },
  { hex: '#1a1a18', label: 'Schwarz' },
  { hex: '#7B4F2E', label: 'Braun' },
  { hex: '#1b4f8a', label: 'Blau' },
  { hex: '#e8dcc8', label: 'Beige', border: true },
];

const GROESSEN = [
  { label: 'Klein', size: '1–5 cm',   price: '3,50 €' },
  { label: 'Mittel', size: '6–10 cm', price: '5,00 €' },
  { label: 'Groß', size: '11–20 cm',  price: '10,00 €' },
];

const VIDEOS = [
  { id: 1, titel: 'Unsere Haltungsart',             datei: '/videos/IMG_0089.MP4' },
  { id: 2, titel: 'Wie die Hühner gefüttert werden', datei: '/videos/Fuetterung.mp4' },
];

// ── GLOBALE STYLES ─────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
:root{--bg:#f7f5f2;--ink:#1a1a18;--ag:#2d5a3d;--a2:#c8a96e;--ae:#d97706;--light:#edeae5;--card:#fff;--r:16px;--s:0 4px 24px rgba(0,0,0,.07)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font-family:'DM Sans',sans-serif;font-weight:300;line-height:1.6}

/* NAV */
.fw-nav{position:sticky;top:0;z-index:100;background:var(--ink);display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:64px;box-shadow:0 2px 20px rgba(0,0,0,.3)}
.fw-nav-logo{font-family:'DM Serif Display',serif;color:#fff;font-size:20px}
.fw-nav-logo em{font-style:italic;color:var(--a2)}
.fw-nav-tabs{display:flex;gap:4px}
.fw-nav-tab{padding:8px 20px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;color:#aaa;border:none;background:transparent;font-family:'DM Sans',sans-serif;transition:all .2s}
.fw-nav-tab:hover{color:#fff;background:rgba(255,255,255,.08)}
.fw-nav-tab.active{background:var(--ag);color:#fff}
.fw-nav-tab.active.egg{background:var(--ae)}

/* DRUCKWELT HERO */
.dw-hero{min-height:90vh;display:grid;grid-template-columns:1fr 1fr;overflow:hidden}
.dw-hero-text{display:flex;flex-direction:column;justify-content:center;padding:80px 60px;z-index:2}
.dw-hero-tag{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--ag);font-weight:500;margin-bottom:24px}
.dw-h1{font-family:'DM Serif Display',serif;font-size:clamp(36px,5vw,64px);line-height:1.05;letter-spacing:-1px;margin-bottom:24px}
.dw-h1 em{font-style:italic;color:var(--ag)}
.dw-hero-sub{font-size:17px;color:#666;max-width:380px;margin-bottom:40px}
.dw-hero-cta{display:inline-block;background:var(--ink);color:#fff;padding:16px 36px;border-radius:50px;font-size:15px;font-weight:500;transition:background .3s,transform .2s;width:fit-content;cursor:pointer;border:none;font-family:'DM Sans',sans-serif}
.dw-hero-cta:hover{background:var(--ag);transform:translateY(-2px)}
.dw-hero-image{position:relative;overflow:hidden;background:#e8e4df}
.dw-hero-image img{width:100%;height:100%;object-fit:cover}
.dw-hero-image::after{content:'';position:absolute;inset:0;background:linear-gradient(to right,var(--bg) 0%,transparent 30%);z-index:1}

/* PREIS-BANNER */
.dw-price-banner{background:var(--ink);color:#fff;padding:28px 60px;display:flex;align-items:center;justify-content:center;gap:60px;flex-wrap:wrap}
.dw-pb-label{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--a2);margin-bottom:4px}
.dw-pb-value{font-family:'DM Serif Display',serif;font-size:28px}
.dw-pb-size{font-size:13px;color:#aaa}
.dw-pb-div{width:1px;height:50px;background:#333}

/* PRODUKTE */
.dw-section{padding:80px 40px;max-width:1200px;margin:0 auto}
.dw-section-label{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--ag);font-weight:500;margin-bottom:16px}
.dw-section-title{font-family:'DM Serif Display',serif;font-size:clamp(28px,4vw,44px);margin-bottom:50px;line-height:1.1}
.dw-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:28px}
.dw-card{background:var(--card);border-radius:var(--r);overflow:hidden;box-shadow:var(--s);transition:transform .3s,box-shadow .3s}
.dw-card:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(0,0,0,.12)}
.dw-card-body{padding:24px}
.dw-card-name{font-family:'DM Serif Display',serif;font-size:21px;margin-bottom:8px}
.dw-card-desc{font-size:14px;color:#777;margin-bottom:18px}
.dw-color-label{font-size:12px;color:#999;margin-bottom:8px;letter-spacing:1px;text-transform:uppercase}
.dw-colors{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:18px}
.dw-dot{width:26px;height:26px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:transform .2s,box-shadow .2s}
.dw-dot:hover{transform:scale(1.15)}
.dw-dot.sel{transform:scale(1.2);box-shadow:0 0 0 3px white,0 0 0 5px var(--ink)}
.dw-sizes{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
.dw-size-btn{border:1.5px solid var(--light);background:transparent;border-radius:8px;padding:7px 13px;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;text-align:center}
.dw-size-btn:hover{border-color:var(--ag);color:var(--ag)}
.dw-size-btn.sel{background:var(--ag);color:#fff;border-color:var(--ag)}
.dw-size-price{font-size:11px;display:block;margin-top:2px;opacity:.85}
.dw-custom{width:100%;border:1.5px solid var(--light);border-radius:10px;padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:14px;resize:vertical;min-height:100px;color:var(--ink);background:var(--bg);transition:border-color .2s;margin-bottom:4px}
.dw-custom:focus{outline:none;border-color:var(--ag)}
.dw-order-btn{width:100%;background:var(--ag);color:#fff;border:none;border-radius:10px;padding:15px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;transition:background .2s,transform .2s}
.dw-order-btn:hover{background:#1e3f2b;transform:translateY(-1px)}

/* BESTELLFORMULAR */
.dw-order-section{background:var(--card);border-radius:24px;padding:50px;box-shadow:var(--s);margin-top:60px}
.dw-order-title{font-family:'DM Serif Display',serif;font-size:30px;margin-bottom:8px}
.dw-order-sub{color:#888;font-size:15px;margin-bottom:36px}
.dw-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.dw-form-group{display:flex;flex-direction:column;gap:7px}
.dw-form-group.full{grid-column:1/-1}
.dw-label{font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;font-weight:500}
.dw-input{border:1.5px solid var(--light);border-radius:10px;padding:13px 15px;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--ink);background:var(--bg);transition:border-color .2s;width:100%}
.dw-input:focus{outline:none;border-color:var(--ag)}
.dw-summary{background:var(--bg);border-radius:12px;padding:22px;margin:28px 0;border-left:3px solid var(--ag)}
.dw-summary-title{font-size:12px;letter-spacing:1px;text-transform:uppercase;color:var(--ag);margin-bottom:10px;font-weight:500}
.dw-summary-line{font-size:15px;margin-bottom:5px}
.dw-lieferart-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.dw-lieferart-btn{border:1.5px solid var(--light);background:transparent;border-radius:10px;padding:12px;font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;transition:all .2s}
.dw-lieferart-btn:hover{border-color:var(--ag)}
.dw-lieferart-btn.sel{background:var(--ag);color:#fff;border-color:var(--ag)}
.dw-wa-btn{display:flex;align-items:center;justify-content:center;gap:12px;width:100%;background:#25D366;color:#fff;border:none;border-radius:12px;padding:17px 28px;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:500;cursor:pointer;transition:background .2s,transform .2s;margin-top:28px}
.dw-wa-btn:hover{background:#1ebe5d;transform:translateY(-2px)}
.dw-wa-icon{width:24px;height:24px;fill:white;flex-shrink:0}

/* EIGENER WUNSCH */
.dw-wunsch{background:linear-gradient(135deg,#edf5ef 0%,#f7f5f2 100%);border:2px dashed #2d5a3d;border-radius:20px;padding:36px;margin-top:28px}
.dw-wunsch-title{font-family:'DM Serif Display',serif;font-size:22px;margin-bottom:8px}

/* FREDEGGS */
.fe-hero{background:linear-gradient(135deg,#78350f 0%,#d97706 60%,#fbbf24 100%);padding:80px 40px;text-align:center;color:#fff;position:relative;overflow:hidden}
.fe-hero::before{content:'🐔';font-size:160px;position:absolute;right:8%;top:50%;transform:translateY(-50%);opacity:.15}
.fe-hero-tag{font-size:11px;letter-spacing:3px;text-transform:uppercase;opacity:.7;margin-bottom:16px}
.fe-hero h2{font-family:'DM Serif Display',serif;font-size:clamp(36px,5vw,60px);margin-bottom:16px;line-height:1.1}
.fe-hero-sub{font-size:18px;opacity:.85;max-width:500px;margin:0 auto 10px}
.fe-badge{display:inline-block;background:#fff;color:var(--ae);font-weight:500;font-size:13px;padding:6px 16px;border-radius:50px;margin-top:16px}
.fe-bestand-box{max-width:700px;margin:0 auto;padding:32px 24px 0}
.fe-bestand-card{background:var(--card);border-radius:16px;padding:24px 28px;box-shadow:var(--s);display:flex;align-items:center;justify-content:space-between;gap:20px}
.fe-bestand-zahl{font-family:'DM Serif Display',serif;font-size:48px;color:var(--ae);line-height:1}
.fe-bestand-label{font-size:13px;color:#888;margin-top:4px}
.fe-badge-voll{padding:8px 16px;border-radius:50px;font-size:13px;font-weight:500;background:#dcfce7;color:#166534}
.fe-badge-wenig{padding:8px 16px;border-radius:50px;font-size:13px;font-weight:500;background:#fef9c3;color:#713f12}
.fe-badge-leer{padding:8px 16px;border-radius:50px;font-size:13px;font-weight:500;background:#fee2e2;color:#991b1b}
.fe-section{max-width:700px;margin:0 auto;padding:32px 24px 60px}
.fe-card{background:var(--card);border-radius:20px;padding:32px;box-shadow:var(--s);margin-bottom:20px}
.fe-card-title{font-family:'DM Serif Display',serif;font-size:21px;margin-bottom:22px}
.fe-count-display{text-align:center;margin-bottom:20px}
.fe-count-big{font-family:'DM Serif Display',serif;font-size:64px;line-height:1;color:var(--ae)}
.fe-count-label{font-size:14px;color:#888;margin-top:4px}
.fe-price-display{font-size:18px;font-weight:500;color:var(--ae);margin-top:6px}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;background:var(--light);border-radius:3px;outline:none;margin:12px 0;border:none;padding:0}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:var(--ae);cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.2)}
.fe-range-labels{display:flex;justify-content:space-between;font-size:12px;color:#aaa}
.fe-delivery-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:8px}
.fe-delivery-btn{padding:14px;border:2px solid var(--light);border-radius:12px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;background:transparent;color:var(--ink);transition:all .2s;text-align:center}
.fe-delivery-btn:hover{border-color:var(--ae)}
.fe-delivery-btn.sel{border-color:var(--ae);background:#fff7ed;color:var(--ae);font-weight:500}
.fe-delivery-icon{font-size:24px;display:block;margin-bottom:6px}
.fe-checkbox{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1.5px solid var(--light);border-radius:12px;cursor:pointer;transition:all .2s}
.fe-checkbox:hover{border-color:var(--ae)}
.fe-checkbox.checked{border-color:var(--ae);background:#fff7ed}
.fe-check-box{width:22px;height:22px;border-radius:6px;border:2px solid #ccc;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}
.fe-checkbox.checked .fe-check-box{background:var(--ae);border-color:var(--ae)}
.fe-wunschzeit{margin-top:12px}
.fe-order-btn{width:100%;background:var(--ae);color:#fff;border:none;border-radius:12px;padding:17px;font-family:'DM Sans',sans-serif;font-size:16px;font-weight:500;cursor:pointer;transition:background .2s,transform .2s}
.fe-order-btn:hover{background:#b45309;transform:translateY(-1px)}
.fe-order-btn:disabled{background:#ccc;cursor:not-allowed;transform:none}
.fe-info-yellow{padding:14px 16px;border-radius:10px;font-size:13px;margin-top:12px;background:#fefce8;border:1px solid #fde047;color:#713f12}
.fe-info-red{padding:14px 16px;border-radius:10px;font-size:13px;margin-top:12px;background:#fef2f2;border:1px solid #fca5a5;color:#7f1d1d}
.fe-input{border:1.5px solid var(--light);border-radius:10px;padding:13px 15px;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--ink);background:var(--bg);transition:border-color .2s;width:100%}
.fe-input:focus{outline:none;border-color:var(--ae)}
.fe-label{font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#888;font-weight:500;display:block;margin-bottom:7px}
.fe-textarea{width:100%;border:1.5px solid var(--light);border-radius:10px;padding:13px 15px;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--ink);background:var(--bg);transition:border-color .2s;resize:none;height:128px}
.fe-textarea:focus{outline:none;border-color:var(--ae)}
.fe-wa-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;background:#25D366;color:#fff;border:none;border-radius:10px;padding:15px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;transition:background .2s,transform .2s;margin-top:8px}
.fe-wa-btn:hover{background:#1ebe5d;transform:translateY(-2px)}
.fe-admin-toggle{text-align:center;padding:20px 0 0;color:#ccc;font-size:13px;cursor:pointer;text-decoration:underline}
.fe-admin-panel{background:var(--card);border-radius:20px;padding:32px;box-shadow:var(--s);margin-top:16px;border:2px solid #e5e7eb}
.fe-admin-title{font-family:'DM Serif Display',serif;font-size:20px;margin-bottom:20px;color:var(--ink)}
.fe-admin-input{width:100%;border:1.5px solid var(--light);border-radius:10px;padding:13px 15px;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--ink);background:var(--bg);margin-bottom:12px}
.fe-admin-input:focus{outline:none;border-color:var(--ae)}
.fe-admin-btn{width:100%;padding:14px;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:500;cursor:pointer;transition:all .2s;margin-bottom:8px}
.fe-admin-btn.green{background:#16a34a;color:#fff}.fe-admin-btn.green:hover{background:#15803d}
.fe-admin-btn.amber{background:var(--ae);color:#fff}.fe-admin-btn.amber:hover{background:#b45309}
.fe-admin-btn.gray{background:#9ca3af;color:#fff}.fe-admin-btn.gray:hover{background:#6b7280}
.fe-save-msg{text-align:center;color:#16a34a;font-size:14px;font-weight:500;margin-top:8px}
.fe-karton-box{background:var(--bg);border-radius:10px;padding:14px 16px;border:1.5px solid var(--light);font-size:13px;margin-top:8px;color:#666}

/* VIDEO */
.fe-video-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
.fe-video-card{border:2px solid var(--light);border-radius:16px;padding:20px;background:var(--card)}
.fe-video-title{font-family:'DM Serif Display',serif;font-size:17px;text-align:center;margin-bottom:14px}

/* BEWERTUNG */
.fe-stars{display:flex;gap:6px;margin-bottom:16px}
.fe-star{font-size:28px;cursor:pointer;transition:transform .15s;background:none;border:none;padding:0}
.fe-star:hover{transform:scale(1.15)}

/* KONTAKT */
.fe-kontakt-link{color:var(--ae);text-decoration:none}
.fe-kontakt-link:hover{text-decoration:underline}

/* FOOTER */
.fw-footer{background:var(--ink);color:#888;text-align:center;padding:40px;font-size:13px}
.fw-footer strong{color:#fff}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.fadeUp{animation:fadeUp .5s ease}

@media(max-width:768px){
  .fw-nav{padding:0 16px}
  .fw-nav-tab{padding:7px 12px;font-size:13px}
  .dw-hero{grid-template-columns:1fr;min-height:auto}
  .dw-hero-image{height:35vh}
  .dw-hero-image::after{background:linear-gradient(to bottom,transparent,var(--bg) 90%)}
  .dw-hero-text{padding:36px 20px 50px}
  .dw-price-banner{padding:20px;gap:20px}
  .dw-pb-div{display:none}
  .dw-section{padding:50px 16px}
  .dw-order-section{padding:28px 16px}
  .dw-form-grid{grid-template-columns:1fr}
  .fe-hero{padding:60px 20px}
}
`;

// ── WA-ICON ────────────────────────────────────────────────────────────────
const WaIcon = () => (
  <svg className="dw-wa-icon" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ══════════════════════════════════════════════════════════════════════════
// HAUPTKOMPONENTE
// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState('print');

  // ── DRUCKWELT STATE ──────────────────────────────────────────────────────
  const [selColor,    setSelColor]    = useState({});
  const [selSize,     setSelSize]     = useState({});
  const [customText,  setCustomText]  = useState({});
  const [freeText,    setFreeText]    = useState('');
  const [orderInfo,   setOrderInfo]   = useState(null);
  const [printLieferart, setPrintLieferart] = useState('abholen');
  const [dwName,      setDwName]      = useState('');
  const [dwStreet,    setDwStreet]    = useState('');
  const [dwTag,       setDwTag]       = useState('');
  const [dwUhrzeit,   setDwUhrzeit]   = useState('');

  // ── FREDEGGS STATE ───────────────────────────────────────────────────────
  const [eierAnzahl,          setEierAnzahl]          = useState(0);
  const [eierInBestellung,    setEierInBestellung]    = useState(0);
  const [lieferart,           setLieferart]           = useState('abholen');
  const [wunschzeit,          setWunschzeit]          = useState('');
  const [kundenName,          setKundenName]          = useState('');
  const [kundenAdresse,       setKundenAdresse]       = useState('');
  const [eierAufLager,        setEierAufLager]        = useState(10);
  const [kartonsMitbringen,   setKartonsMitbringen]   = useState(false);
  const [kartonsBedarf,       setKartonsBedarf]       = useState(true);
  const [bewertung,           setBewertung]           = useState(5);
  const [bewertungstext,      setBewertungstext]      = useState('');
  const [bewName,             setBewName]             = useState('');
  // Admin
  const [adminPw,       setAdminPw]       = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminOffen,    setAdminOffen]    = useState(false);
  const [neuerBestand,  setNeuerBestand]  = useState(10);
  const [saveMsg,       setSaveMsg]       = useState(false);

  // ── SUPABASE ─────────────────────────────────────────────────────────────
  useEffect(() => {
    ladeBestand();
    const channel = supabase
      .channel('bestand-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bestand' }, ladeBestand)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const ladeBestand = async () => {
    const { data } = await supabase.from('bestand').select('*').eq('id', 1).single();
    if (data) {
      setEierAufLager(data.eier_anzahl);
      setNeuerBestand(data.eier_anzahl);
      setKartonsBedarf(data.kartons_bedarf);
    }
  };

  // ── FREDEGGS FUNKTIONEN ──────────────────────────────────────────────────
  const handleEierChange = (val) => { setEierAnzahl(val); setEierInBestellung(val); };

  const bestellungAbsenden = async () => {
    if (!kundenName) { alert('Bitte Namen eingeben!'); return; }
    const neuerB = Math.max(0, eierAufLager - eierAnzahl);
    const { error } = await supabase.from('bestand').update({ eier_anzahl: neuerB }).eq('id', 1);
    if (error) { alert('Fehler beim Aktualisieren des Bestands'); return; }
    setEierAufLager(neuerB);
    setEierInBestellung(0);
    const msg =
      `🐓 *Neue Eierbestellung - Fredeggs*\n\n` +
      `👤 Name: ${kundenName}${kundenAdresse ? `\n📍 Adresse: ${kundenAdresse}` : ''}\n\n` +
      `🥚 Anzahl: ${eierAnzahl} Eier\n` +
      `💰 Preis: ${(eierAnzahl * PREIS_EI).toFixed(2)} €\n\n` +
      `${lieferart === 'abholen' ? '🏪 Selbst abholen' : `🚚 Lieferung${wunschzeit ? ` um ${wunschzeit} Uhr` : ''}`}\n\n` +
      `${kartonsMitbringen ? '📦 Ich kann Eierkartons mitbringen' : ''}`;
    const url = /iPhone|iPad|iPod/i.test(navigator.userAgent)
      ? `https://api.whatsapp.com/send?phone=${WA_EIER}&text=${encodeURIComponent(msg)}`
      : `https://wa.me/${WA_EIER}?text=${encodeURIComponent(msg)}`;
    window.location.href = url;
    setEierAnzahl(0); setKundenName(''); setKundenAdresse(''); setWunschzeit(''); setKartonsMitbringen(false);
  };

  const bewertungSenden = () => {
    if (!bewName || !bewertungstext) { alert('Bitte Name und Bewertung eingeben!'); return; }
    const msg =
      `⭐ *Neue Bewertung - Fredeggs*\n\n` +
      `👤 Von: ${bewName}\n⭐ Bewertung: ${bewertung} Sterne\n\n` +
      `💬 Nachricht:\n${bewertungstext}`;
    const url = /iPhone|iPad|iPod/i.test(navigator.userAgent)
      ? `https://api.whatsapp.com/send?phone=${WA_EIER}&text=${encodeURIComponent(msg)}`
      : `https://wa.me/${WA_EIER}?text=${encodeURIComponent(msg)}`;
    window.location.href = url;
    setBewName(''); setBewertung(5); setBewertungstext('');
  };

  const adminLogin = () => {
    if (adminPw === ADMIN_PW) { setAdminLoggedIn(true); setAdminPw(''); }
    else { alert('Falsches Passwort!'); setAdminPw(''); }
  };

  const bestandSpeichern = async () => {
    const { error } = await supabase
      .from('bestand').update({ eier_anzahl: neuerBestand, kartons_bedarf: kartonsBedarf }).eq('id', 1);
    if (error) { alert('Fehler: ' + error.message); return; }
    setEierAufLager(neuerBestand);
    setSaveMsg(true);
    setTimeout(() => setSaveMsg(false), 2500);
  };

  const bestandBadge = () => {
    if (eierAufLager === 0)  return { cls: 'fe-badge-leer',  txt: '❌ Ausverkauft' };
    if (eierAufLager <= 6)   return { cls: 'fe-badge-wenig', txt: '⚠️ Nur noch wenige da' };
    return                          { cls: 'fe-badge-voll',  txt: '✅ Verfügbar' };
  };

  // ── DRUCKWELT FUNKTIONEN ─────────────────────────────────────────────────
  const proceedToOrder = (id, name) => {
    setOrderInfo({
      name,
      size:   selSize[id]   || 'nicht gewählt',
      color:  selColor[id]  || 'nicht gewählt',
      custom: customText[id] || freeText || '',
    });
    setTimeout(() => {
      document.getElementById('dw-order-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const buildPrintWA = (e) => {
    e.preventDefault();
    if (!orderInfo) return;
    const lines = [
      '🖨️ *Neue Bestellung – Frederiks Druckwelt*', '',
      `📦 *Produkt:* ${orderInfo.name}`,
      `📏 *Größe / Preis:* ${orderInfo.size}`,
      `🎨 *Farbe:* ${orderInfo.color}`,
      orderInfo.custom ? `💬 *Wunsch:* ${orderInfo.custom}` : '',
      '', '📬 *Lieferadresse:*',
      dwName || '—',
      `📦 ${printLieferart === 'abholen' ? 'Selbst abholen' : 'Lieferung'}`,
      dwStreet || '—',
      dwTag     ? `📅 Liefertag: ${dwTag}` : '',
      dwUhrzeit ? `⏰ Uhrzeit: ${dwUhrzeit}` : '',
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${WA_DRUCK}?text=${encodeURIComponent(lines)}`, '_blank');
  };

  const navTo = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const badge = bestandBadge();

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* ── NAV ── */}
      <nav className="fw-nav">
        <div className="fw-nav-logo">Frede<em>ggs</em> &amp; Druckwelt</div>
        <div className="fw-nav-tabs">
          <button className={`fw-nav-tab${page === 'print' ? ' active' : ''}`} onClick={() => navTo('print')}>🖨️ Druckwelt</button>
          <button className={`fw-nav-tab egg${page === 'eggs' ? ' active' : ''}`} onClick={() => navTo('eggs')}>🥚 Fredeggs</button>
        </div>
      </nav>

      {/* ══════════════ DRUCKWELT ══════════════ */}
      {page === 'print' && (
        <div>
          {/* Hero */}
          <section className="dw-hero">
            <div className="dw-hero-text">
              <p className="dw-hero-tag">Handgefertigt · 3D-Druck auf Bestellung</p>
              <h1 className="dw-h1">Frederiks<br /><em>Druckwelt</em></h1>
              <p style={{ fontSize: 18, color: '#444', maxWidth: 380, marginTop: -12, marginBottom: 28, lineHeight: 1.5, fontWeight: 400 }}>
                Gleiche Qualität wie im Shop — nur günstiger. Du bezahlst direkt beim Macher, ohne Umweg.
              </p>
              <p className="dw-hero-sub">Individuelle 3D-Drucke — von der Idee bis zum fertigen Objekt, persönlich und auf Bestellung.</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#edf5ef', color: 'var(--ag)', borderRadius: 10, padding: '10px 16px', fontSize: 14, fontWeight: 500, marginBottom: 32 }}>
                📦 Abholbar am nächsten oder übernächsten Tag
              </div>
              <button className="dw-hero-cta" onClick={() => document.getElementById('produkte')?.scrollIntoView({ behavior: 'smooth' })}>
                Jetzt bestellen
              </button>
            </div>
            <div className="dw-hero-image">
              <img src="/images/bambu-drucker.jpg" alt="Bambu A1 3D-Drucker" />
            </div>
          </section>

          {/* Preisbanner */}
          <div className="dw-price-banner">
            <div><div className="dw-pb-label">Kleinstformat</div><div className="dw-pb-value">3,50 €</div><div className="dw-pb-size">1 – 5 cm</div></div>
            <div className="dw-pb-div" />
            <div><div className="dw-pb-label">Mittelformat</div><div className="dw-pb-value">5,00 €</div><div className="dw-pb-size">6 – 10 cm</div></div>
            <div className="dw-pb-div" />
            <div><div className="dw-pb-label">Großformat</div><div className="dw-pb-value">10,00 €</div><div className="dw-pb-size">11 – 20 cm</div></div>
          </div>

          {/* Produkte */}
          <div className="dw-section" id="produkte">
            <p className="dw-section-label">Beispiele &amp; eigene Wünsche</p>
            <h2 className="dw-section-title">Beispiele für 3D-Druck Ideen</h2>
            <p style={{ fontSize: 16, color: '#666', marginTop: -34, marginBottom: 44, maxWidth: 680, lineHeight: 1.7 }}>
              Die drei Objekte unten sind <strong>Beispiele</strong> — du kannst aber alles bestellen, was du dir vorstellst.
              Beschreibe einfach deinen Wunsch oder lade ein Foto hoch. Das Feld dafür findest du <strong>ganz unten auf dieser Seite</strong>.
            </p>
            <div className="dw-grid">
              {PRODUKTE.map(p => (
                <div className="dw-card" key={p.id}>
                  <div className="dw-card-body">
                    <div className="dw-card-name">{p.name}</div>
                    <div className="dw-card-desc">{p.desc}</div>
                    <div className="dw-color-label">Farbe wählen</div>
                    <div className="dw-colors">
                      {FARBEN.map(f => (
                        <div
                          key={f.label}
                          className={`dw-dot${selColor[p.id] === f.label ? ' sel' : ''}`}
                          style={{ background: f.hex, border: f.border ? '1.5px solid #ccc' : undefined }}
                          title={f.label}
                          onClick={() => setSelColor({ ...selColor, [p.id]: f.label })}
                        />
                      ))}
                    </div>
                    <div className="dw-sizes">
                      {GROESSEN.map(g => (
                        <button
                          key={g.label}
                          className={`dw-size-btn${selSize[p.id] === `${g.size} · ${g.price}` ? ' sel' : ''}`}
                          onClick={() => setSelSize({ ...selSize, [p.id]: `${g.size} · ${g.price}` })}
                        >
                          {g.label}<span className="dw-size-price">{g.price}</span>
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="dw-custom"
                      placeholder="Besondere Wünsche? z. B. Farbnuance, Menge, Anlass …"
                      value={customText[p.id] || ''}
                      onChange={e => setCustomText({ ...customText, [p.id]: e.target.value })}
                    />
                    <button className="dw-order-btn" onClick={() => proceedToOrder(p.id, p.name)}>
                      Zur Bestellung →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Eigener Wunsch */}
            <div className="dw-wunsch">
              <div className="dw-wunsch-title">Eigener Wunsch 💡</div>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 24, lineHeight: 1.6 }}>
                Du hast eine eigene Idee? Kein Problem — beschreibe sie hier. Ich sage dir, ob und wie ich es drucken kann.
              </p>
              <textarea
                className="dw-custom"
                style={{ minHeight: 120, marginBottom: 14 }}
                placeholder='z. B. "Ich möchte ein Namensschild mit unserem Familiennamen" …'
                value={freeText}
                onChange={e => setFreeText(e.target.value)}
              />
              <button className="dw-order-btn" style={{ maxWidth: 320 }} onClick={() => proceedToOrder('free', 'Eigener Wunsch')}>
                Anfrage stellen →
              </button>
            </div>

            {/* Bestellformular */}
            {orderInfo && (
              <div className="dw-order-section fadeUp" id="dw-order-form">
                <div className="dw-order-title">Deine Bestellung</div>
                <p className="dw-order-sub">Gib deine Daten ein — wir melden uns per WhatsApp bei dir.</p>

                <div className="dw-summary">
                  <div className="dw-summary-title">Zusammenfassung</div>
                  <div className="dw-summary-line"><strong>Produkt:</strong> {orderInfo.name}</div>
                  <div className="dw-summary-line"><strong>Größe / Preis:</strong> {orderInfo.size}</div>
                  <div className="dw-summary-line"><strong>Farbe:</strong> {orderInfo.color}</div>
                  {orderInfo.custom && <div className="dw-summary-line"><strong>Wunsch:</strong> {orderInfo.custom}</div>}
                </div>

                <div className="dw-form-grid">
                  <div className="dw-form-group full">
                    <span className="dw-label">Name</span>
                    <input className="dw-input" placeholder="Vor- und Nachname" value={dwName} onChange={e => setDwName(e.target.value)} />
                  </div>
                  <div className="dw-form-group full">
                    <span className="dw-label">Straße &amp; Hausnummer</span>
                    <input className="dw-input" placeholder="Musterstraße 12" value={dwStreet} onChange={e => setDwStreet(e.target.value)} />
                  </div>
                  <div className="dw-form-group full">
                    <span className="dw-label">Abholung oder Lieferung?</span>
                    <div className="dw-lieferart-grid">
                      <button className={`dw-lieferart-btn${printLieferart === 'abholen' ? ' sel' : ''}`} onClick={() => setPrintLieferart('abholen')}>🏠 Selbst abholen</button>
                      <button className={`dw-lieferart-btn${printLieferart === 'liefern' ? ' sel' : ''}`} onClick={() => setPrintLieferart('liefern')}>🚗 Lieferung</button>
                    </div>
                  </div>
                  <div className="dw-form-group full">
                    <span className="dw-label">Gewünschter Tag</span>
                    <input className="dw-input" placeholder="z. B. Montag, 07.04." value={dwTag} onChange={e => setDwTag(e.target.value)} />
                  </div>
                  <div className="dw-form-group full">
                    <span className="dw-label">Gewünschte Uhrzeit (optional)</span>
                    <input className="dw-input" placeholder="z. B. 15:00 oder 14:00–17:00" value={dwUhrzeit} onChange={e => setDwUhrzeit(e.target.value)} />
                  </div>
                </div>

                <a className="dw-wa-btn" href="#" target="_blank" rel="noreferrer" onClick={buildPrintWA}>
                  <WaIcon />
                  Bestellung per WhatsApp senden
                </a>
              </div>
            )}
          </div>

          <footer className="fw-footer">
            <strong>Frederiks Druckwelt</strong> &amp; <strong>Fredeggs</strong><br />
            <span style={{ marginTop: 8, display: 'block' }}>Druckwelt: Zahlung auf Rechnung · Fredeggs: Zahlung vor Ort</span>
          </footer>
        </div>
      )}

      {/* ══════════════ FREDEGGS ══════════════ */}
      {page === 'eggs' && (
        <div>
          {/* Hero */}
          <div className="fe-hero">
            <p className="fe-hero-tag">Frische Eier · Direkt vom Hof</p>
            <h2>Fredeggs 🥚</h2>
            <p className="fe-hero-sub">Frische Eier vom glücklichen Huhn — einfach per WhatsApp bestellen.</p>
            <div className="fe-badge">⬇️ PREISSENKUNG · 0,35 € pro Ei</div>
          </div>

          {/* Bestand */}
          <div className="fe-bestand-box">
            <div className="fe-bestand-card">
              <div>
                <div className="fe-bestand-zahl">{eierAufLager}</div>
                <div className="fe-bestand-label">Eier aktuell verfügbar</div>
              </div>
              <div className={badge.cls}>{badge.txt}</div>
            </div>
          </div>

          <div className="fe-section">

            {/* Kartons-Bedarf */}
            {kartonsBedarf && (
              <div className="fe-karton-box">
                ℹ️ <strong>Bedarf an Eierkartons!</strong> Falls du leere Kartons hast, bring sie gerne mit.
              </div>
            )}

            {/* Slider */}
            <div className="fe-card" style={{ marginTop: 20 }}>
              <div className="fe-card-title">Wie viele Eier möchtest du?</div>
              <div className="fe-count-display">
                <div className="fe-count-big">{eierAnzahl}</div>
                <div className="fe-count-label">Eier</div>
                <div className="fe-price-display">{(eierAnzahl * PREIS_EI).toFixed(2)} €</div>
              </div>
              <input
                type="range" min="0" max="20" step="2"
                value={eierAnzahl}
                onChange={e => handleEierChange(Number(e.target.value))}
              />
              <div className="fe-range-labels"><span>0</span><span>4</span><span>8</span><span>12</span><span>16</span><span>20</span></div>
            </div>

            {/* Kundendaten */}
            <div className="fe-card">
              <div className="fe-card-title">Deine Daten</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <span className="fe-label">Name</span>
                  <input className="fe-input" placeholder="Max Mustermann" value={kundenName} onChange={e => setKundenName(e.target.value)} />
                </div>
                <div>
                  <span className="fe-label">Adresse (bei Lieferung)</span>
                  <input className="fe-input" placeholder="Musterstraße 12, 48143 …" value={kundenAdresse} onChange={e => setKundenAdresse(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Lieferart */}
            <div className="fe-card">
              <div className="fe-card-title">Abholung oder Lieferung?</div>
              <div className="fe-delivery-grid">
                <button className={`fe-delivery-btn${lieferart === 'abholen' ? ' sel' : ''}`} onClick={() => setLieferart('abholen')}>
                  <span className="fe-delivery-icon">🏠</span>Selbst abholen
                </button>
                <button className={`fe-delivery-btn${lieferart === 'liefern' ? ' sel' : ''}`} onClick={() => setLieferart('liefern')}>
                  <span className="fe-delivery-icon">🚗</span>Lieferung
                </button>
              </div>
              {lieferart === 'liefern' && (
                <div className="fe-wunschzeit">
                  <span className="fe-label">Wunschzeit</span>
                  <input className="fe-input" placeholder='z. B. "15:00" oder "14:30–17:00"' value={wunschzeit} onChange={e => setWunschzeit(e.target.value)} />
                </div>
              )}
            </div>

            {/* Kartons mitbringen */}
            <div className="fe-card" style={{ padding: '20px 28px' }}>
              <div className={`fe-checkbox${kartonsMitbringen ? ' checked' : ''}`} onClick={() => setKartonsMitbringen(!kartonsMitbringen)}>
                <div className="fe-check-box">
                  {kartonsMitbringen && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span>Ich kann Eierkartons mitbringen 📦</span>
              </div>
            </div>

            {/* Bestell-Button */}
            <button
              className="fe-order-btn"
              disabled={eierAufLager === 0 || eierAnzahl === 0}
              onClick={bestellungAbsenden}
            >
              {eierAufLager === 0 ? '❌ Leider ausverkauft' : eierAnzahl === 0 ? 'Bitte Anzahl wählen' : `🐔 ${eierAnzahl} Eier per WhatsApp bestellen`}
            </button>
            <div className="fe-info-yellow">💡 WhatsApp öffnet sich mit vorausgefüllter Bestellung!</div>
            <div className="fe-info-red">⚠️ Stornierung nur bis 1 Tag vorher möglich!</div>

            {/* Videos */}
            <div className="fe-card" style={{ marginTop: 20 }}>
              <div className="fe-card-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Video size={22} /> Videos über unsere Hühner
              </div>
              <div className="fe-video-grid">
                {VIDEOS.map(v => (
                  <div className="fe-video-card" key={v.id}>
                    <div className="fe-video-title">{v.titel}</div>
                    <video controls className="w-full rounded-lg" style={{ width: '100%', borderRadius: 10 }}>
                      <source src={v.datei} type="video/mp4" />
                      Dein Browser unterstützt keine Videos.
                    </video>
                  </div>
                ))}
              </div>
            </div>

            {/* Bewertung */}
            <div className="fe-card">
              <div className="fe-card-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Star size={22} /> Bewertung abgeben
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <span className="fe-label">Ihr Name</span>
                  <input className="fe-input" placeholder="Ihr Name" value={bewName} onChange={e => setBewName(e.target.value)} />
                </div>
                <div>
                  <span className="fe-label">Bewertung</span>
                  <div className="fe-stars">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} className="fe-star" onClick={() => setBewertung(s)}>
                        {s <= bewertung ? '⭐' : '☆'}
                      </button>
                    ))}
                    <span style={{ alignSelf: 'center', color: 'var(--ae)', fontWeight: 500, marginLeft: 6 }}>
                      {bewertung} {bewertung === 1 ? 'Stern' : 'Sterne'}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="fe-label">Ihre Bewertung</span>
                  <textarea className="fe-textarea" placeholder="Schreiben Sie hier Ihre Bewertung…" value={bewertungstext} onChange={e => setBewertungstext(e.target.value)} />
                </div>
                <button className="fe-wa-btn" onClick={bewertungSenden}>
                  <Send size={18} /> Bewertung per WhatsApp senden
                </button>
              </div>
            </div>

            {/* Kontakt */}
            <div className="fe-card">
              <div className="fe-card-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Mail size={22} /> Kontakt
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 16 }}>
                <p>📧 <a className="fe-kontakt-link" href="mailto:Feldhege.Frederik@T-online.de">Feldhege.Frederik@T-online.de</a></p>
                <p>💬 <a className="fe-kontakt-link" href={`https://wa.me/${WA_EIER}`} target="_blank" rel="noreferrer">+49 151 68472345</a></p>
                <p>📍 Münster</p>
              </div>
            </div>

            {/* Admin */}
            <p className="fe-admin-toggle" onClick={() => setAdminOffen(!adminOffen)}>🔧 Admin</p>
            {adminOffen && (
              <div className="fe-admin-panel">
                <div className="fe-admin-title">🔐 Admin-Bereich</div>
                {!adminLoggedIn ? (
                  <>
                    <input
                      className="fe-admin-input" type="password" placeholder="Passwort"
                      value={adminPw} onChange={e => setAdminPw(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && adminLogin()}
                    />
                    <button className="fe-admin-btn amber" onClick={adminLogin}>Anmelden</button>
                  </>
                ) : (
                  <>
                    <span className="fe-label">Neuer Bestand (Eier)</span>
                    <input className="fe-admin-input" type="number" min="0" value={neuerBestand} onChange={e => setNeuerBestand(Number(e.target.value))} />
                    <span className="fe-label" style={{ marginTop: 8 }}>Eierkartons benötigt?</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                      <button className={`fe-admin-btn${kartonsBedarf ? ' green' : ' gray'}`} style={{ margin: 0 }} onClick={() => setKartonsBedarf(true)}>✅ Ja, Bedarf</button>
                      <button className={`fe-admin-btn${!kartonsBedarf ? ' gray' : ''}`} style={{ margin: 0, background: !kartonsBedarf ? '#4b5563' : '#9ca3af', color: '#fff' }} onClick={() => setKartonsBedarf(false)}>❌ Kein Bedarf</button>
                    </div>
                    <button className="fe-admin-btn green" onClick={bestandSpeichern}>💾 Bestand speichern</button>
                    <button className="fe-admin-btn gray" onClick={() => { setAdminLoggedIn(false); setAdminOffen(false); }}>Abmelden</button>
                    {saveMsg && <p className="fe-save-msg">✓ Gespeichert!</p>}
                  </>
                )}
              </div>
            )}

          </div>

          <footer className="fw-footer">
            <strong>Frederiks Druckwelt</strong> &amp; <strong>Fredeggs</strong><br />
            <span style={{ marginTop: 8, display: 'block' }}>Druckwelt: Zahlung auf Rechnung · Fredeggs: Zahlung vor Ort</span>
          </footer>
        </div>
      )}
    </>
  );
}
