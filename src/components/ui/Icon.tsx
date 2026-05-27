import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function withDefaults({
  size = 18,
  stroke = 'currentColor',
  ...rest
}: IconProps) {
  return {
    width: size,
    height: size,
    fill: 'none',
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
    ...rest,
  };
}

export const Icon = {
  Dashboard: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <rect x="3" y="3" width="7" height="9" rx="2" />
      <rect x="14" y="3" width="7" height="5" rx="2" />
      <rect x="14" y="12" width="7" height="9" rx="2" />
      <rect x="3" y="16" width="7" height="5" rx="2" />
    </svg>
  ),
  Users: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 20c.5-3.5 3.5-6 7-6s6.5 2.5 7 6" />
      <circle cx="17" cy="6" r="3" />
      <path d="M22 18c-.4-2.5-2-4-4.5-4.4" />
    </svg>
  ),
  Reports: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <path d="M12 3l9 4-9 14L3 7z" />
      <path d="M12 9v5" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" />
    </svg>
  ),
  Games: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <rect x="2.5" y="7" width="19" height="11" rx="4" />
      <path d="M7 12h3M8.5 10.5v3" />
      <circle cx="15.5" cy="11.5" r="0.8" fill="currentColor" />
      <circle cx="17.5" cy="13.5" r="0.8" fill="currentColor" />
    </svg>
  ),
  Sessions: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 9h18M8 4v5M16 4v5" />
    </svg>
  ),
  Matches: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <path d="M4 12c0-3.3 2.7-6 6-6 2 0 3.7 1 4.8 2.5L20 4v6h-6" />
      <path d="M20 12c0 3.3-2.7 6-6 6-2 0-3.7-1-4.8-2.5L4 20v-6h6" />
    </svg>
  ),
  Settings: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.2 7a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1c0 .7.4 1.3 1 1.5a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.2.6.8 1 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
  Search: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  ),
  Plus: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Trash: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  ),
  Ban: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" />
    </svg>
  ),
  Shield: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
    </svg>
  ),
  Edit: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <path d="M4 20h4l11-11-4-4L4 16z" />
      <path d="M14 5l5 5" />
    </svg>
  ),
  Menu: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  Logout: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <path d="M15 17l5-5-5-5M20 12H9" />
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" />
    </svg>
  ),
  Globe: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  ),
  ChevronRight: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
  Check: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <path d="M5 12l5 5L20 7" />
    </svg>
  ),
  X: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Refresh: (p: IconProps) => (
    <svg {...withDefaults(p)}>
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16M3 12a9 9 0 0 1 15.5-6.3L21 8" />
      <path d="M21 4v4h-4M3 20v-4h4" />
    </svg>
  ),
};
