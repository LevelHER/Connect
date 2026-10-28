import React, { useEffect, useState } from 'react';
import { useConfiguration } from '../../context/configurationContext';
import { NamedLink, Page, LayoutSingleColumn, ListingCard, IconSpinner } from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import { SectionBuilder } from '../PageBuilder/PageBuilder';

import css from './Home.module.css';

const SECTION_ID = 'home-featured';
const SHOW_LISTINGS = false;
const ALL_SECTIONS = [{ sectionId: SECTION_ID, sectionType: 'listings', listingSelection: 'newest' }];

// Fill these in when the client sends them.
const CITY_FORM_KEY = '';
const AFFILIATE_URL = '';
const AFFILIATE_TEXT = 'Join our Affiliate Program';

const TREATMENTS = [
  { key: 'botox', label: 'Botox', text: 'Smooth fine lines and wrinkles' },
  { key: 'dermal-fillers', label: 'Dermal Fillers', text: 'Restore volume and contour' },
  { key: 'hydrafacial', label: 'HydraFacial', text: 'Deep cleanse and glow' },
  { key: 'laser-hair-removal', label: 'Laser Hair Removal', text: 'Long-lasting smooth skin' },
  { key: 'facial', label: 'Facial', text: 'Refresh and renew your skin' },
  { key: 'prp', label: 'PRP', text: 'Natural skin rejuvenation' },
];

const STEPS = [
  { title: 'Scout the Roster', text: 'Browse elite, member-vetted aestheticians across our cities and unlock your private member rates.' },
  { title: 'Book Things Your Way', text: 'Book now or schedule later, and pay upfront. Have it your way\u2014what other way is there, anyway?' },
  { title: 'The VIP Class (Yeah, We Said It)', text: 'Grab your ideal slot and work with seasoned aestheticians who know the game\u2014and know an insider when they see one.' },
];

const findSection = (sections, re, exclude) =>
  (sections || []).find(s => {
    if (s === exclude) {
      return false;
    }
    const title = (s.title && s.title.content) || '';
    return re.test(title) || re.test(s.sectionId || '');
  });

const CityForm = () => {
  const [status, setStatus] = useState('idle');

  const onSubmit = e => {
    e.preventDefault();
    if (!CITY_FORM_KEY) {
      setStatus('notready');
      return;
    }
    const data = new FormData(e.target);
    if (data.get('botcheck')) {
      return;
    }
    setStatus('sending');
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: CITY_FORM_KEY,
        subject: 'LevelHER: city suggestion',
        from_name: 'LevelHER website',
        name: data.get('name'),
        city: data.get('city'),
        state: data.get('state'),
      }),
    })
      .then(r => r.json())
      .then(json => setStatus(json && json.success ? 'done' : 'error'))
      .catch(() => setStatus('error'));
  };

  if (status === 'done') {
    return <p className={css.cityMsg}>Thank you! We have noted your city.</p>;
  }

  return (
    <form className={css.cityForm} onSubmit={onSubmit}>
      <input className={css.cityInput} name="name" placeholder="Your name" required />
      <input className={css.cityInput} name="city" placeholder="City" required />
      <input className={css.cityInput} name="state" placeholder="State" required />
      <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
      <button className={css.citySubmit} type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Add my city'}
      </button>
      {status === 'error' ? (
        <p className={css.cityMsg}>Something went wrong. Please try again.</p>
      ) : null}
      {status === 'notready' ? (
        <p className={css.cityMsg}>This form is not connected yet.</p>
      ) : null}
    </form>
  );
};

const CityNote = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={css.cityNoteWrap}>
      <p className={css.cityNote}>
        Guessing your city isn't on the board yet?{' '}
        <button type="button" className={css.cityNoteLink} onClick={() => setOpen(!open)}>
          Click Here.
        </button>
      </p>
      {open ? <CityForm /> : null}
    </div>
  );
};

const JoinLink = ({ config }) => {
  const types = (config && config.user && config.user.userTypes) || [];
  const t = types.find(x => /provider|seller|salon|practitioner/i.test(x.userType));
  return t ? (
    <NamedLink className={css.joinLink} name="SignupForUserTypePage" params={{ userType: t.userType }}>
      List your salon today.
    </NamedLink>
  ) : (
    <NamedLink className={css.joinLink} name="SignupPage">
      List your salon today.
    </NamedLink>
  );
};

const HomeFooter = () => (
  <footer className={css.footer}>
    <div className={css.footerInner}>
      <div className={css.footerBrand}>
        <div className={css.footerLogo}>LevelHER</div>
        <p className={css.footerText}>
          Beauty and wellness treatments from trusted providers, with secure booking and member rates.
        </p>
      </div>
      <div className={css.footerCol}>
        <h4 className={css.footerHeading}>Treatments</h4>
        {TREATMENTS.map(t => (
          <div key={t.key} className={css.footerLink} style={{ cursor: 'default' }}>
            {t.label}
          </div>
        ))}
      </div>
      <div className={css.footerCol}>
        <h4 className={css.footerHeading}>LevelHER</h4>
        <div className={css.footerLink} style={{ cursor: 'default' }}>All treatments</div>
        <NamedLink className={css.footerLink} name="NewListingPage">
          List your salon
        </NamedLink>
        <NamedLink className={css.footerLink} name="SignupPage">
          Sign up
        </NamedLink>
        <NamedLink className={css.footerLink} name="LoginPage">
          Log in
        </NamedLink>
      </div>
      <div className={css.footerCol}>
        <h4 className={css.footerHeading}>Legal</h4>
        <NamedLink className={css.footerLink} name="TermsOfServicePage">
          Terms of Service
        </NamedLink>
        <NamedLink className={css.footerLink} name="PrivacyPolicyPage">
          Privacy Policy
        </NamedLink>
      </div>
    </div>
    <div className={css.footerBottom}>
      {'© ' + new Date().getFullYear() + ' LevelHER. All rights reserved.'}
    </div>
  </footer>
);

