#!/usr/bin/env node
/**
 * 🚀 Gemini 4 Carbon & Frontier Models Runner for Markazul Iman / Sirat
 * 
 * Usage:
 *   node scripts/run_gemini_carbon.mjs "আপনার প্রশ্ন বা কাজের নির্দেশ"
 *   node scripts/run_gemini_carbon.mjs --file docs/sample.md "এই ফাইলটি বিশ্লেষণ করে সারসংক্ষেপ করো"
 *   node scripts/run_gemini_carbon.mjs --model gemini-4-carbon "জটিল কোডিং বা সমস্যার সমাধান"
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ১. .env বা .env.local থেকে GEMINI_API_KEY খোঁজা
function loadEnvKey() {
  const envFiles = ['.env.local', '.env'];
  for (const f of envFiles) {
    const full = path.join(rootDir, f);
    if (fs.existsSync(full)) {
      const content = fs.readFileSync(full, 'utf8');
      const match = content.match(/^GEMINI_API_KEY\s*=\s*([^\r\n#]+)/m) ||
                    content.match(/^GOOGLE_API_KEY\s*=\s*([^\r\n#]+)/m);
      if (match && match[1].trim()) {
        return match[1].trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }
  return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
}

// ২. আর্গুমেন্ট পার্স করা
const args = process.argv.slice(2);
let model = 'gemini-4-carbon';
let inputFile = null;
let outputFile = null;
let promptParts = [];

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--model' && args[i + 1]) {
    model = args[++i];
  } else if (arg === '--file' && args[i + 1]) {
    inputFile = args[++i];
  } else if (arg === '--out' && args[i + 1]) {
    outputFile = args[++i];
  } else if (arg === '--help' || arg === '-h') {
    console.log(`
🧠 Gemini 4 Carbon Runner (Markazul Iman)
----------------------------------------
ব্যবহারের নিয়ম:
  node scripts/run_gemini_carbon.mjs "আপনার নির্দেশ বা প্রশ্ন"
  node scripts/run_gemini_carbon.mjs --file <পাথ> "ফাইলের ওপর প্রশ্ন"
  node scripts/run_gemini_carbon.mjs --model gemini-4-carbon "প্রম্পট"
  node scripts/run_gemini_carbon.mjs --out result.md "বড় রিপোর্ট তৈরি করো"
    `);
    process.exit(0);
  } else {
    promptParts.push(arg);
  }
}

let userPrompt = promptParts.join(' ').trim();

if (!userPrompt && !inputFile) {
  console.log('\n❌ কোনো প্রম্পট বা ফাইল দেওয়া হয়নি!');
  console.log('উদাহরণ: node scripts/run_gemini_carbon.mjs "এসো আরবি শিখি দারস ১-এর সারসংক্ষেপ করো"\n');
  process.exit(1);
}

if (inputFile) {
  const fullPath = path.resolve(process.cwd(), inputFile);
  if (!fs.existsSync(fullPath)) {
    console.error(`\n❌ ফাইল পাওয়া যায়নি: ${fullPath}\n`);
    process.exit(1);
  }
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  userPrompt = `[ফাইল কনটেন্ট (${inputFile})]:\n\n${fileContent}\n\n---\n[ব্যবহারকারীর নির্দেশ]:\n${userPrompt || 'এই ফাইলটি বিশ্লেষণ করে বিস্তারিত ফলাফল দিন।'}`;
}

const apiKey = loadEnvKey();

if (!apiKey) {
  console.log(`
======================================================================
⚠️  GEMINI_API_KEY পাওয়া যায়নি!
======================================================================
Gemini 4 Carbon ব্যবহার করতে একটি Google API Key প্রয়োজন।

কীভাবে সংগ্রহ করবেন:
১. এই লিঙ্কে যান: https://aistudio.google.com/app/apikey
২. "Create API key" বাটনে ক্লিক করে কী-টি কপি করুন।
৩. আপনার প্রজেক্টের .env.local ফাইলে নিচের লাইনটি যুক্ত করুন:

GEMINI_API_KEY=আপনার_কপি_করা_এপিআই_কী

এরপর আবার কমান্ডটি চালান:
node scripts/run_gemini_carbon.mjs "${userPrompt.slice(0, 40)}..."
======================================================================
  `);
  process.exit(1);
}

async function runGemini() {
  console.log(`\n⏳ [Gemini 4 Carbon Runner] মডেল '${model}'-এর সাথে সংযোগ করা হচ্ছে...`);
  const startTime = Date.now();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.2, // কম তাপমাত্রা = সর্বোচ্চ নির্ভুল ও লজিক্যাল রিজনিং
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      const errMsg = errJson?.error?.message || `HTTP ${res.status} ${res.statusText}`;
      
      console.error(`\n❌ এপিআই এরর: ${errMsg}`);
      if (res.status === 404) {
        console.log(`\n💡 টিপস: '${model}' নামটি আপনার এপিআই কীতে সক্রিয় নাও থাকতে পারে। আপনি চাইলে --model gemini-2.5-pro বা gemini-2.0-flash দিয়ে দেখতে পারেন।`);
      }
      process.exit(1);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.map(p => p.text).join('') || 'কোনো আউটপুট পাওয়া যায়নি।';
    const totalTokens = data.usageMetadata?.totalTokenCount || 0;
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n================== 🌟 ফলাফল (${model} — ${duration}s, টোকেন: ${totalTokens}) ==================\n`);
    console.log(text);
    console.log(`\n============================================================================\n`);

    if (outputFile) {
      const outPath = path.resolve(process.cwd(), outputFile);
      fs.writeFileSync(outPath, text, 'utf8');
      console.log(`✅ ফলাফল সেভ করা হয়েছে: ${outPath}\n`);
    }

  } catch (err) {
    console.error('\n❌ নেটওয়ার্ক বা কানেকশন ত্রুটি:', err.message);
    process.exit(1);
  }
}

runGemini();
