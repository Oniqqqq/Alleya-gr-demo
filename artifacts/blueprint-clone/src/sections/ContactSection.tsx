import { useEffect, useRef } from 'react';
import ContactForm, { ContactContext } from '../components/ContactForm';

interface ContactSectionProps {
  context?: ContactContext;
}

/**
 * Финальная призывная секция «Обсудить сотрудничество».
 * Общая для главной страницы и страницы портфеля брендов.
 */
export default function ContactSection({ context }: ContactSectionProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.1 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    if (formRef.current) observer.observe(formRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="contact-section" id="contact">
      <div className="contact-left">
        <div className="small-title">Контакты</div>
        <div ref={titleRef} className="smart-text">
          <h2 className="h2">
            <span className="line"><span className="text">Обсудить</span></span>
            <span className="line"><span className="text">сотрудничество</span></span>
          </h2>
        </div>
        <p className="contact-lead">
          Расскажите о вашей задаче — подберём бренды, форматы поставок
          и условия партнёрства под ваш регион.
        </p>
      </div>

      <div ref={formRef} className="contact-right fade-in">
        <ContactForm context={context} />
      </div>
    </section>
  );
}
