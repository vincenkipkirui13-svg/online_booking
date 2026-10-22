"use client";

import { FormEvent, useMemo, useState } from "react";

const towns = ["Nairobi", "Nakuru", "Eldoret", "Kisumu", "Mombasa", "Nyeri", "Kakamega", "Kericho", "Kisii", "Kitale", "Meru", "Thika"];
const sampleTrips = [
  { id: "t1", from: "Nairobi", to: "Nakuru", depart: "06:30", arrive: "09:00", duration: "2h 30m", fare: 800, bus: "Executive Coach", seats: 18 },
  { id: "t2", from: "Nairobi", to: "Nakuru", depart: "09:00", arrive: "11:30", duration: "2h 30m", fare: 800, bus: "Comfort Coach", seats: 11 },
  { id: "t3", from: "Nairobi", to: "Nakuru", depart: "14:00", arrive: "16:30", duration: "2h 30m", fare: 750, bus: "Standard Coach", seats: 23 },
  { id: "t4", from: "Nairobi", to: "Eldoret", depart: "07:00", arrive: "13:00", duration: "6h", fare: 1600, bus: "Executive Coach", seats: 16 },
  { id: "t5", from: "Nairobi", to: "Kisumu", depart: "08:00", arrive: "14:00", duration: "6h", fare: 1500, bus: "Comfort Coach", seats: 9 },
  { id: "t6", from: "Nairobi", to: "Mombasa", depart: "21:00", arrive: "05:30", duration: "8h 30m", fare: 2200, bus: "Sleeper Coach", seats: 12 },
  { id: "t7", from: "Nakuru", to: "Nairobi", depart: "07:30", arrive: "10:00", duration: "2h 30m", fare: 800, bus: "Executive Coach", seats: 20 },
  { id: "t8", from: "Eldoret", to: "Nairobi", depart: "06:00", arrive: "12:00", duration: "6h", fare: 1600, bus: "Executive Coach", seats: 14 },
  { id: "t9", from: "Kisumu", to: "Nairobi", depart: "08:30", arrive: "14:30", duration: "6h", fare: 1500, bus: "Comfort Coach", seats: 17 },
  { id: "t10", from: "Mombasa", to: "Nairobi", depart: "20:30", arrive: "05:00", duration: "8h 30m", fare: 2200, bus: "Sleeper Coach", seats: 10 }
];

const money = (amount: number) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(amount);

