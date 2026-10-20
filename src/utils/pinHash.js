/**
 * অ্যাডমিন পাসওয়ার্ড সুরক্ষা: কোডে পাসওয়ার্ড লেখা থাকে না, শুধু তার PBKDF2-SHA256 হ্যাশ।
 * লগইনের সময় লেখা পাসওয়ার্ডের হ্যাশ বানিয়ে মেলানো হয়। হ্যাশ থেকে পাসওয়ার্ড বের করা যায় না,
 * আর ২,১০,০০০ বার হ্যাশ করায় অনুমান করে খোঁজাও খুব ধীর।
 */
const SALT = 'uls-arabic-admin-pin-v1';
const ITERATIONS = 210000;

export async function hashPin(pin) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(String(pin)), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(SALT), iterations: ITERATIONS },
    key,
    256
  );
  return Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
