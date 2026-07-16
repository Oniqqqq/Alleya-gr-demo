interface PictogramProps {
  icon: string;
  size?: number | string;
  className?: string;
}

/**
 * Единая система пиктограмм направлений: тонкая линейная графика (stroke 1.5),
 * наследует цвет через currentColor — в стиле линейной графики проекта.
 */
export default function Pictogram({ icon, size = 24, className }: PictogramProps) {
  const paths: Record<string, React.ReactNode> = {
    car: (
      <>
        <path d="M3 13.5 4.6 9a2 2 0 0 1 1.9-1.3h11a2 2 0 0 1 1.9 1.3L21 13.5" />
        <path d="M3 13.5h18v3.6a.9.9 0 0 1-.9.9H19" />
        <path d="M3 13.5v3.6a.9.9 0 0 0 .9.9H5" />
        <circle cx="7" cy="17" r="1.8" />
        <circle cx="17" cy="17" r="1.8" />
      </>
    ),
    truck: (
      <>
        <rect x="2" y="7" width="12" height="9" rx="0.8" />
        <path d="M14 10h4l3 3.4V16h-7" />
        <circle cx="6" cy="17.5" r="1.7" />
        <circle cx="17.5" cy="17.5" r="1.7" />
      </>
    ),
    factory: (
      <>
        <path d="M3 19V9l5 3V9l5 3V9l5 3v7" />
        <path d="M2 19h20" />
        <path d="M17 9V5h3v14" />
      </>
    ),
    excavator: (
      <>
        <rect x="3" y="11" width="8" height="5" rx="0.8" />
        <path d="M5 11V8.5h4.5L11 11" />
        <path d="M11 13h3L18 6l3 1.5-2.5 5.5" />
        <path d="M18.5 13v3.5" />
        <path d="M3 18.5h13" />
        <circle cx="6" cy="18.5" r="1.4" />
        <circle cx="12" cy="18.5" r="1.4" />
      </>
    ),
    machine: (
      <>
        <rect x="3" y="5" width="11" height="14" rx="1" />
        <path d="M6 9h5" />
        <rect x="6.5" y="12" width="4" height="3.4" rx="0.5" />
        <path d="M17 8h4M19 8v11M16.5 19h5" />
      </>
    ),
    wrench: (
      <>
        <path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L4 17a1.9 1.9 0 0 0 2.7 2.7l5.5-5.5a4 4 0 0 0 5.2-5.2L14.6 11.8 12 9.2Z" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s-6.5-6-6.5-10.7a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21Z" />
        <circle cx="12" cy="10" r="2.2" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  };

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[icon] ?? paths.pin}
    </svg>
  );
}
