/**
 * Generates a unique Tracking ID for GIEI scholarship applications.
 * Format: GIEI-XXXX (Starting from 4001)
 */
export function generateTrackingId(): string {
  // For this simulation, we use a random number starting from 4001
  const serial = Math.floor(4001 + Math.random() * 5999);
  return `GIEI-${serial}`;
}
