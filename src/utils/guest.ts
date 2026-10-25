export const COUPLE = {
  groom: 'Madhusanka',
  bride: 'Rasanjali',
} as const;

export const GUEST_PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;

/**
 * Combine prefix and name into the name shown to the guest.
 * "Dear" is a greeting style, not a title, so it adds nothing here —
 * the message greeting supplies "Dear" itself.
 */
export function buildDisplayName(prefix: string, name: string): string {
  const trimmed = name.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '';

  switch (prefix.trim().toLowerCase()) {
    case 'family':
      return `${trimmed} and Family`;
    case 'dear':
    case '':
      return trimmed;
    default:
      return `${prefix.trim()} ${trimmed}`;
  }
}

/** Personalized link: {origin}/{display name}, safely encoded. */
export function buildInviteLink(origin: string, displayName: string): string {
  return `${origin.replace(/\/+$/, '')}/${encodeURIComponent(displayName)}`;
}

export function buildInviteMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${COUPLE.groom} & ${COUPLE.bride}`;
}

/**
 * Read the invitee's display name from the current URL.
 * Supports /{display name} links and the older ?title=&name= links.
 */
export function getInviteeNameFromUrl(location: Location = window.location): string {
  const segment = location.pathname.replace(/^\/+|\/+$/g, '');
  if (segment && !segment.includes('/')) {
    try {
      return decodeURIComponent(segment).trim();
    } catch {
      return '';
    }
  }

  const params = new URLSearchParams(location.search);
  return buildDisplayName(params.get('title') || '', params.get('name') || '');
}
