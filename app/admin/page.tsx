"use client";
import "./admin.css";

import { FormEvent, useEffect, useState } from "react";

type Photo = { url: string; pathname: string; uploadedAt?: string };
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadPhotos() {
    const response = await fetch("/api/admin/photos", { cache: "no-store" });
    if (response.ok) { const data = await response.json(); setPhotos(data.photos || []); }
  }
  useEffect(() => { if (loggedIn) void loadPhotos(); }, [loggedIn]);

  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sign-in failed.");
      setLoggedIn(true); setPassword(""); setNotice("Signed in. You can now upload your real Prestige Shuttle photos.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Sign-in failed."); }
    finally { setBusy(false); }
  }
  async function upload(event: FormEvent) {
    event.preventDefault(); if (!files?.length) { setNotice("Choose one or more photos first."); return; }
    const body = new FormData(); Array.from(files).forEach((file) => body.append("photos", file));
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/photos", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      setNotice(data.uploaded.length + " photo(s) uploaded to persistent storage."); setFiles(null);
      const input = document.getElementById("prestige-photos") as HTMLInputElement | null; if (input) input.value = "";
      await loadPhotos();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Upload failed."); }
    finally { setBusy(false); }
  }
  return <main className="admin-shell"><div className="admin-card">
    <a href="/" className="admin-back">← Prestige Shuttle website</a>
    <p className="admin-kicker">PRESTIGE SHUTTLE • MANAGEMENT</p>
    <h1>Photo dashboard</h1>
    <p className="admin-intro">Upload genuine Prestige Shuttle bus and fleet photos here. Images are stored in Vercel Blob so they persist across deployments.</p>
    {!loggedIn ? <form className="admin-login" onSubmit={login}>
      <label>Username<input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
      <label>Password<input autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <button disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form> : <><form className="admin-upload" onSubmit={upload}>
      <label htmlFor="prestige-photos">Select bus / fleet photos (up to 10 per upload)</label>
      <input id="prestige-photos" type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} />
      <small>Use original photos of your actual vehicles. Each image must be 8 MB or smaller.</small>
      <button disabled={busy}>{busy ? "Working…" : "Upload photos"}</button>
    </form>
    <div className="admin-gallery-title"><h2>Your uploaded photos</h2><span>{photos.length} photos</span></div>
    <div className="admin-gallery">{photos.map((photo) => <article key={photo.pathname}><img src={photo.url} alt="Prestige Shuttle fleet upload" /><a href={photo.url} target="_blank" rel="noreferrer">Open photo ↗</a></article>)}</div>
    </>}
    {notice && <p className="admin-notice" role="status">{notice}</p>}
  </div></main>;
}
