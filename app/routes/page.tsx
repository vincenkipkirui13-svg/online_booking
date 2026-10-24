import type { Metadata } from "next";

const siteUrl = "https://www.prestigeshuttle.online";

export const metadata: Metadata = {
  title: "Shuttle Routes Across Kenya | Prestige Shuttle",
  description:
    "Explore advertised Prestige Shuttle journeys across Kenya, then send a booking request to confirm route availability, departure time and fare.",
  alternates: { canonical: `${siteUrl}/routes` },
  openGraph: {
    title: "Shuttle Routes Across Kenya | Prestige Shuttle",
    description:
      "Explore Prestige Shuttle's advertised journeys and ask about travel to other destinations across Kenya.",
    url: `${siteUrl}/routes`,
    type: "website",
  },
};

const routes = [
  { from: "Nairobi", to: "Nakuru", detail: "A popular connection between the capital and the Rift Valley." },
  { from: "Nairobi", to: "Eldoret", detail: "A long-distance journey connecting Nairobi with western Kenya." },
  { from: "Nairobi", to: "Kisumu", detail: "Travel between Nairobi and the Lake Victoria region." },
  { from: "Nairobi", to: "Mombasa", detail: "Plan a trip between the capital and the coast." },
  { from: "Nairobi", to: "Kericho", detail: "Ask our team to confirm the available journey and schedule." },
  { from: "Nairobi", to: "Kitale", detail: "Check availability for travel towards the Trans-Nzoia region." },
  { from: "Nairobi", to: "Kakamega", detail: "Request current route and fare information before travelling." },
  { from: "Nakuru", to: "Kisumu", detail: "Ask about connections from the Rift Valley towards western Kenya." },
];

export default function RoutesPage() {
  return (
    <main className="booking-page">
      <div className="announcement"><span className="pulse-dot" /> PRESTIGE SHUTTLE <span className="announcement-divider">·</span> ROUTES ACROSS KENYA</div>
      <header className="nav wrap booking-nav">
        <a href="/" className="brand" aria-label="Prestige Shuttle home"><span className="brand-mark">S</span><span>Prestige<span className="brand-light"> Shuttle</span><small>TRAVEL WITH CONFIDENCE</small></span></a>
        <a className="nav-cta" href="/booking">Book a trip <span>↗</span></a>
      </header>
      <section className="booking-page-hero">
        <div className="booking-page-photo" aria-hidden="true" />
        <div className="booking-page-shade" aria-hidden="true" />
        <div className="wrap booking-page-intro">
          <span className="eyebrow"><span /> YOUR JOURNEY STARTS WITH PRESTIGE</span>
          <h1>Explore routes <em>across Kenya.</em></h1>
          <p>Planning a journey? Browse some of the routes advertised on Prestige Shuttle, then contact the team to confirm the latest availability, departure time and fare.</p>
        </div>
      </section>
      <section className="booking-form-section">
        <div className="wrap">
          <div className="booking-form-heading">
            <span className="section-kicker">POPULAR JOURNEYS</span>
            <h2>Where would you like to travel?</h2>
            <p>These are route examples shown on our website. Schedules and fares can change, so please confirm details with Prestige Shuttle before making travel plans or payment.</p>
          </div>
          <div className="route-fare-grid">
            {routes.map((route) => (
              <article className="fare-card" key={route.from + "-" + route.to}>
                <span className="fare-card-icon">↗</span>
                <div><h3>{route.from} to {route.to}</h3><p>{route.detail}</p></div>
                <a className="nav-cta" href={`/booking?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`}>Enquire <span>→</span></a>
              </article>
            ))}
          </div>
          <section className="service-banner">
            <div><span className="section-kicker">TRAVELLING SOMEWHERE ELSE?</span><h2>Ask about your destination</h2><p>Prestige Shuttle serves customers across Kenya. If your town or destination is not listed above, enter it in the booking form and send a request. Our team can confirm whether a suitable journey is available.</p></div>
            <a href="/booking">Request a journey ↗</a>
          </section>
          <p className="booking-form-note">A booking request is not a confirmed reservation. Wait for the team to confirm the journey, fare and departure details.</p>
          <p><a href="/">← Back to Prestige Shuttle home</a></p>
        </div>
      </section>
      <footer className="booking-page-footer"><div className="wrap"><a href="/">← Back to Prestige Shuttle</a><span>Travel with confidence across Kenya.</span></div></footer>
    </main>
  );
}
