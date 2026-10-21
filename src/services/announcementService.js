import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'uls_announcements';

/**
 * Fetch all announcements for the Admin Portal
 */
export async function fetchAllAnnouncements() {
  const list = [];
  const ids = new Set();

  // 1. Fetch from Firestore if available
  if (db) {
    try {
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          ...data,
          isCloud: true
        });
        ids.add(docSnap.id);
      });
    } catch (err) {
      console.warn('Firestore announcements fetch error (fallback to local):', err);
    }
  }

  // 2. Fetch and merge from LocalStorage
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    local.forEach((item) => {
      if (!ids.has(item.id)) {
        list.push({
          ...item,
          isCloud: false
        });
        ids.add(item.id);
      }
    });
  } catch (err) {
    console.warn('Local announcements read error:', err);
  }

  return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

/**
 * Fetch active announcements for students
 */
export async function fetchActiveAnnouncements() {
  const all = await fetchAllAnnouncements();
  const now = new Date();

  return all.filter((item) => {
    if (!item.isActive) return false;
    if (item.expiresAt && new Date(item.expiresAt) < now) return false;
    return true;
  });
}

/**
 * Create a new announcement
 */
export async function createAnnouncement({
  title,
  message,
  type = 'info', // 'info', 'urgent', 'success', 'class'
  linkText = '',
  linkUrl = '',
  isActive = true,
  expiresAt = null
}) {
  const id = `ann_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  const newAnnouncement = {
    id,
    title: (title || '').trim(),
    message: (message || '').trim(),
    type,
    linkText: (linkText || '').trim(),
    linkUrl: (linkUrl || '').trim(),
    isActive: Boolean(isActive),
    expiresAt: expiresAt || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Save to Firestore
  if (db) {
    try {
      const docRef = doc(db, 'announcements', id);
      await setDoc(docRef, newAnnouncement);
    } catch (err) {
      console.warn('Firestore announcement save error:', err);
    }
  }

  // Save to LocalStorage
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    local.unshift(newAnnouncement);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
  } catch (err) {
    console.warn('LocalStorage announcement save error:', err);
  }

  window.dispatchEvent(new CustomEvent('uls_announcements_updated'));
  return newAnnouncement;
}

/**
 * Update an announcement
 */
export async function updateAnnouncement(id, updates) {
  const updatedAt = new Date().toISOString();
  const payload = { ...updates, updatedAt };

  // Update in Firestore
  if (db) {
    try {
      const docRef = doc(db, 'announcements', id);
      await updateDoc(docRef, payload);
    } catch (err) {
      console.warn('Firestore announcement update error:', err);
    }
  }

  // Update in LocalStorage
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const idx = local.findIndex((a) => a.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...payload };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
    }
  } catch (err) {
    console.warn('LocalStorage announcement update error:', err);
  }

  window.dispatchEvent(new CustomEvent('uls_announcements_updated'));
  return true;
}

/**
 * Toggle active state of an announcement
 */
export async function toggleAnnouncementActive(id, currentStatus) {
  return updateAnnouncement(id, { isActive: !currentStatus });
}

/**
 * Delete an announcement
 */
export async function deleteAnnouncement(id) {
  // Delete from Firestore
  if (db) {
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (err) {
      console.warn('Firestore announcement delete error:', err);
    }
  }

  // Delete from LocalStorage
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const filtered = local.filter((a) => a.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('LocalStorage announcement delete error:', err);
  }

  window.dispatchEvent(new CustomEvent('uls_announcements_updated'));
  return true;
}
