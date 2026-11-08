import type { Property } from '../types'

export const sampleProperties: Property[] = [
  {
    title: 'Modern family home in Area 47', description: 'A bright family home with a private garden and secure parking.',
    countryCode: 'MW', city: 'Lilongwe', area: 'Area 47', type: 'House', listingType: 'Rent',
    price: 850000, currency: 'MWK', bedrooms: 3, bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-160059	virtual?auto=format&fit=crop&w=1200&q=85'.replace('160059_virtual','1600596542815-ffad4c1539a9'),
    verified: true
  },
  {
    title: 'Contemporary apartment near the city', description: 'Comfortable apartment close to shops, offices and transport.',
    countryCode: 'MW', city: 'Blantyre', area: 'Nyambadwe', type: 'Apartment', listingType: 'Rent',
    price: 650000, currency: 'MWK', bedrooms: 2, bathrooms: 1,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
    verified: true
  },
  {
    title: 'Residential plot with road access', description: 'A well-positioned plot suitable for a new home or investment.',
    countryCode: 'MW', city: 'Mzuzu', area: 'Katoto', type: 'Land', listingType: 'Sale',
    price: 18000000, currency: 'MWK',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85',
    verified: false
  },
  {
    title: 'Spacious house in Golf', description: 'A spacious property in a sought-after residential neighbourhood.',
    countryCode: 'CD', city: 'Lubumbashi', area: 'Golf', type: 'House', listingType: 'Rent',
    price: 1200, currency: 'USD', bedrooms: 4, bathrooms: 3,
    imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85',
    verified: true
  },
  {
    title: 'Apartment in central Kinshasa', description: 'Practical city apartment with convenient access to services.',
    countryCode: 'CD', city: 'Kinshasa', area: 'Gombe', type: 'Apartment', listingType: 'Rent',
    price: 950, currency: 'USD', bedrooms: 2, bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85',
    verified: true
  },
  {
    title: 'Commercial land in Kolwezi', description: 'Land with potential for commercial or mixed-use development.',
    countryCode: 'CD', city: 'Kolwezi', area: 'Centre-ville', type: 'Land', listingType: 'Sale',
    price: 45000, currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85',
    verified: false
  }
]
