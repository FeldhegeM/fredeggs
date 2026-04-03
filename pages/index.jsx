//
//
import React, { useState, useEffect } from 'react';
import { Star, Mail, Video, Send, Package, Printer } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Supabase Konfiguration
const supabaseUrl = 'https://fvmkfpqstkadeihudcty.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bWtmcHFzdGthZGVpaHVkY3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzYxODMsImV4cCI6MjA3ODExMjE4M30.4J0g_Fc9w7fNodK5-BIjV889-npNE1AhM2-0UA4ZccQ';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function FredericksPlatform() {
  const WHATSAPP_DRUCK = "4915168472345";
  const WHATSAPP_EIER = "4915168472345";
  const ADMIN_PASSWORT = "Fredeggs2024";
  const preisProEi = 0.35;

  // Navigation
  const [activePage, setActivePage] = useState('druckwelt');

  // Druckwelt States
  const [druckProdukt, setDruckProdukt] = useState(null);
  const [druckGroesse, setDruckGroesse] = useState({});
  const [druckFarbe, setDruckFarbe] = useState({});
  const [druckAnzahl, setDruckAnzahl] = useState({});
  const [druckName, setDruckName] = useState('');
  const [druckAdresse, setDruckAdresse] = useState('');

  // Eier States
  const [eierAnzahl, setEierAnzahl] = useState(0);
  const [eierInBestellung, setEierInBestellung] = useState(0);
  const [lieferart, setLieferart] = useState('abholen');
  const [wunschzeit, setWunschzeit] = useState('');
  const [bewertung, setBewertung] = useState(5);
  const [bewertungstext, setBewertungstext] = useState('');
  const [bewertungName, setBewertungName] = useState('');
  const [kundenName, setKundenName] = useState('');
  const [kundenAdresse, setKundenAdresse] = useState('');
  const [eierAufLager, setEierAufLager] = useState(10);
  const [eierkartonsMitbringen, setEierkartonsMitbringen] = useState(false);
  const [kartonsBedarf, setKartonsBedarf] = useState(true);

  // Admin
  const [adminPasswort, setAdminPasswort] = useState('');
  const [istAngemeldet, setIstAngemeldet] = useState(false);
  const [neuerBestand, setNeuerBestand] = useState(10);

  // Druckwelt Produkte
  const produkte = [
    {
      id: 'erdbeere',
      name: 'Erdbeere',
      emoji: '🍓',
      groessen: ['Klein (5cm)', 'Mittel (10cm)', 'Groß (15cm)'],
      farben: ['Rot', 'Grün', 'Gelb', 'Schwarz', 'Braun', 'Blau', 'Beige']
    },
    {
      id: 'pilz',
      name: 'Pilz',
      emoji: '🍄',
      groessen: ['Klein (5cm)', 'Mittel (8cm)', 'Groß (12cm)'],
      farben: ['Rot', 'Grün', 'Gelb', 'Schwarz', 'Braun', 'Blau', 'Beige']
    },
    {
      id: 'blume',
      name: 'Blume',
      emoji: '🌸',
      groessen: ['Klein (6cm)', 'Mittel (10cm)', 'Groß (14cm)'],
      farben: ['Rot', 'Grün', 'Gelb', 'Schwarz', 'Braun', 'Blau', 'Beige']
    },
    {
      id: 'herz',
      name: 'Herz',
      emoji: '❤️',
      groessen: ['Klein (5cm)', 'Mittel (10cm)', 'Groß (15cm)'],
      farben: ['Rot', 'Grün', 'Gelb', 'Schwarz', 'Braun', 'Blau', 'Beige']
    },
    {
      id: 'stern',
      name: 'Stern',
      emoji: '⭐',
      groessen: ['Klein (5cm)', 'Mittel (10cm)', 'Groß (15cm)'],
      farben: ['Rot', 'Grün', 'Gelb', 'Schwarz', 'Braun', 'Blau', 'Beige']
    },
    {
      id: 'rakete',
      name: 'Rakete',
      emoji: '🚀',
      groessen: ['Klein (8cm)', 'Mittel (15cm)', 'Groß (25cm)'],
      farben: ['Rot', 'Grün', 'Gelb', 'Schwarz', 'Braun', 'Blau', 'Beige']
    }
  ];

  const videos = [
    { id: 1, titel: "Unsere Haltungsart", datei: "/videos/IMG_0089.MP4" },
    { id: 2, titel: "Wie die Hühner gefüttert werden", datei: "/videos/Fuetterung.mp4" }
  ];

  const besitzerInfo = {
    name: "Fredeggs, Münster",
    email: "Feldhege.Frederik@T-online.de"
  };

  // Supabase laden
  useEffect(() => {
    ladeBestandAusSupabase();
    
    const channel = supabase
      .channel('bestand-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bestand' }, 
        () => ladeBestandAusSupabase()
      )
      .subscribe();
    
    return () => supabase.removeChannel(channel);
  }, []);

  const ladeBestandAusSupabase = async () => {
    const { data } = await supabase
      .from('bestand')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (data) {
      setEierAufLager(data.eier_anzahl);
      setNeuerBestand(data.eier_anzahl);
      setKartonsBedarf(data.kartons_bedarf);
    }
  };

  const adminLogin = () => {
    if (adminPasswort === ADMIN_PASSWORT) {
      setIstAngemeldet(true);
      setAdminPasswort('');
    } else {
      alert('Falsches Passwort!');
    }
  };

  const bestandAktualisieren = async () => {
    const { error } = await supabase
      .from('bestand')
      .update({ 
        eier_anzahl: neuerBestand,
        kartons_bedarf: kartonsBedarf 
      })
      .eq('id', 1);
    
    if (error) {
      alert('Fehler beim Speichern: ' + error.message);
    } else {
      setEierAufLager(neuerBestand);
      alert(`Bestand aktualisiert auf ${neuerBestand} Eier!`);
    }
  };

  // Druckwelt Bestellung
  const druckBestellung = () => {
    if (!druckName) {
      alert('Bitte Name eingeben!');
      return;
    }

    let msg = '🖨️ *Neue 3D-Druck-Bestellung*\n\n';
    msg += `👤 Name: ${druckName}\n`;
    if (druckAdresse) msg += `📍 Adresse: ${druckAdresse}\n\n`;
    
    msg += '📦 Bestellung:\n';
    produkte.forEach(prod => {
      if (druckAnzahl[prod.id] > 0) {
        msg += `\n${prod.emoji} ${prod.name}\n`;
        msg += `  Größe: ${druckGroesse[prod.id] || 'nicht gewählt'}\n`;
        msg += `  Farbe: ${druckFarbe[prod.id] || 'nicht gewählt'}\n`;
        msg += `  Anzahl: ${druckAnzahl[prod.id]}\n`;
      }
    });

    const waUrl = /iPhone|iPad|iPod/i.test(navigator.userAgent)
      ? `https://api.whatsapp.com/send?phone=${WHATSAPP_DRUCK}&text=${encodeURIComponent(msg)}`
      : `https://wa.me/${WHATSAPP_DRUCK}?text=${encodeURIComponent(msg)}`;

    window.location.href = waUrl;
  };

  // Eier Bestellung
  const eierBestellung = async () => {
    if (!kundenName) {
      alert('Bitte Namen eingeben!');
      return;
    }

    if (eierAnzahl === 0) {
      alert('Bitte Eier-Anzahl wählen!');
      return;
    }

    const neuerBestand = Math.max(0, eierAufLager - eierAnzahl);
    await supabase
      .from('bestand')
      .update({ eier_anzahl: neuerBestand })
      .eq('id', 1);

    setEierAufLager(neuerBestand);

    const msg = `🐓 *Neue Eierbestellung - Fredeggs*\n\n👤 Name: ${kundenName}${kundenAdresse ? `\n📍 Adresse: ${kundenAdresse}` : ''}\n\n🥚 Anzahl: ${eierAnzahl} Eier\n💰 Preis: ${(eierAnzahl * preisProEi).toFixed(2)} €\n\n${lieferart === 'abholen' ? '🏪 Selbst abholen' : `🚚 Lieferung${wunschzeit ? ` um ${wunschzeit}` : ''}`}\n\n${eierkartonsMitbringen ? '📦 Ich kann Eierkartons mitbringen' : ''}`;

    const waUrl = /iPhone|iPad|iPod/i.test(navigator.userAgent)
      ? `https://api.whatsapp.com/send?phone=${WHATSAPP_EIER}&text=${encodeURIComponent(msg)}`
      : `https://wa.me/${WHATSAPP_EIER}?text=${encodeURIComponent(msg)}`;

    window.location.href = waUrl;
    setEierAnzahl(0);
    setKundenName('');
    setKundenAdresse('');
  };

  const bewertungSenden = () => {
    if (!bewertungName || !bewertungstext) {
      alert('Bitte Name und Bewertung eingeben!');
      return;
    }

    const msg = `⭐ *Neue Bewertung - Fredeggs*\n\n👤 Von: ${bewertungName}\n⭐ Bewertung: ${bewertung} Sterne\n\n💬 Nachricht:\n${bewertungstext}`;

    const waUrl = /iPhone|iPad|iPod/i.test(navigator.userAgent)
      ? `https://api.whatsapp.com/send?phone=${WHATSAPP_EIER}&text=${encodeURIComponent(msg)}`
      : `https://wa.me/${WHATSAPP_EIER}?text=${encodeURIComponent(msg)}`;

    window.location.href = waUrl;
    setBewertungName('');
    setBewertung(5);
    setBewertungstext('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4 py-4">
            <button
              onClick={() => setActivePage('druckwelt')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                activePage === 'druckwelt'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'bg-purple-700 hover:bg-purple-800'
              }`}
            >
              <Printer className="w-5 h-5" />
              🖨️ Druckwelt
            </button>
            <button
              onClick={() => setActivePage('fredeggs')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                activePage === 'fredeggs'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              <Package className="w-5 h-5" />
              🥚 Fredeggs
            </button>
          </div>
        </div>
      </nav>

      {/* DRUCKWELT SEITE */}
      {activePage === 'druckwelt' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
          <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 shadow-lg">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-5xl font-bold mb-2">🖨️ Frederiks Druckwelt</h1>
              <p className="text-xl">Individuelle 3D-Drucke nach Maß</p>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            {/* Produkte */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-purple-800 mb-6">Wähle deine Produkte</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {produkte.map(prod => (
                  <div key={prod.id} className="border-4 border-purple-200 rounded-xl p-6 hover:border-purple-400 transition-all">
                    <div className="text-6xl text-center mb-4">{prod.emoji}</div>
                    <h3 className="text-2xl font-bold text-center mb-4">{prod.name}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block font-semibold mb-2">Größe:</label>
                        <select 
                          value={druckGroesse[prod.id] || ''}
                          onChange={(e) => setDruckGroesse({...druckGroesse, [prod.id]: e.target.value})}
                          className="w-full border-2 p-2 rounded-lg"
                        >
                          <option value="">Wählen...</option>
                          {prod.groessen.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">Farbe:</label>
                        <select 
                          value={druckFarbe[prod.id] || ''}
                          onChange={(e) => setDruckFarbe({...druckFarbe, [prod.id]: e.target.value})}
                          className="w-full border-2 p-2 rounded-lg"
                        >
                          <option value="">Wählen...</option>
                          {prod.farben.map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-2">Anzahl:</label>
                        <input 
                          type="number" 
                          min="0" 
                          value={druckAnzahl[prod.id] || 0}
                          onChange={(e) => setDruckAnzahl({...druckAnzahl, [prod.id]: Number(e.target.value)})}
                          className="w-full border-2 p-2 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bestelldaten */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-purple-800 mb-6">Deine Daten</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-2">Name: <span className="text-red-600">*</span></label>
                  <input 
                    type="text" 
                    value={druckName}
                    onChange={(e) => setDruckName(e.target.value)}
                    className="w-full border-2 p-3 rounded-lg"
                    placeholder="Max Mustermann"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Adresse (optional):</label>
                  <input 
                    type="text" 
                    value={druckAdresse}
                    onChange={(e) => setDruckAdresse(e.target.value)}
                    className="w-full border-2 p-3 rounded-lg"
                    placeholder="Musterstraße 12"
                  />
                </div>
              </div>

              <button 
                onClick={druckBestellung}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg mt-6 hover:from-purple-700 hover:to-blue-700"
              >
                🖨️ Jetzt per WhatsApp bestellen
              </button>
            </div>
          </main>
        </div>
      )}

      {/* FREDEGGS SEITE */}
      {activePage === 'fredeggs' && (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
          <header className="bg-amber-600 text-white py-6 shadow-lg">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold text-center">🥚 Fredeggs - Frische Eier vom Hof 🐔</h1>
              <p className="text-center mt-2 text-lg">Bestellen Sie jetzt Ihre frischen Bio-Eier!</p>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            {/* Bestand */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-amber-800">Verfügbare Eier</h2>
                  <p className="text-gray-600">Aktueller Bestand</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-bold text-amber-600">{eierAufLager}</p>
                  <p className="text-gray-500">Stück</p>
                </div>
              </div>
              {kartonsBedarf && (
                <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <p className="text-blue-800">📦 <strong>Eierkartons werden benötigt!</strong></p>
                </div>
              )}
            </div>

            {/* Bestellung */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-amber-800 mb-6">Jetzt bestellen</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Anzahl der Eier: {eierAnzahl} Stück</label>
                  <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xl font-bold text-amber-800">
                      Preis: {(eierAnzahl * preisProEi).toFixed(2)} € 
                      <span className="text-sm font-normal text-gray-600"> ({preisProEi} € pro Ei PREISSENKUNG)</span>
                    </p>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    step="2" 
                    value={eierAnzahl} 
                    onChange={(e) => setEierAnzahl(Number(e.target.value))} 
                    className="w-full h-3 bg-amber-200 rounded-lg" 
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0</span><span>5</span><span>10</span><span>15</span><span>20</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Ihr Name: <span className="text-red-600">*</span></label>
                  <input 
                    type="text" 
                    value={kundenName}
                    onChange={(e) => setKundenName(e.target.value)}
                    className="w-full border-2 p-3 rounded-lg"
                    placeholder="Max Mustermann"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-2">Adresse (optional):</label>
                  <input 
                    type="text" 
                    value={kundenAdresse}
                    onChange={(e) => setKundenAdresse(e.target.value)}
                    className="w-full border-2 p-3 rounded-lg"
                    placeholder="Musterstraße 123"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-3">Lieferart:</label>
                  <div className="space-y-3">
                    <div 
                      onClick={() => setLieferart('abholen')} 
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${lieferart === 'abholen' ? 'border-amber-600 bg-amber-50' : 'border-gray-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${lieferart === 'abholen' ? 'border-amber-600' : 'border-gray-400'}`}>
                        {lieferart === 'abholen' && <div className="w-3 h-3 rounded-full bg-amber-600"></div>}
                      </div>
                      <span className="ml-3">Selbst abholen</span>
                    </div>
                    <div 
                      onClick={() => setLieferart('liefern')} 
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${lieferart === 'liefern' ? 'border-amber-600 bg-amber-50' : 'border-gray-300'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${lieferart === 'liefern' ? 'border-amber-600' : 'border-gray-400'}`}>
                        {lieferart === 'liefern' && <div className="w-3 h-3 rounded-full bg-amber-600"></div>}
                      </div>
                      <span className="ml-3">Lieferung nach Hause</span>
                    </div>
                  </div>
                </div>

                {lieferart === 'liefern' && (
                  <div>
                    <label className="block font-semibold mb-2">Wunschzeit:</label>
                    <input 
                      type="text" 
                      value={wunschzeit}
                      onChange={(e) => setWunschzeit(e.target.value)}
                      className="w-full border-2 p-3 rounded-lg"
                      placeholder="z.B. 15:00"
                    />
                  </div>
                )}

                <div 
                  onClick={() => setEierkartonsMitbringen(!eierkartonsMitbringen)} 
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${eierkartonsMitbringen ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
                >
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${eierkartonsMitbringen ? 'border-blue-600 bg-blue-600' : 'border-gray-400'}`}>
                    {eierkartonsMitbringen && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <span className="ml-3">Ich kann Eierkartons mitbringen</span>
                </div>

                <button 
                  onClick={eierBestellung}
                  className="w-full bg-amber-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-amber-700"
                >
                  Jetzt per WhatsApp bestellen
                </button>
              </div>
            </div>

            {/* Videos */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-amber-800 mb-6 flex items-center gap-2">
                <Video className="w-7 h-7" />
                Videos über unsere Hühner
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {videos.map(video => (
                  <div key={video.id} className="border-2 border-amber-200 rounded-lg p-4">
                    <h3 className="font-semibold text-center mb-3">{video.titel}</h3>
                    <video controls className="w-full rounded-lg">
                      <source src={video.datei} type="video/mp4" />
                    </video>
                  </div>
                ))}
              </div>
            </div>

            {/* Bewertung */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-amber-800 mb-6">Bewertung abgeben</h2>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={bewertungName}
                  onChange={(e) => setBewertungName(e.target.value)}
                  className="w-full border-2 p-3 rounded-lg"
                  placeholder="Ihr Name"
                />
                
                <div>
                  <p className="mb-2">Bewertung: {bewertung} Sterne</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(stern => (
                      <Star 
                        key={stern}
                        className={`w-10 h-10 cursor-pointer ${stern <= bewertung ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                        onClick={() => setBewertung(stern)}
                      />
                    ))}
                  </div>
                </div>

                <textarea 
                  value={bewertungstext}
                  onChange={(e) => setBewertungstext(e.target.value)}
                  className="w-full border-2 p-3 h-32 rounded-lg"
                  placeholder="Ihre Nachricht..."
                />
                
                <button 
                  onClick={bewertungSenden}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Bewertung senden
                </button>
              </div>
            </div>

            {/* Kontakt */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-amber-800 mb-6">Kontakt</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🐓</div>
                  <div>
                    <h3 className="font-bold text-lg">{besitzerInfo.name}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-amber-600" />
                  <a href={`mailto:${besitzerInfo.email}`} className="text-blue-600 hover:underline">{besitzerInfo.email}</a>
                </div>
              </div>
            </div>

            {/* Admin */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-4 border-amber-600">
              <h2 className="text-2xl font-bold text-amber-800 mb-4">🔐 Admin-Bereich</h2>
              
              {!istAngemeldet ? (
                <div className="space-y-4">
                  <input 
                    type="password" 
                    value={adminPasswort}
                    onChange={(e) => setAdminPasswort(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && adminLogin()}
                    className="w-full border-2 p-3 rounded-lg"
                    placeholder="Admin-Passwort"
                  />
                  <button 
                    onClick={adminLogin}
                    className="w-full bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-amber-700"
                  >
                    Anmelden
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-semibold">Neuer Bestand:</label>
                    <input 
                      type="number" 
                      value={neuerBestand}
                      onChange={(e) => setNeuerBestand(Number(e.target.value))}
                      className="w-full border-2 p-3 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-semibold">Eierkartons benötigt?</label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setKartonsBedarf(true)}
                        className={`flex-1 py-2 rounded-lg font-semibold ${kartonsBedarf ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      >
                        Ja
                      </button>
                      <button 
                        onClick={() => setKartonsBedarf(false)}
                        className={`flex-1 py-2 rounded-lg font-semibold ${!kartonsBedarf ? 'bg-gray-600 text-white' : 'bg-gray-200'}`}
                      >
                        Nein
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={bestandAktualisieren}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
                  >
                    Bestand speichern
                  </button>
                  
                  <button 
                    onClick={() => setIstAngemeldet(false)}
                    className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
                  >
                    Abmelden
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      <footer className="bg-gray-800 text-white text-center p-6 mt-12">
        <p className="font-bold">Frederiks Druckwelt & Fredeggs</p>
        <p className="text-sm mt-2">© 2024</p>
      </footer>
    </div>
  );
}
