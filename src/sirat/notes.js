// বুকমার্ক ও নোট: প্রতিটি অনুচ্ছেদে একটি বুকমার্ক এবং/অথবা নোট। ডিভাইসে জমা থাকে;
// লগইন থাকলে Firestore-এর notes/{uid}-এ (শুধু নিজে পড়তে-লিখতে পারে) সিঙ্ক হয়।
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../services/firebase';

const KEY = 'sirat_notes_v1';
const MAX_ITEMS = 400;
const SYNC_MS = 2500;

const cloud = () => isFirebaseConfigured() && !!db;
let timer = null;

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
};
let items = load();

// লগআউটে (clearLocalUserData) কী মোছা হলে মেমরির নোটও ছাড়া
try {
  window.addEventListener('uls_progress_changed', () => {
    if (Object.keys(items).length && !localStorage.getItem(KEY)) { items = {}; emit(); }
  });
} catch { /* ignore */ }

const emit = () => { try { window.dispatchEvent(new CustomEvent('sirat_notes_changed')); } catch { /* ignore */ } };
const persist = () => {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ }
  emit();
  schedulePush();
};

export const noteKey = (dars, porbo, block) => `${dars}-${porbo}-${block}`;
export const getNotes = () => items;
export const getNote = (key) => items[key] || null;

const upsert = (key, patch) => {
  const cur = items[key] || {};
  const next = { ...cur, ...patch, updatedAt: Date.now() };
  if (!next.bookmark && !next.note) delete items[key];
  else items[key] = next;
  persist();
};

// meta: { dars, porbo, block, snippet }
export function toggleBookmark(meta) {
  const key = noteKey(meta.dars, meta.porbo, meta.block);
  const on = !!items[key]?.bookmark;
  if (!on && Object.keys(items).length >= MAX_ITEMS) return false;
  upsert(key, { dars: meta.dars, porbo: meta.porbo, block: meta.block, snippet: meta.snippet.slice(0, 160), bookmark: !on });
  return true;
}

export function saveNote(meta, text) {
  const key = noteKey(meta.dars, meta.porbo, meta.block);
  const t = (text || '').trim().slice(0, 1000);
  if (!items[key] && Object.keys(items).length >= MAX_ITEMS) return false;
  upsert(key, { dars: meta.dars, porbo: meta.porbo, block: meta.block, snippet: meta.snippet.slice(0, 160), note: t });
  return true;
}

export function useNotes() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const on = () => setTick((n) => n + 1);
    window.addEventListener('sirat_notes_changed', on);
    return () => window.removeEventListener('sirat_notes_changed', on);
  }, []);
  return items;
}

// ---- ক্লাউড সিঙ্ক ----
function schedulePush() {
  if (!cloud() || !auth?.currentUser) return;
  clearTimeout(timer);
  timer = setTimeout(pushNotes, SYNC_MS);
}

export async function pushNotes() {
  const user = auth?.currentUser;
  if (!cloud() || !user) return false;
  try {
    await setDoc(doc(db, 'notes', user.uid), { items, updatedAt: new Date().toISOString() });
    return true;
  } catch {
    return false;
  }
}

// লগইনের পর: ক্লাউড ও ডিভাইসের নোট মিলিয়ে (প্রতিটির নতুনটি জেতে) দুই জায়গাতেই রাখা
export async function syncNotesAccount(user) {
  if (!user || !cloud()) return;
  try {
    const snap = await getDoc(doc(db, 'notes', user.uid));
    const remote = snap.exists() ? snap.data().items || {} : {};
    const merged = { ...remote };
    for (const [k, v] of Object.entries(items)) {
      if (!merged[k] || (v.updatedAt || 0) > (merged[k].updatedAt || 0)) merged[k] = v;
    }
    items = merged;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ }
    emit();
    await pushNotes();
  } catch { /* অফলাইন: পরে আবার */ }
}

// লগআউটে ডিভাইসের নোট মোছা (অন্য অ্যাকাউন্টের সাথে মিশে না যেতে)
export function clearNotesLocal() {
  items = {};
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  emit();
}
