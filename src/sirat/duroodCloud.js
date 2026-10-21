// সম্মিলিত দুরূদ গণনা: Firestore ডক campaigns/durood { count, target }
// Firebase কনফিগ (VITE_FIREBASE_*) না থাকলে cloudEnabled() মিথ্যা, তখন শুধু ব্যক্তিগত গণনা চলে।
import { doc, increment, onSnapshot, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../services/firebase';

export const cloudEnabled = () => isFirebaseConfigured() && !!db;

const ref = () => doc(db, 'campaigns', 'durood');

// লাইভ মোট; ত্রুটি হলে cb(null)
export function subscribeGlobal(cb) {
  if (!cloudEnabled()) return () => {};
  return onSnapshot(
    ref(),
    (snap) => cb({ count: snap.exists() ? Number(snap.data().count) || 0 : 0, target: snap.exists() ? Number(snap.data().target) || 0 : 0 }),
    () => cb(null),
  );
}

// একবারে সর্বোচ্চ MAX_BATCH যোগ হয়; বাকিটা পরের ফ্লাশে
export const MAX_BATCH = 200;

export async function addToGlobal(n) {
  const amount = Math.min(Math.max(Math.floor(n), 0), MAX_BATCH);
  if (!amount || !cloudEnabled()) return 0;
  await setDoc(ref(), { count: increment(amount) }, { merge: true });
  return amount;
}
