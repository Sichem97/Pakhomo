
import { Client, TablesDB, Storage, Account } from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT as string
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID as string

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID as string
const propertiesTableId = import.meta.env.VITE_APPWRITE_PROPERTIES_TABLE_ID as string
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID as string

export const appwriteConfigured = Boolean(
  endpoint &&
  projectId &&
  databaseId &&
  propertiesTableId
)

export const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)

export const account = new Account(client)
export const tablesDB = new TablesDB(client)
export const storage = new Storage(client)

export const appwriteConfig = {
  databaseId,
  propertiesTableId,
  bucketId,
}
