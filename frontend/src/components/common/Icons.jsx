function IconBase({ children, className = 'h-5 w-5', strokeWidth = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function DashboardIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 13.5V20h6v-6.5H4Z" />
      <path d="M4 4h6v7H4V4Z" />
      <path d="M14 4h6v10h-6V4Z" />
      <path d="M14 16h6v4h-6v-4Z" />
    </IconBase>
  )
}

export function OrdersIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M6 6h15l-1.5 8h-11L6 6Z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="18" cy="19" r="1.5" />
    </IconBase>
  )
}

export function ProductsIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 7.5 12 3l8 4.5-8 4.5L4 7.5Z" />
      <path d="M4 7.5V16l8 4.5 8-4.5v-8.5" />
      <path d="M12 12v8.5" />
    </IconBase>
  )
}

export function UsersIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M16.5 20a4.5 4.5 0 0 0-9 0" />
      <circle cx="12" cy="8" r="3.5" />
      <path d="M19 20a3.8 3.8 0 0 0-2.4-3.5" />
      <path d="M17 5.5a3 3 0 0 1 0 5.7" />
    </IconBase>
  )
}

export function ChartIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 19h16" />
      <path d="M7 16v-5" />
      <path d="M12 16V8" />
      <path d="M17 16v-3" />
    </IconBase>
  )
}

export function MoneyIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 8.5C4 7.1 6.7 6 10 6s6 .9 6 2.5S13.3 11 10 11s-6 .9-6 2.5S6.7 16 10 16s6-1.1 6-2.5" />
      <path d="M10 4v16" />
      <path d="M14 5.5h4" />
    </IconBase>
  )
}

export function CreditCardIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 14h4" />
    </IconBase>
  )
}

export function MapPinIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 21s6-4.8 6-10a6 6 0 0 0-12 0c0 5.2 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2" />
    </IconBase>
  )
}

export function SearchIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="5.5" />
      <path d="m16 16 4 4" />
    </IconBase>
  )
}

export function BellIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M15 17H5c1.2-1.4 2-2.5 2-5V9a5 5 0 1 1 10 0v3c0 2.5.8 3.6 2 5h-4Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </IconBase>
  )
}

export function HomeIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10.5V20h14v-9.5" />
    </IconBase>
  )
}

export function PlusIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconBase>
  )
}

export function RefreshIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M20 12a8 8 0 0 0-13.6-5.7L4 8.7" />
      <path d="M4 4v4h4" />
      <path d="M4 12a8 8 0 0 0 13.6 5.7L20 15.3" />
      <path d="M16 20h4v-4" />
    </IconBase>
  )
}

export function MenuIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </IconBase>
  )
}

export function CloseIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </IconBase>
  )
}

export function LogoutIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M10 7V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-2" />
      <path d="M3 12h11" />
      <path d="m7 8 4 4-4 4" />
    </IconBase>
  )
}

export function UserIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </IconBase>
  )
}

export function ChevronDownIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  )
}
