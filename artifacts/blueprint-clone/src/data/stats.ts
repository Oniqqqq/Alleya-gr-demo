// Показатели секции «Масштаб, подтверждённый инфраструктурой».
// Фактические данные с alleya-group.ru и petrofer.ru.
export interface StatItem {
  /** Отображаемое значение (например «11»). */
  value: string;
  label: string;
  isPlaceholder: boolean;
}

export const STATS: StatItem[] = [
  {
    value: '12',
    label: 'брендов в портфеле — от потребительской автохимии до индустриальных смазочных материалов',
    isPlaceholder: false,
  },
  {
    value: '11',
    label: 'собственных филиалов в крупных регионах — работа по всей территории России',
    isPlaceholder: false,
  },
  {
    value: '1200+',
    label: 'продуктов в индустриальной программе PETROFER: СОЖ, закалочные среды, гидравлические жидкости',
    isPlaceholder: false,
  },
  {
    value: '80+',
    label: 'официальных допусков мировых автопроизводителей у линейки моторных масел LUBEX',
    isPlaceholder: false,
  },
];
