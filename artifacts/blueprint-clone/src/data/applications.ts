import { img } from './assets';

export interface Application {
  id: string;
  name: string;
  shortDescription: string;
  /** Longer description shown in the large active area of the applications block */
  description: string;
  /** Icon id resolved by the shared <Pictogram /> component */
  icon: string;
  image: string;
}

export const APPLICATIONS: Application[] = [
  {
    id: 'passenger',
    name: 'Легковой транспорт',
    shortDescription: 'Масла, жидкости и компоненты для легковых автомобилей',
    description:
      'Продукция для ежедневной эксплуатации легковых автомобилей: моторные и трансмиссионные масла, охлаждающие жидкости, фильтры и детали шасси.',
    icon: 'car',
    image: img('wide-bottle.svg'),
  },
  {
    id: 'commercial',
    name: 'Коммерческий транспорт',
    shortDescription: 'Решения для автопарков и магистральной техники',
    description:
      'Линейки продукции с увеличенным ресурсом для грузового транспорта, автобусов и корпоративных автопарков — от смазочных материалов до аккумуляторов.',
    icon: 'truck',
    image: img('wide-truck.svg'),
  },
  {
    id: 'industry',
    name: 'Промышленность',
    shortDescription: 'Индустриальные масла, СОЖ и технические жидкости',
    description:
      'Смазочно-охлаждающие жидкости, гидравлические и индустриальные масла для промышленных предприятий и непрерывных производств.',
    icon: 'factory',
    image: img('wide-drum.svg'),
  },
  {
    id: 'special',
    name: 'Специальная техника',
    shortDescription: 'Продукты для строительной и внедорожной техники',
    description:
      'Всесезонные решения для строительной, сельскохозяйственной и складской техники, работающей в тяжёлых условиях эксплуатации.',
    icon: 'excavator',
    image: img('wide-forklift.svg'),
  },
  {
    id: 'equipment',
    name: 'Производственное оборудование',
    shortDescription: 'Оснащение производственных и сервисных площадок',
    description:
      'Оборудование и расходные материалы для производственных линий, станочного парка и технологических процессов.',
    icon: 'machine',
    image: img('wide-production.svg'),
  },
  {
    id: 'service',
    name: 'Сервисное обслуживание',
    shortDescription: 'Оборудование и материалы для СТО и сервисных центров',
    description:
      'Комплексные программы для станций технического обслуживания: оборудование, автохимия, расходные материалы и обучение персонала.',
    icon: 'wrench',
    image: img('wide-service.svg'),
  },
];

export const getApplication = (id: string): Application | undefined =>
  APPLICATIONS.find((a) => a.id === id);
