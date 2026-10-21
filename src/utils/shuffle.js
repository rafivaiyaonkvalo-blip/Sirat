/**
 * সমান সম্ভাবনায় এলোমেলো করা (Fisher–Yates); মূল তালিকা বদলায় না।
 * `list.sort(() => 0.5 - Math.random())` পক্ষপাতদুষ্ট — ৪টি অপশনে সঠিক উত্তর প্রায় ৩৬% বার
 * প্রথমে ও ৩১% বার শেষে থাকে — তাই অপশন সাজাতে সবসময় এটি ব্যবহার করুন।
 */
export function shuffle(list) {
  const out = [...(list || [])];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default shuffle;
