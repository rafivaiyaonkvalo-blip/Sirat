import crypto from 'node:crypto';

const TARGET_TEN_LAKH = 1000000;
const CAMPAIGN_TITLE = 'একসাথে ১০ লক্ষ দরূদ';

let cachedParticipantId = null;
let lastKnownSnapshot = {
  title: CAMPAIGN_TITLE,
  target: TARGET_TEN_LAKH,
  isActive: true,
  total: 148639,
  updatedAt: new Date().toISOString()
};

async function ensureParticipantId(preferredId) {
  const pid = (preferredId && /^[0-9a-f-]{36}$/i.test(preferredId))
    ? preferredId
    : (cachedParticipantId || crypto.randomUUID());

  try {
    const res = await fetch('https://sirat.markazuliman.com/api/durud/session', {
      headers: {
        'Cookie': `sirat_durud_participant=${pid}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      cache: 'no-store'
    });
    if (res.ok) {
      cachedParticipantId = pid;
      return pid;
    }
  } catch (err) {
    console.warn('Session init warning:', err);
  }
  cachedParticipantId = pid;
  return pid;
}

async function fetchStats() {
  const res = await fetch('https://sirat.markazuliman.com/api/durud/stats', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(`Stats HTTP ${res.status}`);
  const data = await res.json();
  const effectiveTarget = Math.max(Number(data.target) || 0, TARGET_TEN_LAKH);
  lastKnownSnapshot = {
    title: CAMPAIGN_TITLE,
    target: effectiveTarget,
    isActive: Boolean(data.isActive),
    total: Number(data.total) || lastKnownSnapshot.total,
    updatedAt: data.updatedAt || new Date().toISOString()
  };
  return lastKnownSnapshot;
}

async function contribute(amount, clientParticipantId) {
  let pid = await ensureParticipantId(clientParticipantId);
  const subId = crypto.randomUUID();

  const send = async (p) => {
    return fetch('https://sirat.markazuliman.com/api/durud/contribute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sirat_durud_participant=${p}`,
        'Origin': 'https://sirat.markazuliman.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: JSON.stringify({ amount, submissionId: subId })
    });
  };

  let res = await send(pid);
  if (res.status === 401 || res.status === 403) {
    cachedParticipantId = crypto.randomUUID();
    pid = await ensureParticipantId(cachedParticipantId);
    res = await send(pid);
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Contribute HTTP ${res.status}: ${errText}`);
  }

  const data = await res.json();
  if (data?.total) {
    lastKnownSnapshot.total = Number(data.total);
    lastKnownSnapshot.target = TARGET_TEN_LAKH;
    lastKnownSnapshot.title = CAMPAIGN_TITLE;
  }
  return data;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const snap = await fetchStats();
      return res.status(200).json({
        count: snap.total,
        total: snap.total,
        target: TARGET_TEN_LAKH,
        title: CAMPAIGN_TITLE,
        isActive: snap.isActive,
        updatedAt: snap.updatedAt
      });
    } catch (err) {
      console.warn('Serving cached stats:', err.message);
      return res.status(200).json({
        count: lastKnownSnapshot.total,
        total: lastKnownSnapshot.total,
        target: TARGET_TEN_LAKH,
        title: CAMPAIGN_TITLE,
        isActive: lastKnownSnapshot.isActive,
        updatedAt: lastKnownSnapshot.updatedAt
      });
    }
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch {}
      }
      const rawAmount = Number(body?.amount);
      const amount = Math.min(Math.max(Math.floor(rawAmount || 0), 1), 1000);
      const clientPid = body?.participantId;

      const result = await contribute(amount, clientPid);
      return res.status(200).json({
        success: true,
        count: result.total || lastKnownSnapshot.total,
        total: result.total || lastKnownSnapshot.total,
        target: TARGET_TEN_LAKH,
        title: CAMPAIGN_TITLE,
        added: amount
      });
    } catch (err) {
      console.error('Contribute bridge error:', err);
      return res.status(500).json({
        error: 'Failed to record durood to campaign',
        total: lastKnownSnapshot.total,
        count: lastKnownSnapshot.total,
        target: TARGET_TEN_LAKH,
        title: CAMPAIGN_TITLE
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
