import { SVGProps } from 'react'

const baseProps = {
  viewBox: '0 0 32 32',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function TentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M4 24 L16 10 L28 24 Z" />
      <path d="M16 10 V28" />
      <path d="M8 24 V28" />
      <path d="M24 24 V28" />
    </svg>
  )
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M6 16 L14 24 L26 8" />
    </svg>
  )
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="16" cy="16" r="10" />
      <path d="M16 10 V16 L20 18" />
    </svg>
  )
}

export function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="6" y="8" width="20" height="18" rx="2" />
      <line x1="6" y1="12" x2="26" y2="12" />
      <line x1="10" y1="6" x2="10" y2="10" />
      <line x1="22" y1="6" x2="22" y2="10" />
    </svg>
  )
}

export function ClipboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M10 6 H22 L24 8 V28 H8 V8 Z" />
      <path d="M12 6 V4 H20 V6" />
    </svg>
  )
}

export function DocumentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M8 6 H20 L24 10 V26 H8 Z" />
      <path d="M14 12 H20" />
      <path d="M14 16 H20" />
    </svg>
  )
}

export function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="16" cy="16" r="6" />
      <path d="M16 2 V6" />
      <path d="M16 26 V30" />
      <path d="M2 16 H6" />
      <path d="M26 16 H30" />
      <path d="M6.5 6.5 L9.5 9.5" />
      <path d="M22.5 22.5 L25.5 25.5" />
      <path d="M6.5 25.5 L9.5 22.5" />
      <path d="M22.5 9.5 L25.5 6.5" />
    </svg>
  )
}
