/**
 * Google Apps Script web app that writes RSVPs and wishes into the
 * wedding spreadsheet (see google-apps-script/SETUP.md).
 */
export const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyUQOtweIUYoXJpN5GDRwaIrjFEL6WW9SQ4ozWpV7rRYozxM4HgCBoSHkIwskkhEX0T0A/exec';

export async function submitToSheet(sheet: 'RSVP' | 'WISH', fields: Record<string, string>) {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error('Google Apps Script URL is not configured');
  }

  const payload = new FormData();
  payload.append('sheet', sheet);
  for (const [key, value] of Object.entries(fields)) {
    payload.append(key, value);
  }

  await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: payload,
  });
}
