/**
 * Native Haptic Feedback Utility for Android & iOS Mobile Devices
 * Provides subtle tactile feedback on interactions (button taps, quiz selection, card flips)
 */
export function triggerHaptic(type = 'light') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
  try {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'heavy':
        navigator.vibrate(35);
        break;
      case 'success':
        navigator.vibrate([12, 40, 15]);
        break;
      case 'error':
        navigator.vibrate([25, 60, 25]);
        break;
      default:
        navigator.vibrate(10);
    }
  } catch (e) {
    // Vibration permission or platform limitation, gracefully ignore
  }
}
