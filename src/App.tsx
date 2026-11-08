import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BadgeCheck, BedDouble, Building2, ChevronDown, Compass, Heart, MapPin, Menu, Search, ShieldCheck, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { sampleProperties } from './data/properties'
import { detectCountry } from './lib/country'
import { appwriteConfigured } from './lib/appwrite'
import type { CountryCode, Property, PropertyKind } from './types'

const countries: Record<CountryCode, { name: string; flag: string; currency: string; cities: string[] }> = {
  MW: { name: 'Malawi', flag: '🇲🇼', currency: 'MWK', cities: ['All cities', 'Lilongwe', 'Blantyre', 'Mzuzu'] },
  CD: { name: 'DR Congo', flag: '🇨🇩', currency: 'USD', cities: ['All cities', 'Lubumbashi', 'Kinshasa', 'Kolwezi'] },
}
const kinds: Array<'All types' | PropertyKind> = ['All types', 'House', 'Apartment', 'Land', 'Shop', 'Office', 'Hotel']

function money(value: number, currency: Property['currency']) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value) + ' ' + currency
}

export default function App() {
  const [country, setCountry] = useState<CountryCode>('MW')
  const [countryReady, setCountryReady] = useState(false)
  const [city, setCity] = useState('All cities')
  const [kind, setKind] = useState<'All types' | PropertyKind>('All types')
  const [listing, setListing] = useState<'All' | 'Rent' | 'Sale'>('All')
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState<string[]>([])
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showCountryMenu, setShowCountryMenu] = useState(false)

  useEffect(() => {
    detectCountry().then(value => { setCountry(value); setCountryReady(true) })
  }, [])

  const visibleProperties = useMemo(() => sampleProperties.filter((p) =>
    p.countryCode === country &&
    (city === 'All cities' || p.city === city) &&
    (kind === 'All types' || p.type === kind) &&
    (listing === 'All' || p.listingType === listing) &&
    `${p.title} ${p.city} ${p.area} ${p.type}`.toLowerCase().includes(query.toLowerCase())
  ), [country, city, kind, listing, query])

  const toggleSaved = (title: string) => setSaved(current => current.includes(title) ? current.filter(x => x !== title) : [...current, title])

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark"><Building2 size={21}/></span><span>habitat<span className="brand-light">africa</span></span></a>
        <nav className={mobileMenu ? 'nav nav-open' : 'nav'}>
          <a href="#discover" onClick={() => setMobileMenu(false)}>Discover</a>
          <a href="#how" onClick={() => setMobileMenu(false)}>How it works</a>
          <a href="#list-property" onClick={() => setMobileMenu(false)}>List a property</a>
        </nav>
        <div className="header-actions">
          <div className="country-wrap">
            <button className="country-button" onClick={() => setShowCountryMenu(!showCountryMenu)}>
              <span>{countries[country].flag}</span><span>{countries[country].name}</span><ChevronDown size={15}/>
            </button>
            {showCountryMenu && <div className="country-menu">
              {(Object.keys(countries) as CountryCode[]).map(code => <button key={code} onClick={() => { setCountry(code); setCity('All cities'); setShowCountryMenu(false) }}>{countries[code].flag} {countries[code].name}</button>)}
            </div>}
          </div>
          <a className="list-button" href="#list-property">List your property <ArrowRight size={15}/></a>
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X/> : <Menu/>}</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-image"/>
          <div className="hero-shade"/>
          <div className="hero-content">
            <div className="eyebrow"><Sparkles size={14}/> A better way to find your place</div>
            <h1>Find a place<br/><em>to call yours.</em></h1>
            <p>Discover homes, land and spaces across Africa — with more clarity, confidence and trust.</p>
            <a className="hero-link" href="#discover">Explore properties <ArrowRight size={17}/></a>
          </div>
          <div className="hero-note"><span className="note-dot"/> Local properties. Trusted connections.</div>
        </section>

        <section className="search-section" id="discover">
          <div className="section-heading">
            <div><span className="overline">YOUR NEXT CHAPTER STARTS HERE</span><h2>Explore properties in {countries[country].name}</h2></div>
            <span className="detected"><span className="pulse"/> {countryReady ? 'Country detected' : 'Detecting country'}</span>
          </div>
          <div className="search-panel">
            <div className="search-input"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by city, neighbourhood or keyword"/></div>
            <div className="select-wrap"><MapPin size={17}/><select value={city} onChange={e => setCity(e.target.value)}>{countries[country].cities.map(c => <option key={c}>{c}</option>)}</select></div>
            <div className="select-wrap"><SlidersHorizontal size={17}/><select value={kind} onChange={e => setKind(e.target.value as typeof kind)}>{kinds.map(k => <option key={k}>{k}</option>)}</select></div>
            <button className="search-button" onClick={() => document.getElementById('property-grid')?.scrollIntoView({ behavior: 'smooth' })}>Search <ArrowRight size={16}/></button>
          </div>

          <div className="listing-toolbar">
            <div className="tabs">
              {(['All', 'Rent', 'Sale'] as const).map(tab => <button key={tab} className={listing === tab ? 'tab active' : 'tab'} onClick={() => setListing(tab)}>{tab === 'All' ? 'All properties' : tab === 'Rent' ? 'For rent' : 'For sale'}</button>)}
            </div>
            <span className="result-count">{visibleProperties.length} properties found</span>
          </div>

          <div className="property-grid" id="property-grid">
            {visibleProperties.map((property, index) => <PropertyCard key={property.title} property={property} saved={saved.includes(property.title)} onSave={() => toggleSaved(property.title)} index={index}/>)}
            {visibleProperties.length === 0 && <div className="empty-state"><Compass size={30}/><h3>No properties found yet</h3><p>Try another city or adjust your filters. New listings will appear here as the marketplace grows.</p><button onClick={() => {setCity('All cities');setKind('All types');setListing('All');setQuery('')}}>Clear filters</button></div>}
          </div>
          <div className="browse-note"><ShieldCheck size={18}/><span>Listings marked verified have passed our initial owner review.</span></div>
        </section>

        <section className="trust-section" id="how">
          <div className="trust-copy"><span className="overline">PROPERTY SEARCH, WITH PEACE OF MIND</span><h2>Confidence should be part of every move.</h2><p>We are building a marketplace where property details are clearer and owners can be reviewed before their listings go live.</p><a href="#list-property">Learn how verification works <ArrowRight size={16}/></a></div>
          <div className="trust-points">
            <div className="trust-point"><span><BadgeCheck/></span><div><h3>Reviewed owners</h3><p>Owner identity checks before listings are approved.</p></div></div>
            <div className="trust-point"><span><Search/></span><div><h3>Local discovery</h3><p>Start with properties available in your country.</p></div></div>
            <div className="trust-point"><span><Heart/></span><div><h3>Made for real life</h3><p>Homes, plots and business spaces in one place.</p></div></div>
          </div>
        </section>

        <section className="owner-cta" id="list-property">
          <div><span className="overline">HAVE A PROPERTY?</span><h2>Put your property in front of the right people.</h2><p>Join the marketplace and connect with people looking in your area.</p></div>
          <a href="mailto:hello@habitat-africa.example?subject=List%20my%20property">Register your interest <ArrowRight size={17}/></a>
        </section>
      </main>

      <footer><a className="brand footer-brand" href="#"><span className="brand-mark"><Building2 size={20}/></span><span>habitat<span className="brand-light">africa</span></span></a><span>Building better property connections across Africa.</span><span>© 2026 Habitat Africa</span></footer>
      {!appwriteConfigured && <div className="dev-ribbon">Preview data · Connect Appwrite to publish live listings</div>}
    </div>
  )
}

function PropertyCard({ property, saved, onSave, index }: { property: Property; saved: boolean; onSave: () => void; index: number }) {
  return <article className="property-card" style={{ animationDelay: `${index * 70}ms` }}>
    <div className="property-photo"><img src={property.imageUrl} alt={property.title} loading="lazy"/><span className="type-pill">{property.listingType === 'Rent' ? 'For rent' : 'For sale'}</span><button className={saved ? 'save-button saved' : 'save-button'} onClick={onSave} aria-label="Save property"><Heart size={17} fill={saved ? 'currentColor' : 'none'}/></button></div>
    <div className="property-info"><div className="property-location"><MapPin size={14}/>{property.area}, {property.city}</div><h3>{property.title}</h3><div className="property-meta"><span>{property.type}</span>{property.bedrooms && <span><BedDouble size={14}/>{property.bedrooms} beds</span>}{property.bathrooms && <span>{property.bathrooms} baths</span>}</div><div className="property-bottom"><strong>{money(property.price, property.currency)}<small>{property.listingType === 'Rent' ? ' / month' : ' asking price'}</small></strong>{property.verified && <span className="verified"><BadgeCheck size={14}/> Verified</span>}</div></div>
  </article>
}
