
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
// SHARED FUNCTION RESPONSE HANDLER
// ==========================================

async function executeAPI(
  path: string,
  method: ExecutionMethod,
  body = ''
) {
  const execution = await functions.createExecution(
    functionId,
    body,
    false,
    path,
    method
  )

  let result: any

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
      result.message || 'The request could not be completed.'
    )
  }

  return result
}

// ==========================================
// ADMINISTRATOR AUTHENTICATION
// ==========================================

export async function adminLogin(
  email: string,
  password: string
) {
  await account.createEmailPasswordSession(email, password)

  return await account.get()
}

export async function adminLogout() {
  await account.deleteSession('current')
}

export async function getCurrentUser() {
  try {
    return await account.get()
  } catch {
    return null
  }
}

// ==========================================
// ADMIN PROPERTY TYPES
// ==========================================

export interface AdminProperty {
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
  imageId?: string
  verified: boolean
  status: 'Pending' | 'Approved' | 'Rejected'
  ownerName?: string
  ownerPhone?: string
  ownerEmail?: string
}

// ==========================================
// ADMIN: RETRIEVE ALL PROPERTIES
// ==========================================

export async function getAdminProperties(): Promise<AdminProperty[]> {
  const result = await executeAPI(
    '/admin/properties',
    ExecutionMethod.GET
  )

  return result.properties || []
}

// ==========================================
// ADMIN: APPROVE OR REJECT PROPERTY
// ==========================================

export async function updateAdminProperty(
  propertyId: string,
  status: 'Approved' | 'Rejected'
) {
  return await executeAPI(
    `/admin/properties/${encodeURIComponent(propertyId)}`,
    ExecutionMethod.POST,
    JSON.stringify({ status })
  )
}

// ==========================================
// ADMIN: DELETE PROPERTY
// ==========================================

export async function deleteAdminProperty(propertyId: string) {
  return await executeAPI(
    `/admin/properties/${encodeURIComponent(propertyId)}`,
    ExecutionMethod.DELETE
  )
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

  const result = await executeAPI(
    '/',
    ExecutionMethod.POST,
    JSON.stringify(payload)
  )

  return result
}

// ==========================================
// RETRIEVE APPROVED PROPERTIES
// ==========================================

export async function getApprovedProperties(): Promise<Property[]> {
  const result = await executeAPI(
    '/',
    ExecutionMethod.GET
  )

  return (result.properties || []).map((property: Property) => ({
    ...property,
    verified: true,
  }))
}
