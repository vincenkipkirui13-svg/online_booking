"use client";
import "./admin.css";

import { FormEvent, useEffect, useState } from "react";

type Photo = { url: string; pathname: string; uploadedAt?: string; slot: string };
const placements = [
  { value: "hero", label: "Hero background (main banner)" },
  { value: "route-nakuru", label: "Nairobi → Nakuru route card" },
  { value: "route-eldoret", label: "Nairobi → Eldoret route card" },
  { value: "route-mombasa", label: "Nairobi → Mombasa route card" },
  { value: "gallery", label: "General site photo / gallery" }
];
const slotLabel = (slot: string) => placements.find((item) => item.value === slot)?.label || "General site photo";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [slot, setSlot] = useState("hero");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  async function loadPhotos() {
    setLoadingPhotos(true);
    try {
      const response = await fetch("/api/admin/photos", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load photos.");
      setPhotos(data.photos || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load photos.");
    } finally { setLoadingPhotos(false); }
  }
  useEffect(() => { if (loggedIn) void loadPhotos(); }, [loggedIn]);

  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sign-in failed.");
      setLoggedIn(true); setPassword(""); setNotice("Signed in. Manage every website photo below.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Sign-in failed."); }
    finally { setBusy(false); }
  }
  async function upload(event: FormEvent) {
    event.preventDefault();
    if (!files?.length) { setNotice("Choose one or more photos first."); return; }
    const body = new FormData();
    body.append("slot", slot);
    Array.from(files).forEach((file) => body.append("photos", file));
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/photos", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      setNotice(data.uploaded.length + " photo(s) uploaded to " + slotLabel(slot) + ". The public website will use the newest photo assigned to each placement.");
      setFiles(null);
      const input = document.getElementById("prestige-photos") as HTMLInputElement | null; if (input) input.value = "";
      await loadPhotos();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Upload failed."); }
    finally { setBusy(false); }
  }
  async function removePhoto(photo: Photo) {
    if (!window.confirm("Remove this photo from Prestige Shuttle storage? This cannot be undone.")) return;
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/photos", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pathname: photo.pathname }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not remove photo.");
      setPhotos((current) => current.filter((item) => item.pathname !== photo.pathname));
      setNotice("Photo removed. If it was being used on the site, the website will fall back to the next available photo or its built-in background.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not remove photo."); }
    finally { setBusy(false); }
  }
  const groupedPhotos = placements.map((placement) => ({ ...placement, items: photos.filter((photo) => photo.slot === placement.value || (placement.value === "gallery" && photo.slot !== "hero" && !["route-nakuru", "route-eldoret", "route-mombasa"].includes(photo.slot))) }));

  return <main className="admin-shell"><div className="admin-card">
    <a href="/" className="admin-back">← Prestige Shuttle website</a>
    <p className="admin-kicker">PRESTIGE SHUTTLE • MANAGEMENT</p>
    <h1>Website photo manager</h1>
    <p className="admin-intro">Add or remove the real photographs used across your website. Assign uploads to the hero banner or any route card. Your images are stored persistently in Vercel Blob and survive new deployments.</p>
    {!loggedIn ? <form className="admin-login" onSubmit={login}>
      <label>Username<input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
      <label>Password<input autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <button disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form> : <>
      <form className="admin-upload" onSubmit={upload}>
        <h2>Add website photos</h2>
        <label htmlFor="photo-placement">Where should these photos appear?</label>
        <select id="photo-placement" value={slot} onChange={(e) => setSlot(e.target.value)}>{placements.map((placement) => <option key={placement.value} value={placement.value}>{placement.label}</option>)}</select>
        <label htmlFor="prestige-photos">Choose photos (up to 10 per upload)</label>
        <input id="prestige-photos" type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} />
        <small>Use original photos of your actual vehicles. Each image must be 8 MB or smaller. The newest photo assigned to a placement is shown on the public site.</small>
        <button disabled={busy}>{busy ? "Working…" : "Upload selected photos"}</button>
      </form>
      <div className="admin-gallery-title"><h2>All website photos</h2><span>{photos.length} stored</span></div>
      <p className="admin-intro admin-gallery-help">Remove any photo using its Remove button. The newest image assigned to each placement is displayed on the site; older uploads stay here until you remove them.</p>
      {loadingPhotos ? <p className="admin-empty">Loading your photos…</p> : photos.length === 0 ? <p className="admin-empty">No photos uploaded yet. Add your first genuine fleet photo above.</p> : groupedPhotos.filter((group) => group.items.length > 0).map((group) => <section className="admin-photo-group" key={group.value}>
        <div className="admin-group-heading"><h3>{group.label}</h3><span>{group.items.length}</span></div>
        <div className="admin-gallery">{group.items.map((photo) => <article key={photo.pathname}>
          <img src={photo.url} alt={group.label} />
          <div className="admin-photo-meta"><span>{photo.uploadedAt ? new Date(photo.uploadedAt).toLocaleDateString() : "Uploaded photo"}</span><a href={photo.url} target="_blank" rel="noreferrer">View ↗</a></div>
          <button className="admin-delete" disabled={busy} type="button" onClick={() => void removePhoto(photo)}>Remove photo</button>
        </article>)}</div>
      </section>)}
    </>}
    {notice && <p className="admin-notice" role="status">{notice}</p>}
  </div></main>;
}
