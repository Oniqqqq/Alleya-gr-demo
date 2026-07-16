import { useEffect, useRef, useState } from 'react';

export const CONTACT_TOPICS = [
  'Стать партнёром',
  'Получить информацию о брендах',
  'Обсудить поставки',
  'Найти дилера',
  'Другой вопрос',
] as const;

export interface ContactContext {
  brand?: string;
  application?: string;
  location?: string;
}

interface ContactFormProps {
  /** Автоподстановка выбранного бренда/направления/точки (страница брендов) */
  context?: ContactContext;
}

interface FormValues {
  name: string;
  company: string;
  phone: string;
  email: string;
  topic: string;
  comment: string;
}

const EMPTY: FormValues = { name: '', company: '', phone: '', email: '', topic: CONTACT_TOPICS[0], comment: '' };

/** Лёгкое форматирование российского номера: +7 (XXX) XXX-XX-XX */
function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (raw.trim().startsWith('+') && !digits.startsWith('7')) return raw; // иностранный номер — не трогаем
  if (!digits) return '';
  digits = digits.startsWith('7') ? digits.slice(1) : digits;
  digits = digits.slice(0, 10);
  let out = '+7';
  if (digits.length > 0) out += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 4) out += `) ${digits.slice(3, 6)}`;
  if (digits.length >= 7) out += `-${digits.slice(6, 8)}`;
  if (digits.length >= 9) out += `-${digits.slice(8, 10)}`;
  return out;
}

/** Локальный обработчик отправки — временная замена фактического API. */
function submitLocally(payload: FormValues & { context?: ContactContext }): Promise<void> {
  void payload;
  return new Promise((resolve) => { setTimeout(resolve, 900); });
}

export default function ContactForm({ context }: ContactFormProps) {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const set = (field: keyof FormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const value = field === 'phone' ? formatPhone(e.target.value) : e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (!values.name.trim()) next.name = 'Укажите имя';
    if (!values.phone.trim()) next.phone = 'Укажите телефон';
    else if (values.phone.replace(/\D/g, '').length < 11) next.phone = 'Номер введён не полностью';
    if (!values.email.trim()) next.email = 'Укажите электронную почту';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Проверьте формат адреса';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (!validate()) return;
    setStatus('sending');
    await submitLocally({ ...values, context });
    if (!mounted.current) return;
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="contact-form contact-form-success" role="status">
        <span className="vs-checkmark contact-success-mark" />
        <h3 className="h3">Заявка отправлена</h3>
        <p className="contact-success-text">
          Спасибо! Мы свяжемся с вами в ближайшее время
          {values.email ? ` — подтверждение придёт на ${values.email}` : ''}.
        </p>
        <button
          type="button"
          className="btn-primary dark"
          onClick={() => { setValues(EMPTY); setStatus('idle'); }}
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  const hasContext = context && (context.brand || context.application || context.location);

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      {hasContext && (
        <div className="contact-context" aria-label="Выбранные параметры">
          {context.brand && <span className="contact-context-chip">Бренд: {context.brand}</span>}
          {context.application && <span className="contact-context-chip">Направление: {context.application}</span>}
          {context.location && <span className="contact-context-chip">Филиал: {context.location}</span>}
        </div>
      )}

      <div className="contact-grid">
        <label className={`contact-field ${errors.name ? 'has-error' : ''}`}>
          <span className="contact-label">Имя *</span>
          <input type="text" value={values.name} onChange={set('name')} placeholder="Как к вам обращаться" autoComplete="name" />
          {errors.name && <span className="contact-error">{errors.name}</span>}
        </label>

        <label className="contact-field">
          <span className="contact-label">Компания</span>
          <input type="text" value={values.company} onChange={set('company')} placeholder="Название компании" autoComplete="organization" />
        </label>

        <label className={`contact-field ${errors.phone ? 'has-error' : ''}`}>
          <span className="contact-label">Телефон *</span>
          <input type="tel" value={values.phone} onChange={set('phone')} placeholder="+7 (___) ___-__-__" autoComplete="tel" />
          {errors.phone && <span className="contact-error">{errors.phone}</span>}
        </label>

        <label className={`contact-field ${errors.email ? 'has-error' : ''}`}>
          <span className="contact-label">Электронная почта *</span>
          <input type="email" value={values.email} onChange={set('email')} placeholder="name@company.ru" autoComplete="email" />
          {errors.email && <span className="contact-error">{errors.email}</span>}
        </label>

        <label className="contact-field contact-field-wide">
          <span className="contact-label">Тема обращения</span>
          <select value={values.topic} onChange={set('topic')}>
            {CONTACT_TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>

        <label className="contact-field contact-field-wide">
          <span className="contact-label">Комментарий</span>
          <textarea value={values.comment} onChange={set('comment')} rows={4} placeholder="Кратко опишите задачу" />
        </label>
      </div>

      <div className="contact-actions">
        <button type="submit" className="btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
        </button>
        <p className="contact-consent">
          Нажимая кнопку, вы соглашаетесь с{' '}
          <a href="/privacy/" onClick={(e) => e.preventDefault()}>политикой конфиденциальности</a>{' '}
          и даёте согласие на обработку персональных данных.
        </p>
      </div>
    </form>
  );
}
