
import {
  Client,
  Account,
  Functions,
  Storage,
  ExecutionMethod,
} from 'appwrite'

import type { Property } from '../types'

// ==========================================
// APPWRITE CONFIGURATION
// ==========================================

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT as string
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID as string

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID as string
const propertiesTableId = import.meta.env.VITE_APPWRITE_PROPERTIES_TABLE_ID as string
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID as string

export const functionId = '6afb3359001a6a814cd2'

export const appwriteConfigured = Boolean(
  endpoint && projectId && functionId
)

// ==========================================
// APPWRITE CLIENT
// ==========================================

export const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)

export const account = new Account(client)
export const functions = new Functions(client)
export const storage = new Storage(client)

export const appwriteConfig = {
  databaseId,
  propertiesTableId,
  bucketId,
  functionId,
}

// ==========================================
// SUBMIT PROPERTY TO APPWRITE
// ==========================================

export async function submitPropertyToAPI(property: Property) {
  const image = property.images?.[0] || property.imageUrl

  if (!image || !image.startsWith('data:image/')) {
    throw new Error('Please select a valid property photo.')
  }

  const payload = {
    property: {
      title: property.title,
      description: property.description,
      countryCode: property.countryCode,
      city: property.city,
      area: property.area,
      type: property.type,
      listingType: property.listingType,
      price: property.price,
      currency: property.currency,
      bedrooms: property.bedrooms ?? 0,
      bathrooms: property.bathrooms ?? 0,
      size: property.size,
      ownerName: property.ownerName,
      ownerPhone: property.ownerPhone,
      ownerEmail: property.ownerEmail,
    },
    image,
  }

  const execution = await functions.createExecution(
    functionId,
    JSON.stringify(payload),
    false,
    '/'
  )

  let result: {
    success?: boolean
    message?: string
    propertyId?: string
    status?: string
  }

  try {
    result = JSON.parse(execution.responseBody)
  } catch {
    throw new Error('The server returned an invalid response.')
  }

  if (
    execution.responseStatusCode < 200 ||
    execution.responseStatusCode >= 300 ||
    !result.success
  ) {
    throw new Error(
      result.message || 'Property submission failed.'
    )
  }

  return result
}

// ==========================================
// RETRIEVE APPROVED PROPERTIES
// ==========================================

export async function getApprovedProperties(): Promise<Property[]> {
  const execution = await functions.createExecution(
    functionId,
    '',
    false,
    '/',
    ExecutionMethod.GET
  )

  let result: {
    success?: boolean
    message?: string
    total?: number
    properties?: Array<{
      id: string
      title: string
      description: string
      countryCode: 'MW' | 'CD'
      city: string
      area: string
      type: Property['type']
      listingType: Property['listingType']
      price: number
      currency: Property['currency']
      bedrooms?: number
      bathrooms?: number
      size?: number
      imageUrl: string
      verified: boolean
    }>
  }

  try {
    result = JSON.parse(execution.responseBody)
  } catch {
    throw new Error('The server returned an invalid response.')
  }

  if (
    execution.responseStatusCode < 200 ||
    execution.responseStatusCode >= 300 ||
    !result.success
  ) {
    throw new Error(
      result.message || 'Unable to load approved properties.'
    )
  }

  return (result.properties || []).map(property => ({
    ...property,
    verified: true,
  }))
}
