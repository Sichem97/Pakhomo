
export type CountryCode = 'MW' | 'CD'

export type ListingType = 'Rent' | 'Sale'

export type PropertyKind =
  | 'House'
  | 'Apartment'
  | 'Land'
  | 'Shop'
  | 'Office'
  | 'Hotel'

export interface Property {
  $id?: string
  id?: string

  // Main property information
  title: string
  description: string
  countryCode: CountryCode
  city: string
  area: string
  type: PropertyKind
  listingType: ListingType

  // Pricing
  price: number
  currency: 'MWK' | 'USD' | 'CDF'

  // Property characteristics
  bedrooms?: number
  bathrooms?: number
  size?: number

  // Images
  imageUrl: string
  images?: string[]

  // Owner contact information
  ownerName?: string
  ownerPhone?: string
  ownerEmail?: string

  // Verification
  verified: boolean
}
