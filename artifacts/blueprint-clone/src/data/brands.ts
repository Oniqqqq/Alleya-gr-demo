import { img } from './assets';

export interface BrandMetric {
  value: string;
  label: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  cardImage: string;
  heroImage: string;
  /** Short positioning line shown on cards and under the logo */
  shortDescription: string;
  fullDescription: string;
  websiteUrl: string;
  applicationIds: string[];
  features: string[];
  metrics: BrandMetric[];
  /** Brand accent color, used sparingly for the active state */
  accent: string;
  gallery: string[];
  /**
   * TEMPORARY RECORD — neutral placeholder, actual brand data has not
   * been provided yet. Replace name/descriptions/logo when real content arrives.
   */
  isPlaceholder: boolean;
}

export const BRANDS: Brand[] = [
  {
    id: 'alleya-group',
    name: 'Аллея Групп',
    logo: img('logo-alleya.svg'),
    cardImage: img('wide-warehouse.svg'),
    heroImage: img('wide-warehouse.svg'),
    shortDescription: 'Управляющая компания портфеля брендов',
    fullDescription:
      'Аллея Групп объединяет производственные, дистрибуционные и сервисные бренды в единую систему развития: общие стандарты качества, консолидированные поставки, региональная сеть и поддержка партнёров на всей территории присутствия.',
    websiteUrl: 'https://alleya-group.ru/',
    applicationIds: ['passenger', 'commercial', 'industry', 'special', 'equipment', 'service'],
    features: ['Управление портфелем', 'Федеральная дистрибуция', 'Складская программа', 'Поддержка партнёров'],
    metrics: [
      { value: '—', label: 'филиалов (уточняется)' },
      { value: '—', label: 'брендов в портфеле (уточняется)' },
      { value: '—', label: 'регионов присутствия (уточняется)' },
    ],
    accent: '#c496ff',
    gallery: [img('wide-warehouse.svg'), img('wide-network.svg'), img('infra-packaging.svg')],
    isPlaceholder: false,
  },
  {
    id: 'brand-01',
    name: 'Бренд 01',
    logo: img('logo-brand-01.svg'),
    cardImage: img('product-bottle.svg'),
    heroImage: img('wide-bottle.svg'),
    shortDescription: 'Моторные и трансмиссионные масла',
    fullDescription:
      'Временная запись бренда смазочных материалов: линейка моторных и трансмиссионных масел для легкового и коммерческого транспорта. Описание будет заменено фактическим контентом.',
    websiteUrl: '#',
    applicationIds: ['passenger', 'commercial'],
    features: ['Синтетические масла', 'Полусинтетические масла', 'Трансмиссионные масла', 'Допуски производителей'],
    metrics: [
      { value: '—', label: 'позиций в линейке (уточняется)' },
      { value: '—', label: 'вязкостных классов (уточняется)' },
    ],
    accent: '#a1d8c0',
    gallery: [img('wide-bottle.svg'), img('product-bottle.svg')],
    isPlaceholder: true,
  },
  {
    id: 'brand-02',
    name: 'Бренд 02',
    logo: img('logo-brand-02.svg'),
    cardImage: img('product-canister.svg'),
    heroImage: img('wide-canister.svg'),
    shortDescription: 'Охлаждающие и технические жидкости',
    fullDescription:
      'Временная запись бренда технических жидкостей: охлаждающие жидкости, стеклоомывающие составы и специальные продукты для всесезонной эксплуатации.',
    websiteUrl: '#',
    applicationIds: ['passenger', 'commercial', 'special'],
    features: ['Антифризы', 'Стеклоомывающие жидкости', 'Тормозные жидкости', 'Сезонные продукты'],
    metrics: [{ value: '—', label: 'форматов фасовки (уточняется)' }],
    accent: '#8fb8e8',
    gallery: [img('wide-canister.svg'), img('product-canister.svg')],
    isPlaceholder: true,
  },
  {
    id: 'brand-03',
    name: 'Бренд 03',
    logo: img('logo-brand-03.svg'),
    cardImage: img('product-brake-disc.svg'),
    heroImage: img('wide-brake-disc.svg'),
    shortDescription: 'Автокомпоненты и детали шасси',
    fullDescription:
      'Временная запись бренда автокомпонентов: тормозные системы, детали подвески и рулевого управления для массовых моделей автомобилей.',
    websiteUrl: '#',
    applicationIds: ['passenger', 'commercial'],
    features: ['Тормозные диски и колодки', 'Детали подвески', 'Рулевое управление', 'Каталог применимости'],
    metrics: [{ value: '—', label: 'артикулов (уточняется)' }],
    accent: '#e8a68f',
    gallery: [img('wide-brake-disc.svg'), img('product-brake-disc.svg')],
    isPlaceholder: true,
  },
  {
    id: 'brand-04',
    name: 'Бренд 04',
    logo: img('logo-brand-04.svg'),
    cardImage: img('product-filter.svg'),
    heroImage: img('wide-filter.svg'),
    shortDescription: 'Фильтры и расходные материалы',
    fullDescription:
      'Временная запись бренда фильтров: масляные, воздушные, топливные и салонные фильтры для транспорта и техники.',
    websiteUrl: '#',
    applicationIds: ['passenger', 'commercial', 'special'],
    features: ['Масляные фильтры', 'Воздушные фильтры', 'Топливные фильтры', 'Салонные фильтры'],
    metrics: [{ value: '—', label: 'позиций каталога (уточняется)' }],
    accent: '#d8cfa1',
    gallery: [img('wide-filter.svg'), img('product-filter.svg')],
    isPlaceholder: true,
  },
  {
    id: 'brand-05',
    name: 'Бренд 05',
    logo: img('logo-brand-05.svg'),
    cardImage: img('product-battery.svg'),
    heroImage: img('wide-battery.svg'),
    shortDescription: 'Стартерные аккумуляторные батареи',
    fullDescription:
      'Временная запись бренда аккумуляторов: стартерные батареи для легкового, коммерческого транспорта и специальной техники.',
    websiteUrl: '#',
    applicationIds: ['passenger', 'commercial', 'special'],
    features: ['Легковые АКБ', 'Грузовые АКБ', 'AGM / EFB технологии', 'Сервисная поддержка'],
    metrics: [{ value: '—', label: 'типоразмеров (уточняется)' }],
    accent: '#a1d8c0',
    gallery: [img('wide-battery.svg'), img('product-battery.svg')],
    isPlaceholder: true,
  },
  {
    id: 'brand-06',
    name: 'Бренд 06',
    logo: img('logo-brand-06.svg'),
    cardImage: img('infra-service.svg'),
    heroImage: img('wide-service.svg'),
    shortDescription: 'Автохимия и сервисные продукты',
    fullDescription:
      'Временная запись бренда автохимии: очистители, смазки, присадки и продукты для профессионального сервисного обслуживания.',
    websiteUrl: '#',
    applicationIds: ['passenger', 'service'],
    features: ['Очистители', 'Технические смазки', 'Присадки', 'Профессиональная линейка'],
    metrics: [{ value: '—', label: 'продуктов (уточняется)' }],
    accent: '#c496ff',
    gallery: [img('wide-service.svg'), img('infra-service.svg')],
    isPlaceholder: true,
  },
  {
    id: 'brand-07',
    name: 'Бренд 07',
    logo: img('logo-brand-07.svg'),
    cardImage: img('product-drum.svg'),
    heroImage: img('wide-drum.svg'),
    shortDescription: 'Индустриальные масла и СОЖ',
    fullDescription:
      'Временная запись промышленного бренда: индустриальные и гидравлические масла, смазочно-охлаждающие жидкости для предприятий.',
    websiteUrl: '#',
    applicationIds: ['industry', 'equipment'],
    features: ['Гидравлические масла', 'СОЖ', 'Редукторные масла', 'Промышленный сервис'],
    metrics: [{ value: '—', label: 'отгрузочных форматов (уточняется)' }],
    accent: '#8fb8e8',
    gallery: [img('wide-drum.svg'), img('product-drum.svg')],
    isPlaceholder: true,
  },
  {
    id: 'brand-08',
    name: 'Бренд 08',
    logo: img('logo-brand-08.svg'),
    cardImage: img('infra-production.svg'),
    heroImage: img('wide-production.svg'),
    shortDescription: 'Оборудование для СТО и производств',
    fullDescription:
      'Временная запись бренда оборудования: подъёмное, диагностическое и технологическое оборудование для сервисных и производственных площадок.',
    websiteUrl: '#',
    applicationIds: ['equipment', 'service', 'industry'],
    features: ['Подъёмное оборудование', 'Диагностика', 'Шиномонтаж', 'Пусконаладка'],
    metrics: [{ value: '—', label: 'категорий оборудования (уточняется)' }],
    accent: '#e8a68f',
    gallery: [img('wide-production.svg'), img('infra-production.svg')],
    isPlaceholder: true,
  },
];

export const getBrand = (id: string): Brand | undefined => BRANDS.find((b) => b.id === id);

export const brandsByApplication = (applicationId: string): Brand[] =>
  BRANDS.filter((b) => b.applicationIds.includes(applicationId));
