export type CountryCode = 'MW' | 'CD'
export type ListingType = 'Rent' | 'Sale'
export type PropertyKind = 'House' | 'Apartment' | 'Land' | 'Shop' | 'Office' | 'Hotel'

export interface Property {
  $id?: string
  title: string
  description: string
  countryCode: CountryCode
  city: string
  area: string
  type: PropertyKind
  listingType: ListingType
  price: number
  currency: 'MWK' | 'USD' | 'CDF'
  bedrooms?: number
  bathrooms?: number
  imageUrl: string
  verified: boolean
}
