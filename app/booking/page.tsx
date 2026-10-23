"use client";

import { FormEvent, useEffect, useState } from "react";

const towns = ["Nairobi", "Nakuru", "Eldoret", "Kisumu", "Mombasa", "Nyeri", "Kakamega", "Kericho", "Kisii", "Kitale", "Meru", "Thika", "Mbale", "Bungoma", "Busia", "Malindi", "Naivasha", "Heaven's Gate"];

export default function BookingPage() {
  const [from, setFrom] = useState("Nairobi");
  const [to, setTo] = useState("Nakuru");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [logoPhoto, setLogoPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/site-photos", { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then((data) => { if (data?.slots?.logo) setLogoPhoto(data.slots.logo); }).catch(() => undefined);
    const params = new URLSearchParams(window.location.search);
    const requestedFrom = params.get("from");
    const requestedTo = params.get("to");
    if (requestedFrom && towns.includes(requestedFrom)) setFrom(requestedFrom);
    if (requestedTo && towns.includes(requestedTo)) setTo(requestedTo);
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  function swapRoute() {
    setFrom(to);
    setTo(from);
  }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (from === to) {
      setNotice("Please choose two different towns.");
      return;
    }
    const message = [
      "PRESTIGE SHUTTLE — BOOKING REQUEST",
      "",
      "Passenger: " + name.trim(),
      "Phone: " + phone.trim(),
      "Email: " + (email.trim() || "Not provided"),
      "From: " + from,
      "Destination: " + to,
      "Travel date: " + date,
      "Passengers: " + passengers,
      "",
      "Please confirm availability, departure time and total fare.",
      "I understand this is a booking request and is not confirmed until Prestige Shuttle replies."
    ].join("\n");
    setNotice("Opening WhatsApp with your booking details. Tap Send in WhatsApp to send your request.");
    window.location.href = "https://wa.me/254733672905?text=" + encodeURIComponent(message);
  }

  return (
    <main className="booking-page">
      <div className="announcement"><span className="pulse-dot" /> PRESTIGE SHUTTLE <span className="announcement-divider">·</span> BOOK YOUR JOURNEY</div>
      <header className="nav wrap booking-nav">
        <a href="/" className="brand" aria-label="Prestige Shuttle home">{logoPhoto ? <img className="brand-logo" src={logoPhoto} alt="Prestige Shuttle logo" /> : <span className="brand-mark">S</span>}<span>Prestige<span className="brand-light"> Shuttle</span><small>TRAVEL WITH CONFIDENCE</small></span></a>
        <a className="nav-cta" href="/">Back to home <span>↗</span></a>
      </header>

      <section className="booking-page-hero">
        <div className="booking-page-photo" aria-hidden="true" />
        <div className="booking-page-shade" aria-hidden="true" />
        <div className="wrap booking-page-intro">
          <span className="eyebrow"><span /> YOUR NEXT JOURNEY STARTS HERE</span>
          <h1>Book your <em>journey.</em></h1>
          <p>Share your travel details and send your request directly to Prestige Shuttle on WhatsApp.</p>
        </div>
      </section>

      <section className="booking-form-section">
        <div className="wrap booking-layout">
          <form className="booking-form-card" onSubmit={submitBooking}>
            <div className="booking-form-heading">
              <span className="section-kicker">TRAVEL DETAILS</span>
              <h2>Where are you going?</h2>
              <p>Fill in your trip and passenger details below.</p>
            </div>

            <div className="booking-route-fields">
              <label className="booking-field"><span>FROM</span><select value={from} onChange={(e) => setFrom(e.target.value)} required>{towns.map((town) => <option key={town} value={town}>{town}</option>)}</select></label>
              <button className="booking-swap" type="button" onClick={swapRoute} aria-label="Swap departure and destination">⇄</button>
              <label className="booking-field"><span>TO</span><select value={to} onChange={(e) => setTo(e.target.value)} required>{towns.map((town) => <option key={town} value={town}>{town}</option>)}</select></label>
              <label className="booking-field"><span>TRAVEL DATE</span><input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} required /></label>
              <label className="booking-field"><span>PASSENGERS</span><select value={passengers} onChange={(e) => { setPassengers(e.target.value); setNotice(""); }}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n === 1 ? "Passenger" : "Passengers"}</option>)}</select></label>
            </div>

            <div className="booking-form-divider" />
            <div className="booking-form-heading passenger-heading">
              <span className="section-kicker">PASSENGER INFORMATION</span>
              <h2>Who is travelling?</h2>
            </div>
            <div className="booking-passenger-fields">
              <label className="booking-field"><span>FULL NAME</span><input type="text" autoComplete="name" placeholder="As shown on your ID" value={name} onChange={(e) => setName(e.target.value)} required /></label>
              <label className="booking-field"><span>PHONE NUMBER</span><input type="tel" autoComplete="tel" placeholder="07XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} required /></label>
              <label className="booking-field booking-email-field"><span>EMAIL (OPTIONAL)</span><input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            </div>

            {from === to && <p className="booking-inline-error">Choose two different towns before continuing.</p>}
            <button className="search-button booking-submit" type="submit" disabled={from === to}>Send booking request on WhatsApp <span>→</span></button>
            {notice && <p className="booking-notice" role="status">{notice}</p>}
            <p className="booking-form-note">Your WhatsApp message will be prepared with these details. Your trip is not confirmed until our team replies.</p>
          </form>

          <aside className="booking-help-card">
            <span className="booking-help-icon">✦</span>
            <span className="section-kicker">NEED HELP?</span>
            <h2>We’re here to help.</h2>
            <p>Have a question before booking? Contact our team and we’ll help you plan your trip.</p>
            <a href="https://wa.me/254733672905" target="_blank" rel="noreferrer" className="booking-help-link">Chat on WhatsApp <span>↗</span></a>
            <a href="tel:0733672905" className="booking-phone-link">Call 0733 672 905</a>
          </aside>
        </div>
      </section>

      <footer className="booking-page-footer"><div className="wrap"><a href="/">← Back to Prestige Shuttle</a><span>Travel with confidence.</span></div></footer>
    </main>
  );
}
