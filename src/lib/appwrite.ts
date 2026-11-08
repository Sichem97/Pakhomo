import { Client, Databases, Storage } from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT as string | undefined
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID as string | undefined

export const appwriteConfigured = Boolean(endpoint && projectId && !projectId.includes('YOUR_'))

const client = new Client()
if (endpoint && projectId) client.setEndpoint(endpoint).setProject(projectId)

export const databases = new Databases(client)
export const storage = new Storage(client)

export const appwriteConfig = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID as string,
  propertiesCollectionId: import.meta.env.VITE_APPWRITE_PROPERTIES_COLLECTION_ID as string,
  bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID as string,
}
