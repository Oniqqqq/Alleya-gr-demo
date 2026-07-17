import { img } from './assets';

export interface BrandMetric {
  value: string;
  label: string;
}

export interface Brand {
  id: string;
  name: string;
  /** Логотип-этикетка (белая плашка) — идёт на бочку и в карточки */
  logo: string;
  cardImage: string;
  heroImage: string;
  /** Слоган — одна короткая строка */
  shortDescription: string;
  /** Одно продающее предложение */
  fullDescription: string;
  websiteUrl: string;
  applicationIds: string[];
  features: string[];
  metrics: BrandMetric[];
  /** Фирменный цвет бренда — чипы, подсветка, слоган */
  accent: string;
  /** Цвет корпуса бочки: фирменный или нейтральный, если логотип сливается */
  barrelColor: string;
  gallery: string[];
  isPlaceholder: boolean;
}

const real = (file: string) => img(`real/${file}`);

// Портфель брендов ООО «Аллея Групп» — alleya-group.ru
export const BRANDS: Brand[] = [
  {
    id: 'liqui-moly',
    name: 'LIQUI MOLY',
    logo: real('t/logo2-lm-logo2.png'),
    cardImage: img('hero-liquimoly.png'),
    heroImage: img('hero-liquimoly.png'),
    shortDescription: 'Легенда немецкой автохимии',
    fullDescription: 'Моторные масла и присадки, которые более 10 лет подряд признаются лучшим брендом смазочных материалов Германии.',
    websiteUrl: 'https://liquimoly.ru/',
    applicationIds: ['passenger', 'commercial', 'service'],
    features: [],
    metrics: [],
    accent: '#1d4595',
    barrelColor: '#31353c',
    gallery: [],
    isPlaceholder: false,
  },
  {
    id: 'reinwell',
    name: 'ReinWell',
    logo: real('t/logo2-reinwell-logo2.png'),
    cardImage: img('hero-reinwell.png'),
    heroImage: img('hero-reinwell.png'),
    shortDescription: 'Немецкий стандарт, локальное производство',
    fullDescription: 'Смазочные материалы и автохимия европейского уровня качества по доступной цене — без логистических и таможенных издержек.',
    websiteUrl: 'https://reinwell.ru/',
    applicationIds: ['passenger', 'commercial', 'service'],
    features: [],
    metrics: [],
    accent: '#1794c9',
    barrelColor: '#c6cbd3',
    gallery: [],
    isPlaceholder: false,
  },
  {
    id: 'ruseff',
    name: 'RUSEFF',
    logo: real('t/logo2-rf-logo2.png'),
    cardImage: img('hero-ruseff.png'),
    heroImage: img('hero-ruseff.png'),
    shortDescription: 'Российский эффективный',
    fullDescription: 'Автохимия и автокосметика, разработанная специально под российские условия эксплуатации.',
    websiteUrl: 'https://ruseff-auto.ru/',
    applicationIds: ['passenger', 'service'],
    features: [],
    metrics: [],
    accent: '#d3232a',
    barrelColor: '#31353c',
    gallery: [],
    isPlaceholder: false,
  },
  {
    id: 'lopal',
    name: 'LOPAL',
    logo: real('t/logo2-lopal.png'),
    cardImage: img('hero-lopal.png'),
    heroImage: img('hero-lopal.png'),
    shortDescription: 'Официальное масло Geely Motors',
    fullDescription: 'Премиальные масла для высокотехнологичных двигателей с собственными запатентованными технологиями защиты.',
    websiteUrl: 'https://lopal-oil.ru/',
    applicationIds: ['passenger', 'commercial'],
    features: [],
    metrics: [],
    accent: '#e0a614',
    barrelColor: '#cf9a12',
    gallery: [],
    isPlaceholder: false,
  },
  {
    id: 'bizol',
    name: 'BIZOL',
    logo: real('t/logo2-bizol-logo2.png'),
    cardImage: img('hero-bizol.png'),
    heroImage: img('hero-bizol.png'),
    shortDescription: 'Немецкая инженерия смазочных материалов',
    fullDescription: 'Масла и присадки на высококачественном сырье и инновационных технологиях — Берлин, с 1998 года.',
    websiteUrl: 'https://bizol-oil.ru/',
    applicationIds: ['passenger', 'service'],
    features: [],
    metrics: [],
    accent: '#e3b70e',
    barrelColor: '#31353c',
    gallery: [],
    isPlaceholder: false,
  },
  {
    id: 'lubex',
    name: 'LUBEX',
    logo: real('t/logo2-lubex-logo2.png'),
    cardImage: img('hero-lubex.png'),
    heroImage: img('hero-lubex.png'),
    shortDescription: '80+ допусков автопроизводителей',
    fullDescription: 'Европейские моторные масла по оптимальной цене, произведённые по мировым стандартам.',
    websiteUrl: 'https://lubex-oil.ru/',
    applicationIds: ['passenger', 'commercial'],
    features: [],
    metrics: [],
    accent: '#e8501e',
    barrelColor: '#31353c',
    gallery: [],
    isPlaceholder: false,
  },
  {
    id: 'meguin',
    name: 'MEGUIN',
    logo: real('t/logo2-meguin-logo2.png'),
    cardImage: real('t/logo2-meguin-logo2.png'),
    heroImage: real('t/logo2-meguin-logo2.png'),
    shortDescription: '175 лет немецкого опыта',
    fullDescription: 'Полный ассортимент автомобильных и промышленных смазочных материалов, включая линейку MEGUIN R для грузовой и специальной техники.',
    websiteUrl: 'https://meguin.su/',
    applicationIds: ['passenger', 'commercial', 'special'],
    features: [],
    metrics: [],
    accent: '#c8102e',
    barrelColor: '#c8102e',
    gallery: [],
    isPlaceholder: false,
  },
  {
    id: 'petrofer',
    name: 'PETROFER',
    logo: real('t/logo2-petro-logo2.png'),
    cardImage: real('t/logo2-petro-logo2.png'),
    heroImage: real('t/logo2-petro-logo2.png'),
    shortDescription: 'Мировой лидер металлообработки',
    fullDescription: '1200+ индустриальных продуктов с 1948 года: СОЖ, закалочные среды, огнестойкие гидравлические жидкости.',
    websiteUrl: 'https://petrofer.ru/',
    applicationIds: ['industry', 'equipment'],
    features: [],
    metrics: [],
    accent: '#005ba9',
    barrelColor: '#31353c',
    gallery: [],
    isPlaceholder: false,
  },
  {
    id: 'setral',
    name: 'SETRAL',
    logo: real('t/logo2-setral-logo2.png'),
    cardImage: real('t/logo2-setral-logo2.png'),
    heroImage: real('t/logo2-setral-logo2.png'),
    shortDescription: 'Специальные смазки с 1969 года',
    fullDescription: 'Высокоэффективные пластичные смазки и индустриальные масла для пищевой, металлургической, горнодобывающей и других отраслей.',
    websiteUrl: 'https://setral.ru/',
    applicationIds: ['industry', 'equipment'],
    features: [],
    metrics: [],
    accent: '#cf1f2e',
    barrelColor: '#c6cbd3',
    gallery: [],
    isPlaceholder: false,
  },
  {
    id: 'opet',
    name: 'OPET',
    logo: real('t/logo2-opet-logo2.png'),
    cardImage: real('t/logo2-opet-logo2.png'),
    heroImage: real('t/logo2-opet-logo2.png'),
    shortDescription: 'Поставщик мировых конвейеров',
    fullDescription: 'Завод мощностью 60 000 тонн в год — один из самых современных в Европе, поставки на конвейеры Ford, Fiat, Otokar.',
    websiteUrl: 'https://opet.ru/',
    applicationIds: ['passenger', 'commercial', 'industry'],
    features: [],
    metrics: [],
    accent: '#6d2077',
    barrelColor: '#c6cbd3',
    gallery: [],
    isPlaceholder: false,
  },
  {
    id: 'the-beast',
    name: 'The BEAST',
    logo: real('t/logo2-beast-log2.png'),
    cardImage: real('t/logo2-beast-log2.png'),
    heroImage: real('t/logo2-beast-log2.png'),
    shortDescription: 'Премиальные корейские масла',
    fullDescription: 'Оригинальные смазочные материалы SHL Co. — лидера корейского рынка с 1971 года. Производится только в Южной Корее.',
    websiteUrl: 'https://beast-oil.ru/',
    applicationIds: ['passenger', 'commercial'],
    features: [],
    metrics: [],
    accent: '#8e1b21',
    barrelColor: '#31353c',
    gallery: [],
    isPlaceholder: false,
  },
  {
    id: 'dvx',
    name: 'DVX',
    logo: real('t/logo2-dvx-logo2.png'),
    cardImage: real('t/logo2-dvx-logo2.png'),
    heroImage: real('t/logo2-dvx-logo2.png'),
    shortDescription: 'Профессиональный уход за автомобилем',
    fullDescription: 'Продукция Setkim Kimya (Divortex) с международными сертификатами качества RoHS и REACH.',
    websiteUrl: 'https://divortex.ru/',
    applicationIds: ['passenger', 'service'],
    features: [],
    metrics: [],
    accent: '#2f7fc1',
    barrelColor: '#c6cbd3',
    gallery: [],
    isPlaceholder: false,
  },
];

export const getBrand = (id: string): Brand | undefined => BRANDS.find((b) => b.id === id);

export const brandsByApplication = (applicationId: string): Brand[] =>
  BRANDS.filter((b) => b.applicationIds.includes(applicationId));
