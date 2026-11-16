
import {
  Client,
  Account,
  Functions,
  Storage,
} from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT as string
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID as string

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID as string
const propertiesTableId = import.meta.env.VITE_APPWRITE_PROPERTIES_TABLE_ID as string
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID as string

// Appwrite Function
export const functionId = 'pakhomo-api'

export const appwriteConfigured = Boolean(
  endpoint &&
  projectId &&
  functionId
)

// Appwrite client
export const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)

// Appwrite services
export const account = new Account(client)
export const functions = new Functions(client)
export const storage = new Storage(client)

// Existing configuration
export const appwriteConfig = {
  databaseId,
  propertiesTableId,
  bucketId,
  functionId,
}
