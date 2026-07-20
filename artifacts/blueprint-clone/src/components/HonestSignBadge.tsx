interface HonestSignBadgeProps {
  className?: string;
}

/**
 * Значок «Честный ЗНАК» — фирменная жёлтая пиктограмма Национальной
 * системы маркировки товаров: скобки сканера + галочка на скруглённом
 * жёлтом квадрате. Векторная копия официального знака.
 */
function HonestSignMark() {
  return (
    <svg viewBox="0 0 448 448" width="100%" height="100%" aria-hidden="true">
      <rect width="448" height="448" rx="112" fill="#F4E01D" />
      <g fill="none" stroke="#6E6259" strokeWidth="34" strokeLinecap="round">
        <path d="M60 150V110a50 50 0 0 1 50-50h40" />
        <path d="M388 150V110a50 50 0 0 1-50-50h-40" />
        <path d="M60 298v40a50 50 0 0 0 50 50h40" />
        <path d="M388 298v40a50 50 0 0 1-50 50h-40" />
      </g>
      <path
        d="M134 224l58 58 122-122"
        fill="none"
        stroke="#6E6259"
        strokeWidth="40"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HonestSignBadge({ className }: HonestSignBadgeProps) {
  return (
    <span className={`honest-sign-badge ${className ?? ''}`}>
      <span className="honest-sign-mark">
        <HonestSignMark />
      </span>
      <span className="honest-sign-text">
        <span className="honest-sign-title">Честный ЗНАК</span>
        <span className="honest-sign-sub">Маркированная продукция</span>
      </span>
    </span>
  );
}
