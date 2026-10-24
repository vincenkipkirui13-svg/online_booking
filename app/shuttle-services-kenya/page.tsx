import type { Metadata } from "next";

const siteUrl = "https://www.prestigeshuttle.online";

export const metadata: Metadata = {
  title: "Online Shuttle Booking in Kenya | Prestige Shuttle",
  description:
    "Plan inter-town travel across Kenya with Prestige Shuttle. Send your origin, destination, travel date and passenger details online and confirm your trip with the team on WhatsApp.",
  alternates: { canonical: `${siteUrl}/shuttle-services-kenya` },
  openGraph: {
    title: "Online Shuttle Booking in Kenya | Prestige Shuttle",
    description:
      "Request a shuttle journey anywhere in Kenya. Share your trip details online and confirm route availability with Prestige Shuttle.",
    url: `${siteUrl}/shuttle-services-kenya`,
    type: "website",
  },
};

const faqs = [
  {
    question: "Can I enquire about a journey from any part of Kenya?",
    answer:
      "Yes. You can enter your departure town and destination in the booking form, including places that are not in the suggested list. Prestige Shuttle will need to confirm whether the requested journey is available.",
  },
  {
    question: "How do I request a shuttle booking?",
    answer:
      "Open the booking form, enter your origin, destination, travel date, passenger count and contact details, then send the prepared request through WhatsApp. Your trip is not confirmed until the team replies.",
  },
  {
    question: "Are the displayed fares and departure times guaranteed?",
    answer:
      "No. Route availability, fares and departure times must be confirmed directly with Prestige Shuttle before you travel or make a payment.",
  },
  {
    question: "What if my destination is not listed?",
    answer:
      "Type the town or destination into the booking form and send an enquiry. The team can tell you whether the journey is available or whether another arrangement is possible.",
  },
];

export default function ShuttleServicesKenyaPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Prestige Shuttle online journey enquiries",
    serviceType: "Shuttle and inter-town travel booking enquiries",
    provider: {
      "@type": "Organization",
      name: "Prestige Shuttle",
      url: siteUrl,
      telephone: "+254733672905",
      email: "Pshuttleltd@gmail.com",
    },
    areaServed: { "@type": "Country", name: "Kenya" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${siteUrl}/booking`,
    },
  };

  return (
    <main className="booking-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="announcement"><span className="pulse-dot" /> PRESTIGE SHUTTLE <span className="announcement-divider">·</span> SERVING CUSTOMERS ACROSS KENYA</div>
      <header className="nav wrap booking-nav">
        <a href="/" className="brand" aria-label="Prestige Shuttle home"><span className="brand-mark">S</span><span>Prestige<span className="brand-light"> Shuttle</span><small>TRAVEL WITH CONFIDENCE</small></span></a>
        <a className="nav-cta" href="/booking">Request a trip <span>↗</span></a>
      </header>
      <section className="booking-page-hero">
        <div className="booking-page-photo" aria-hidden="true" />
        <div className="booking-page-shade" aria-hidden="true" />
        <div className="wrap booking-page-intro">
          <span className="eyebrow"><span /> ONLINE SHUTTLE BOOKING</span>
          <h1>Travel across Kenya <em>with confidence.</em></h1>
          <p>Prestige Shuttle welcomes journey enquiries from customers throughout Kenya. Tell us where you are travelling from, where you want to go and when you plan to travel.</p>
        </div>
      </section>
      <section className="booking-form-section">
        <div className="wrap">
          <div className="booking-form-heading">
            <span className="section-kicker">HOW IT WORKS</span>
            <h2>Request your journey online</h2>
          </div>
          <div className="why-points">
            <article><span>01</span><div><h3>Enter your route</h3><p>Choose or type your departure town and destination anywhere in Kenya.</p></div></article>
            <article><span>02</span><div><h3>Share your travel details</h3><p>Add your travel date, passenger count and a contact number so the team can respond.</p></div></article>
            <article><span>03</span><div><h3>Confirm before travelling</h3><p>Your request opens in WhatsApp. Wait for Prestige Shuttle to confirm route availability, fare and departure time.</p></div></article>
          </div>
          <div className="service-banner">
            <div><span className="section-kicker">START PLANNING</span><h2>Where in Kenya are you going?</h2><p>Send your travel request and ask the team to confirm the available options.</p></div>
            <a href="/booking">Open booking form ↗</a>
          </div>
          <div className="booking-form-heading">
            <span className="section-kicker">COMMON QUESTIONS</span>
            <h2>Shuttle booking FAQs</h2>
          </div>
          <div className="why-points">
            {faqs.map((faq, index) => <article key={faq.question}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{faq.question}</h3><p>{faq.answer}</p></div></article>)}
          </div>
          <p className="booking-form-note">Prestige Shuttle does not confirm a booking automatically through this form. Check the route, fare and departure details with the team before making payment.</p>
          <p><a href="/routes">Browse advertised routes</a> · <a href="/">Back to homepage</a></p>
        </div>
      </section>
      <footer className="booking-page-footer"><div className="wrap"><a href="/">← Back to Prestige Shuttle</a><span>Travel with confidence across Kenya.</span></div></footer>
    </main>
  );
}