export default function Home() {
  const [from, setFrom] = useState("Nairobi");
  const [to, setTo] = useState("Nakuru");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [paymentInfo, setPaymentInfo] = useState<{ type: string; number: string | null; accountName: string | null; configured: boolean } | null>(null);
  const [loadingPaymentInfo, setLoadingPaymentInfo] = useState(false);

  const results = useMemo(() => sampleTrips.filter((trip) => trip.from === from && trip.to === to), [from, to]);
  const today = new Date().toISOString().slice(0, 10);

  function searchTrips(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearched(true);
    setSelected(null);
    setNotice("");
    document.getElementById("trip-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function swapRoute() {
    setFrom(to);
    setTo(from);
    setSearched(false);
  }

  async function continueBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setPaymentInfo(null);
    setLoadingPaymentInfo(true);
    try {
      const response = await fetch("/api/payment-instructions", { cache: "no-store" });
      if (!response.ok) throw new Error("Payment instructions are not available right now.");
      const info = await response.json();
      setPaymentInfo(info);
      setNotice("Payment confirmation is handled by the business. After you send money, keep your M-Pesa message and wait for confirmation. This website is still a preview; real bookings are not active yet.");
    } catch {
      setNotice("Payment instructions are not available yet. Please contact the business before sending any money.");
    } finally {
      setLoadingPaymentInfo(false);
    }
  }

  return (
    <main>
      <div className="announcement"><span className="pulse-dot" /> YOUR JOURNEY, MADE SIMPLE <span className="announcement-divider">·</span> TRAVEL ACROSS KENYA</div>
      <header className="nav wrap">
        <a href="#" className="brand" aria-label="SafariLine home"><span className="brand-mark">S</span><span>Safari<span className="brand-light">Line</span><small>TRAVEL WITH EASE</small></span></a>
        <nav><a href="#routes">Popular routes</a><a href="#why-us">Why SafariLine</a><a href="#help">Help</a></nav>
        <a className="nav-cta" href="#book">Book a trip <span>↗</span></a>
      </header>

      <section className="hero">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content wrap">
          <div className="eyebrow"><span /> YOUR NEXT ADVENTURE STARTS HERE</div>
          <h1>Kenya is waiting.<br /><em>Let&apos;s get you there.</em></h1>
          <p>Easy bus bookings for the places, people and moments that matter. Your journey begins in a few clicks.</p>
          <div className="hero-perks"><span><b>✓</b> Simple booking</span><span><b>✓</b> Pay by M-Pesa</span><span><b>✓</b> Seat choice</span></div>
        </div>
        <div className="booking-wrap wrap" id="book">
          <form className="search-card" onSubmit={searchTrips}>
            <div className="search-heading"><div><span className="section-kicker">PLAN YOUR JOURNEY</span><h2>Where are you headed?</h2></div><span className="one-way">ONE WAY TRIP</span></div>
            <div className="search-grid">
              <label className="field"><span>FROM</span><div className="field-input"><span className="field-icon">⌖</span><select value={from} onChange={(e) => setFrom(e.target.value)}>{towns.map((town) => <option key={town}>{town}</option>)}</select></div></label>
              <button className="swap-button" type="button" onClick={swapRoute} aria-label="Swap departure and destination">⇄</button>
              <label className="field"><span>TO</span><div className="field-input"><span className="field-icon destination">◎</span><select value={to} onChange={(e) => setTo(e.target.value)}>{towns.map((town) => <option key={town}>{town}</option>)}</select></div></label>
              <label className="field"><span>TRAVEL DATE</span><div className="field-input"><span className="field-icon">▦</span><input required type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} /></div></label>
              <label className="field"><span>PASSENGERS</span><div className="field-input"><span className="field-icon">♙</span><select value={passengers} onChange={(e) => setPassengers(e.target.value)}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n === 1 ? "Passenger" : "Passengers"}</option>)}</select></div></label>
            </div>
            {from === to && <p className="inline-error">Choose two different towns to search for a trip.</p>}
            <button className="search-button" type="submit" disabled={from === to}>Search available trips <span>→</span></button>
            <p className="search-footnote"><span>♧</span> Send payment directly to the business Paybill or Till. The business confirms your payment.</p>
          </form>
        </div>
      </section>

      <section className="trust-strip"><div className="wrap trust-items"><div><span className="trust-icon">⌁</span><span><b>Made for Kenya</b><small>Town-to-town travel</small></span></div><div><span className="trust-icon">▣</span><span><b>Choose your seat</b><small>Pick a spot you love</small></span></div><div><span className="trust-icon">↗</span><span><b>Pay by M-Pesa</b><small>Business Paybill or Till</small></span></div><div><span className="trust-icon">♡</span><span><b>Here to help</b><small>Support when you need it</small></span></div></div></section>

      <section className="results-section wrap" id="trip-results">
        {searched ? <><div className="results-heading"><div><span className="section-kicker">YOUR SEARCH</span><h2>{from} <span className="route-arrow">→</span> {to}</h2><p>{date ? new Date(date + "T12:00:00").toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : "Select a travel date"} · {passengers} passenger{passengers === "1" ? "" : "s"}</p></div><button className="text-button" onClick={() => setSearched(false)}>Edit search ↗</button></div>
          <div className="demo-notice"><span>ⓘ</span><div><b>Preview schedules</b><p>These are sample trips to demonstrate the booking experience. Actual routes, departure times, seats and fares will be configured by your business before launch.</p></div></div>
          {results.length ? <div className="trip-list">{results.map((trip) => <article className="trip-card" key={trip.id}><div className="trip-time"><strong>{trip.depart}</strong><span>{trip.from}</span></div><div className="trip-duration"><span>{trip.duration}</span><div><i /><span className="duration-line" /><i /></div><small>Direct trip</small></div><div className="trip-time"><strong>{trip.arrive}</strong><span>{trip.to}</span></div><div className="trip-bus"><span className="bus-icon">▰</span><span><b>{trip.bus}</b><small>{trip.seats} sample seats shown</small></span></div><div className="trip-price"><span>From</span><strong>{money(trip.fare)}</strong><button onClick={() => { setSelected(trip.id); setNotice(""); }}>Choose seats <span>→</span></button></div></article>)}</div> : <div className="empty-state"><span>⌁</span><h3>No preview trips for this route yet</h3><p>Try a popular route such as Nairobi to Nakuru, Eldoret, Kisumu or Mombasa. More routes will be added from the admin dashboard.</p></div>}
          {selected && <div className="booking-panel"><button className="close-panel" onClick={() => setSelected(null)} aria-label="Close booking form">×</button><span className="section-kicker">NEXT STEP</span><h3>Passenger details</h3><p>Selected: {results.find((trip) => trip.id === selected)?.from} to {results.find((trip) => trip.id === selected)?.to} · {date || "Date not selected"}</p><form onSubmit={continueBooking} className="passenger-form"><label>Passenger full name<input required placeholder="As shown on your ID" /></label><label>Mobile number<input required type="tel" pattern="(\+?254|0)?[17][0-9]{8}" placeholder="07XX XXX XXX" /></label><label>Email (optional)<input type="email" placeholder="you@example.com" /></label><label>Payment method<select defaultValue="mpesa"><option value="mpesa">M-Pesa Paybill / Till</option></select></label><button className="search-button" type="submit" disabled={loadingPaymentInfo}>{loadingPaymentInfo ? "Loading payment details…" : "Show M-Pesa payment details"} <span>→</span></button></form>
          {paymentInfo && <section className="payment-details" aria-live="polite">
            <span className="section-kicker">M-PESA PAYMENT</span>
            <h4>{paymentInfo.type === "TILL" ? "Pay to our Till number" : "Pay to our Paybill number"}</h4>
            {paymentInfo.configured ? <><div className="payment-number">{paymentInfo.number}</div>{paymentInfo.accountName && <p className="payment-account">Business name: <strong>{paymentInfo.accountName}</strong></p>}</> : <p className="payment-missing">The business payment number has not been configured yet. Do not send money until the correct number appears here.</p>}
            <p>Send the fare using M-Pesa. The business will check its payment records and confirm your booking manually. Never share your M-Pesa PIN.</p>
          </section>}
          {notice && <div className="inline-notice" role="status">{notice}</div>}</div>}
        </> : <div className="popular-heading" id="routes"><div><span className="section-kicker">GO SOMEWHERE NEW</span><h2>Popular journeys</h2><p>From quick getaways to long-distance adventures.</p></div><span className="popular-note">YOUR KENYA, YOUR WAY <span>✳</span></span></div>}
        {!searched && <div className="route-cards">{[{from:"Nairobi",to:"Nakuru",time:"Approx. 2.5 hours",price:"KSh 750",image:"route-lake",tag:"A QUICK GETAWAY"},{from:"Nairobi",to:"Eldoret",time:"Approx. 6 hours",price:"KSh 1,600",image:"route-hills",tag:"THE WEST CALLS"},{from:"Nairobi",to:"Mombasa",time:"Approx. 8.5 hours",price:"KSh 2,200",image:"route-coast",tag:"COASTAL ESCAPE"}].map((route) => <button className="route-card" key={route.to} onClick={() => { setFrom(route.from); setTo(route.to); setSearched(false); document.getElementById("book")?.scrollIntoView({behavior:"smooth"}); }}><div className={"route-photo " + route.image}><span>{route.tag}</span><span className="route-photo-arrow">↗</span></div><div className="route-card-body"><div><span>{route.from} <span className="route-arrow">→</span> {route.to}</span><small>{route.time}</small></div><strong>{route.price}<small> / person</small></strong></div></button>)}</div>}
      </section>

      <section className="why-section" id="why-us"><div className="wrap why-grid"><div><span className="section-kicker">TRAVEL, WITHOUT THE FUSS</span><h2>Less planning.<br /><em>More living.</em></h2><p>We believe getting there should be part of the good experience. We&apos;re building a simpler way to explore Kenya, one journey at a time.</p><a href="#book" className="dark-link">Plan your next trip <span>→</span></a></div><div className="why-points"><article><span>01</span><div><h3>Choose what works for you</h3><p>Compare journey times, fares and seat options in one place.</p></div></article><article><span>02</span><div><h3>Book around your day</h3><p>Find a departure that fits your plans, whether early or late.</p></div></article><article><span>03</span><div><h3>Pay your way</h3><p>Pay directly to the business Paybill or Till. The business will check the payment and confirm your booking.</p></div></article></div></div></section>

      <footer id="help"><div className="wrap footer-main"><a href="#" className="brand footer-brand"><span className="brand-mark">S</span><span>Safari<span className="brand-light">Line</span><small>TRAVEL WITH EASE</small></span></a><p>Your journey, your people, your Kenya.<br />We&apos;re getting ready to take you places.</p><div className="footer-links"><a href="#book">Find a trip</a><a href="#routes">Popular routes</a><a href="mailto:hello@safariline.co.ke">Contact support</a></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} SafariLine. All rights reserved.</span><span>Made for journeys across Kenya <span className="kenya-dot">●</span></span></div></footer>
    </main>
  );
}
