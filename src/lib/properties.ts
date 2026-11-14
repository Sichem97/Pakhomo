
import type { Property } from '../types'

export type AppwritePropertyRow = {
  $id: string
  Title: string
  Description: string
  countryCode: 'MW' | 'CD'
  City: string
  Area: string
  propertyType: Property['type']
  listingType: Property['listingType']
  Price: number
  Currency: Property['currency']
  Bedrooms: number | null
  Bathrooms: number | null
  size: number | null
  ImageField: string
  ownerUserId: string
  ownerName: string
  ownerPhone: string
  ownerEmail: string
  status: 'Pending' | 'Approved' | 'Rejected'
  verified: boolean
}

export function mapAppwriteRowToProperty(
  row: AppwritePropertyRow
): Property {
  return {
    id: row.$id,
    $id: row.$id,
    title: row.Title,
    description: row.Description,
    countryCode: row.countryCode,
    city: row.City,
    area: row.Area,
    type: row.propertyType,
    listingType: row.listingType,
    price: row.Price,
    currency: row.Currency,
    bedrooms: row.Bedrooms ?? undefined,
    bathrooms: row.Bathrooms ?? undefined,
    size: row.size ?? undefined,
    imageUrl: row.ImageField,
    ownerName: row.ownerName,
    ownerPhone: row.ownerPhone,
    ownerEmail: row.ownerEmail,
    verified: row.status === 'Approved',
  }
}

export function mapPropertyToAppwriteRow(
  property: Property
) {
  return {
    Title: property.title,
    Description: property.description,
    countryCode: property.countryCode,
    City: property.city,
    Area: property.area,
    propertyType: property.type,
    listingType: property.listingType,
    Price: property.price,
    Currency: property.currency,
    Bedrooms: property.bedrooms ?? null,
    Bathrooms: property.bathrooms ?? null,
    size: property.size ?? null,
    ImageField: property.imageUrl,
    ownerUserId: '',
    ownerName: property.ownerName ?? '',
    ownerPhone: property.ownerPhone ?? '',
    ownerEmail: property.ownerEmail ?? '',
    status: 'Pending' as const,
    verified: false,
  }
}
