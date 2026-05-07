'use client';

import { useEffect, useState } from 'react';

const DEADLINE = new Date('2026-05-11T23:59:59');
const STRIPE_LINK = 'https://buy.stripe.com/9B6eVd1mc3zofzp2yW9MY05';

const EVENTS = [
  { label: 'Finale LDC', icon: '🏆' },
  { label: 'ATP Rome', icon: '🎾' },
  { label: 'Roland Garros', icon: '🎾' },
  { label: 'Coupe du Monde 2026', icon: '⚽' },
];

function getTimeLeft() {
  const diff = DEADLINE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function FlashOffer() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft>>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (timeLeft === null) return null;

  return (
    <section style={{
      background: 'linear-gradient(135deg, #0d0d1a 0%, #1a0808 55%, #0d0d1a 100%)',
      borderBottom: '1px solid rgba(220,38,38,0.25)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow blobs */}
      <div style={{
        position: 'absolute', top: '-80px', left: '20%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', right: '20%',
        width: '360px', height: '360px',
        background: 'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3.5rem 1.5rem', textAlign: 'center', position: 'relative' }}>

        {/* Badge Offre Flash */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#DC2626', color: 'white',
          fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          padding: '6px 16px', borderRadius: '999px',
          marginBottom: '1.5rem',
          boxShadow: '0 0 20px rgba(220,38,38,0.4)',
        }}>
          <span>⚡</span> Offre Flash Limitée <span>⚡</span>
        </div>

        {/* Events */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '1.75rem' }}>
          {EVENTS.map((e) => (
            <span key={e.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '13px', fontWeight: 500,
              padding: '5px 14px', borderRadius: '999px',
            }}>
              {e.icon} {e.label}
            </span>
          ))}
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
          textTransform: 'uppercase',
          color: 'white',
          lineHeight: 1.05,
          letterSpacing: '0.03em',
          marginBottom: '0.5rem',
        }}>
          2 Mois VIP PrognoBeast
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Sans engagement · Accès immédiat · Places limitées
        </p>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1.4rem', textDecoration: 'line-through' }}>29,99 €</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px' }}>pour 2 mois</div>
          </div>
          <div style={{ fontSize: '2rem', color: '#C9A84C' }}>→</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#C9A84C', lineHeight: 1 }}>19,99 €</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '2px' }}>pour 2 mois</div>
          </div>
        </div>

        {/* Countdown */}
        <p style={{
          color: 'rgba(255,255,255,0.4)', fontSize: '11px',
          textTransform: 'uppercase', letterSpacing: '0.12em',
          marginBottom: '0.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          Offre expire dans
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '2.25rem' }}>
          {([
            { value: timeLeft.days, label: 'Jours' },
            { value: timeLeft.hours, label: 'Heures' },
            { value: timeLeft.minutes, label: 'Min' },
            { value: timeLeft.seconds, label: 'Sec' },
          ] as const).map(({ value, label }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              padding: '12px 16px',
              minWidth: '64px',
            }}>
              <div style={{
                fontSize: '2rem', fontWeight: 800, color: 'white',
                fontVariantNumeric: 'tabular-nums', lineHeight: 1,
              }}>
                {String(value).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href={STRIPE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#DC2626',
            color: 'white',
            fontSize: '16px', fontWeight: 700,
            padding: '15px 36px', borderRadius: '12px',
            textDecoration: 'none',
            boxShadow: '0 0 30px rgba(220,38,38,0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            marginBottom: '1rem',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.04)';
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 40px rgba(220,38,38,0.5)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 30px rgba(220,38,38,0.35)';
          }}
        >
          <span>⚡</span>
          J&apos;en profite maintenant
        </a>

        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
          Offre valable jusqu&apos;au 11 Mai à minuit · Places limitées
        </p>
      </div>
    </section>
  );
}
