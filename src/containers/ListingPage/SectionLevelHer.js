import React from 'react';

import css from './SectionLevelHer.module.css';

const TRUST_POINTS = [
  'Secure payments with Stripe',
  'Pay now, choose your date later',
  'Full refund if your provider cancels',
  'Exclusive member rates',
];

const FAQ = [
  {
    q: 'How does payment work?',
    a: 'You pay securely online with Stripe when you book.',
  },
  {
    q: 'Can I choose my date later?',
    a: 'Yes. Choose "Pay now, schedule later" and pick your appointment date and time afterwards.',
  },
  {
    q: 'What if my provider cancels?',
    a: 'You get a full refund.',
  },
  {
    q: 'What are member rates?',
    a: 'Exclusive savings from trusted beauty and wellness providers.',
  },
];

export const SectionTrustStrip = () => (
  <ul className={css.trustStrip}>
    {TRUST_POINTS.map(text => (
      <li key={text} className={css.trustItem}>
        <span className={css.tick} aria-hidden="true">
          &#10003;
        </span>
        {text}
      </li>
    ))}
  </ul>
);

export const SectionGoodToKnow = () => (
  <section className={css.goodToKnow}>
    <h2 className={css.heading}>Good to know</h2>
    {FAQ.map(item => (
      <details key={item.q} className={css.faqItem}>
        <summary className={css.faqQuestion}>{item.q}</summary>
        <p className={css.faqAnswer}>{item.a}</p>
      </details>
    ))}
  </section>
);
const prettify = value =>
  String(value)
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

const treatmentLabel = (publicData, listingFieldConfigs) => {
  const value = publicData && publicData.treatment;
  if (!value) {
    return null;
  }
  const field = (listingFieldConfigs || []).find(f => f.key === 'treatment');
  const option =
    field && field.enumOptions ? field.enumOptions.find(o => o.option === value) : null;
  return option ? option.label : prettify(value);
};

export const SectionHighlights = props => {
  const { publicData, listingFieldConfigs, authorDisplayName } = props;
  const treatment = treatmentLabel(publicData, listingFieldConfigs);
  const tiles = [
    treatment ? { title: 'Treatment', text: treatment } : null,
    { title: 'Booking', text: 'Pay now, schedule your date later' },
    { title: 'Payment', text: 'Secure payment with Stripe' },
    authorDisplayName ? { title: 'Provider', text: authorDisplayName } : null,
  ].filter(Boolean);

  return (
    <ul className={css.highlights}>
      {tiles.map(tile => (
        <li key={tile.title} className={css.highlightTile}>
          <span className={css.highlightTitle}>{tile.title}</span>
          <span className={css.highlightText}>{tile.text}</span>
        </li>
      ))}
    </ul>
  );
};