const Home = props => {
  const { featuredListings, sections } = props;
  const config = useConfiguration();
  const { onFetchFeaturedListings, getListingEntitiesById, parentPage, featuredListingData } =
    featuredListings || {};

  const section = featuredListingData?.[SECTION_ID];
  const fetched = section?.fetched || false;
  const inProgress = section?.inProgress;
  const error = section?.error;
  const listings =
    section?.listingIds && getListingEntitiesById
      ? getListingEntitiesById(section.listingIds).slice(0, 4)
      : [];

  useEffect(() => {
    if (onFetchFeaturedListings && !fetched && inProgress !== true && !error) {
      onFetchFeaturedListings(SECTION_ID, parentPage, config.layout.listingImage, ALL_SECTIONS);
    }
  }, []);

  const citySection = findSection(sections, /city|cities/i);
  const servicesSection = findSection(sections, /favorite|services|level up/i, citySection);

  return (
    <Page title="LevelHER - Beauty and wellness treatments" scrollingDisabled={false}>
      <LayoutSingleColumn topbar={<TopbarContainer />} footer={<HomeFooter />}>
        <section className={css.hero}>
          <h1 className={css.heroTitle}>
            Get in, gorgeous.<br /><em className={css.heroAccent}>Meet your new standard.</em>
          </h1>
          <p className={css.heroText}>
            Step into a higher caliber of self-care with accredited aesthetic experts, seamless booking, and exclusive pricing reserved for members only.
          </p>
          <form className={css.searchForm} action="/s" method="get">
            <input
              className={css.searchInput}
              type="text"
              name="keywords"
              placeholder="Search treatments or providers"
            />
            <button className={css.searchButton} type="submit">
              Search
            </button>
          </form>
        </section>
        <section className={css.trust}>
          <span className={css.trustItem}>✓ Member-Vetted Aestheticians</span>
          <span className={css.trustItem}>✓ Exclusive Members&apos; Pricing</span>
          <span className={css.trustItem}>✓ Book Now or Later&mdash;VIP Treatment Always</span>
        </section>

        {SHOW_LISTINGS && (inProgress === true || listings.length > 0) ? (
          <section className={css.section}>
            <h2 className={css.sectionTitle}>Featured treatments</h2>
            <div className={css.pills}>
              <span className={css.pillActive}>Popular</span>
              {TREATMENTS.map(t => (
                <NamedLink
                  key={t.key}
                  className={css.pill}
                  name="SearchPage"
                  to={{ search: '?pub_treatment=' + t.key }}
                >
                  {t.label}
                </NamedLink>
              ))}
            </div>
            {inProgress === true ? (
              <IconSpinner />
            ) : (
              <ul className={css.featuredGrid}>
                {listings.map(listing => (
                  <li key={listing.id.uuid} className={css.featuredItem}>
                    <ListingCard listing={listing} renderSizes="(max-width: 767px) 100vw, 25vw" />
                  </li>
                ))}
              </ul>
            )}
            <div className={css.moreWrap}>
              <NamedLink name="SearchPage" className={css.moreLink}>
                Explore all treatments
              </NamedLink>
            </div>
          </section>
        ) : null}

        <section className={css.section}>
          <h2 className={css.sectionTitle}>Why LevelHER? Well... Why Not?</h2>
          <div className={css.stepsGrid}>
            <div className={css.step}>
              <h3 className={css.stepTitle}>Elite Talent in Every City</h3>
              <p className={css.stepText}>
                Wherever you travel, gain immediate access to top-tier aestheticians across all our cities who take your results every bit as seriously as you.
              </p>
            </div>
            <div className={css.step}>
              <h3 className={css.stepTitle}>Up to 60% Off, Zero Downside</h3>
              <p className={css.stepText}>Privileged member rates with fully protected checkout and guaranteed refunds if your aesthetician ever cancels.</p>
            </div>
            <div className={css.step}>
              <h3 className={css.stepTitle}>Your Schedule, Your Terms</h3>
              <p className={css.stepText}>
                Lock in your appointment rate today and book on your own timeline.
              </p>
            </div>
          </div>
        </section>

        {citySection ? (
          <div className={css.consoleSection}>
            <SectionBuilder sections={[citySection]} options={{}} />
          </div>
        ) : null}
        {CITY_FORM_KEY ? <CityNote /> : null}

        <section className={css.sectionAlt}>
          <h2 className={css.sectionTitle}>How it works</h2>
          <div className={css.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={s.title} className={css.step}>
                <span className={css.stepNumber}>{i + 1}</span>
                <h3 className={css.stepTitle}>{s.title}</h3>
                <p className={css.stepText}>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {servicesSection ? (
          <div className={css.consoleSection}>
            <SectionBuilder sections={[servicesSection]} options={{}} />
          </div>
        ) : null}
        <p className={css.joinLine}>
          Where high-value clients and premier spas align. <JoinLink config={config} />
        </p>

        {AFFILIATE_URL ? (
          <section className={css.affiliate}>
            <a className={css.affiliateLink} href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer">
              {AFFILIATE_TEXT}
            </a>
          </section>
        ) : null}
      </LayoutSingleColumn>
    </Page>
  );
};

export default Home;