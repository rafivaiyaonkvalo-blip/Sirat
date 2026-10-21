// ULS Arabic Hybrid Specific Location & Geolocation Service
// মারকাযুল ঈমান - ULS Arabic (IP Geolocation + High-Accuracy Device GPS)

const LOCATION_CACHE_KEY = 'uls_cached_location';
const CACHE_VALIDITY_MS = 6 * 60 * 60 * 1000; // ৬ ঘণ্টা ক্যাশ ভ্যালিডিটি

let inMemoryLocation = null;
let isResolving = false;
const listeners = [];

/**
 * Country code to flag emoji converter
 */
export function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Format location into elegant Bengali presentation
 */
export function formatLocationString(loc) {
  if (!loc) return 'অজানা লোকেশন';
  const flag = loc.flag || getFlagEmoji(loc.countryCode) || '🌐';
  const parts = [];

  if (loc.district || loc.city) parts.push(loc.district || loc.city);
  if (loc.region && loc.region !== loc.city) parts.push(loc.region);
  if (loc.country) parts.push(loc.country);

  const locText = parts.length > 0 ? parts.join(', ') : 'বাংলাদেশ';
  return `${flag} ${locText}`;
}

/**
 * Fetch IP-based location with multiple fallbacks (zero permission needed)
 */
async function fetchIpLocation() {
  // Provider 1: ipwho.is (fast, rich data with city, region, ISP, flag)
  try {
    const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(4500) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success !== false && data.country) {
        return {
          type: 'ip',
          ip: data.ip || '',
          country: data.country || 'Bangladesh',
          countryCode: data.country_code || 'BD',
          region: data.region || '',
          city: data.city || '',
          district: data.city || '',
          flag: data.flag?.emoji || getFlagEmoji(data.country_code || 'BD'),
          isp: data.connection?.isp || data.connection?.org || '',
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          mapsUrl: data.latitude && data.longitude ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}` : null,
          isPreciseGps: false,
          accuracyLabel: 'শহর/জেলা (আইপি)',
          timestamp: Date.now()
        };
      }
    }
  } catch (e) {}

  // Provider 2: freeipapi.com fallback
  try {
    const res = await fetch('https://freeipapi.com/api/json', { signal: AbortSignal.timeout(4500) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.countryName) {
        return {
          type: 'ip',
          ip: data.ipAddress || '',
          country: data.countryName || 'Bangladesh',
          countryCode: data.countryCode || 'BD',
          region: data.regionName || '',
          city: data.cityName || '',
          district: data.cityName || '',
          flag: getFlagEmoji(data.countryCode || 'BD'),
          isp: '',
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          mapsUrl: data.latitude && data.longitude ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}` : null,
          isPreciseGps: false,
          accuracyLabel: 'শহর/জেলা (আইপি)',
          timestamp: Date.now()
        };
      }
    }
  } catch (e) {}

  // Safe default
  return {
    type: 'ip_default',
    ip: '',
    country: 'Bangladesh',
    countryCode: 'BD',
    region: 'Dhaka',
    city: 'Dhaka',
    district: 'Dhaka',
    flag: '🇧🇩',
    isp: '',
    latitude: 23.8103,
    longitude: 90.4125,
    mapsUrl: 'https://www.google.com/maps?q=23.8103,90.4125',
    isPreciseGps: false,
    accuracyLabel: 'ডিফল্ট (বাংলাদেশ)',
    timestamp: Date.now()
  };
}

/**
 * Reverse Geocode Coordinates into specific Area / Thana name
 */
async function reverseGeocodeCoords(lat, lon) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const d = await res.json();
      return {
        locality: d.locality || '',
        city: d.city || d.principalSubdivision || '',
        region: d.principalSubdivision || '',
        country: d.countryName || 'Bangladesh'
      };
    }
  } catch (e) {}
  return null;
}

/**
 * Silently probe for Device GPS (if allowed by browser / user)
 */
function probeDeviceGps(currentLoc) {
  if (typeof window === 'undefined' || !navigator.geolocation) return;

  try {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (!latitude || !longitude) return;

        // Try getting locality / area
        const reverse = await reverseGeocodeCoords(latitude, longitude);

        const upgradedLocation = {
          ...currentLoc,
          type: 'gps',
          latitude,
          longitude,
          accuracyMeters: Math.round(accuracy),
          mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
          isPreciseGps: true,
          accuracyLabel: `নিখুঁত জিপিএস (±${Math.round(accuracy)}m)`,
          district: reverse?.locality || reverse?.city || currentLoc.district,
          city: reverse?.city || currentLoc.city,
          region: reverse?.region || currentLoc.region,
          country: reverse?.country || currentLoc.country,
          timestamp: Date.now()
        };

        inMemoryLocation = upgradedLocation;
        try {
          localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(upgradedLocation));
        } catch (e) {}

        // Notify tracer & subscribers of high-precision location
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('uls_precise_location_available', {
            detail: upgradedLocation
          }));
        }
      },
      () => {
        // Geolocation denied or timed out — seamlessly keep IP location
      },
      { timeout: 7000, enableHighAccuracy: true, maximumAge: 120000 }
    );
  } catch (e) {}
}

/**
 * Primary function to get current user location (Fast, Non-blocking, Cached)
 */
export async function getUserLocation() {
  if (inMemoryLocation) {
    return inMemoryLocation;
  }

  // 1. Check LocalStorage cache
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCATION_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Date.now() - (parsed.timestamp || 0) < CACHE_VALIDITY_MS) {
          inMemoryLocation = parsed;
          // Background GPS probe if not already GPS
          if (!parsed.isPreciseGps) {
            probeDeviceGps(parsed);
          }
          return inMemoryLocation;
        }
      }
    } catch (e) {}
  }

  // 2. Fetch fresh IP Location
  isResolving = true;
  const ipLocation = await fetchIpLocation();
  inMemoryLocation = ipLocation;
  isResolving = false;

  try {
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(ipLocation));
  } catch (e) {}

  // 3. Trigger silent device GPS probe in background
  probeDeviceGps(ipLocation);

  return inMemoryLocation;
}

/**
 * Synchronous getter for in-memory or cached location
 */
export function getCachedUserLocation() {
  if (inMemoryLocation) return inMemoryLocation;
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCATION_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        inMemoryLocation = parsed;
        return inMemoryLocation;
      }
    } catch (e) {}
  }
  return null;
}
