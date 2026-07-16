// Показатели секции «Масштаб, подтверждённый инфраструктурой».
// ВРЕМЕННЫЕ ЗНАЧЕНИЯ: фактические бизнес-показатели не переданы.
// Значения с пометкой placeholder заменить реальными данными.
export interface StatItem {
  /** Отображаемое значение (например «12+»). Для неизвестных — маркер. */
  value: string;
  label: string;
  isPlaceholder: boolean;
}

export const STATS: StatItem[] = [
  { value: 'XX', label: 'филиалов — количество уточняется', isPlaceholder: true },
  { value: '8', label: 'брендов в портфеле (включая временные записи)', isPlaceholder: true },
  { value: 'XX', label: 'регионов присутствия — география уточняется', isPlaceholder: true },
  { value: 'XXX', label: 'дилеров и партнёров — количество уточняется', isPlaceholder: true },
  { value: '6', label: 'товарных направлений: от транспорта до производственного оборудования', isPlaceholder: false },
];
