export type LocationType = 'branch' | 'dealer' | 'partner';

export interface CompanyLocation {
  id: string;
  name: string;
  city: string;
  address: string;
  /** [lat, lng] */
  coordinates: [number, number];
  type: LocationType;
  applicationIds: string[];
  phone: string;
  email: string;
  /**
   * TEMPORARY RECORD — addresses and contacts are neutral placeholders,
   * actual branch data has not been provided yet.
   */
  isPlaceholder: boolean;
}

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  branch: 'Филиал',
  dealer: 'Дилерский центр',
  partner: 'Партнёр',
};

// All entries below are placeholder records: real branch list has not been
// provided. Coordinates point to city centers; addresses/contacts are stubs.
export const LOCATIONS: CompanyLocation[] = [
  {
    id: 'msk',
    name: 'Центральный офис',
    city: 'Москва',
    address: 'Адрес уточняется',
    coordinates: [55.7558, 37.6173],
    type: 'branch',
    applicationIds: ['passenger', 'commercial', 'industry', 'special', 'equipment', 'service'],
    phone: '+7 (495) 000-00-00',
    email: 'info@alleya-group.ru',
    isPlaceholder: true,
  },
  {
    id: 'spb',
    name: 'Филиал Северо-Запад',
    city: 'Санкт-Петербург',
    address: 'Адрес уточняется',
    coordinates: [59.9343, 30.3351],
    type: 'branch',
    applicationIds: ['passenger', 'commercial', 'service'],
    phone: '+7 (812) 000-00-00',
    email: 'spb@alleya-group.ru',
    isPlaceholder: true,
  },
  {
    id: 'nn',
    name: 'Филиал Поволжье',
    city: 'Нижний Новгород',
    address: 'Адрес уточняется',
    coordinates: [56.2965, 43.9361],
    type: 'branch',
    applicationIds: ['passenger', 'commercial', 'industry'],
    phone: '+7 (831) 000-00-00',
    email: 'nn@alleya-group.ru',
    isPlaceholder: true,
  },
  {
    id: 'kzn',
    name: 'Филиал Татарстан',
    city: 'Казань',
    address: 'Адрес уточняется',
    coordinates: [55.7963, 49.1088],
    type: 'branch',
    applicationIds: ['passenger', 'industry', 'equipment'],
    phone: '+7 (843) 000-00-00',
    email: 'kzn@alleya-group.ru',
    isPlaceholder: true,
  },
  {
    id: 'ekb',
    name: 'Филиал Урал',
    city: 'Екатеринбург',
    address: 'Адрес уточняется',
    coordinates: [56.8389, 60.6057],
    type: 'branch',
    applicationIds: ['commercial', 'industry', 'special', 'equipment'],
    phone: '+7 (343) 000-00-00',
    email: 'ekb@alleya-group.ru',
    isPlaceholder: true,
  },
  {
    id: 'nsk',
    name: 'Филиал Сибирь',
    city: 'Новосибирск',
    address: 'Адрес уточняется',
    coordinates: [55.0084, 82.9357],
    type: 'branch',
    applicationIds: ['passenger', 'commercial', 'special'],
    phone: '+7 (383) 000-00-00',
    email: 'nsk@alleya-group.ru',
    isPlaceholder: true,
  },
  {
    id: 'krd',
    name: 'Филиал Юг',
    city: 'Краснодар',
    address: 'Адрес уточняется',
    coordinates: [45.0355, 38.9753],
    type: 'branch',
    applicationIds: ['passenger', 'commercial', 'special', 'service'],
    phone: '+7 (861) 000-00-00',
    email: 'krd@alleya-group.ru',
    isPlaceholder: true,
  },
  {
    id: 'sam',
    name: 'Дилерский центр Самара',
    city: 'Самара',
    address: 'Адрес уточняется',
    coordinates: [53.1959, 50.1002],
    type: 'dealer',
    applicationIds: ['passenger', 'service'],
    phone: '+7 (846) 000-00-00',
    email: 'samara@alleya-group.ru',
    isPlaceholder: true,
  },
  {
    id: 'ufa',
    name: 'Дилерский центр Уфа',
    city: 'Уфа',
    address: 'Адрес уточняется',
    coordinates: [54.7388, 55.9721],
    type: 'dealer',
    applicationIds: ['passenger', 'commercial'],
    phone: '+7 (347) 000-00-00',
    email: 'ufa@alleya-group.ru',
    isPlaceholder: true,
  },
  {
    id: 'chel',
    name: 'Дилерский центр Челябинск',
    city: 'Челябинск',
    address: 'Адрес уточняется',
    coordinates: [55.1644, 61.4368],
    type: 'dealer',
    applicationIds: ['industry', 'equipment'],
    phone: '+7 (351) 000-00-00',
    email: 'chel@alleya-group.ru',
    isPlaceholder: true,
  },
  {
    id: 'rnd',
    name: 'Партнёр Ростов-на-Дону',
    city: 'Ростов-на-Дону',
    address: 'Адрес уточняется',
    coordinates: [47.2357, 39.7015],
    type: 'partner',
    applicationIds: ['commercial', 'special'],
    phone: '+7 (863) 000-00-00',
    email: 'rostov@alleya-group.ru',
    isPlaceholder: true,
  },
  {
    id: 'vrn',
    name: 'Партнёр Воронеж',
    city: 'Воронеж',
    address: 'Адрес уточняется',
    coordinates: [51.6606, 39.2003],
    type: 'partner',
    applicationIds: ['passenger', 'service'],
    phone: '+7 (473) 000-00-00',
    email: 'voronezh@alleya-group.ru',
    isPlaceholder: true,
  },
  {
    id: 'perm',
    name: 'Партнёр Пермь',
    city: 'Пермь',
    address: 'Адрес уточняется',
    coordinates: [58.0105, 56.2502],
    type: 'partner',
    applicationIds: ['industry', 'equipment'],
    phone: '+7 (342) 000-00-00',
    email: 'perm@alleya-group.ru',
    isPlaceholder: true,
  },
  {
    id: 'vlg',
    name: 'Партнёр Волгоград',
    city: 'Волгоград',
    address: 'Адрес уточняется',
    coordinates: [48.708, 44.5133],
    type: 'partner',
    applicationIds: ['commercial', 'special'],
    phone: '+7 (8442) 00-00-00',
    email: 'volgograd@alleya-group.ru',
    isPlaceholder: true,
  },
];
