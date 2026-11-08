# pakhomo Africa — Real-estate marketplace starter

A responsive React + TypeScript starter for a Malawi and DRC property marketplace. It includes country-aware browsing, country switching, listing filters, sample property cards and an Appwrite client setup.

## 1. Run locally

Install Node.js (20 or newer), then:

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite.

## 2. Configure Appwrite

1. Create an Appwrite project.
2. Add a Web platform using your deployment hostname (and `localhost` for local development).
3. Create a database.
4. Create a `properties` collection and a `property-images` storage bucket.
5. Copy your Appwrite endpoint, project ID, database ID, collection ID and bucket ID into `.env`.

Suggested `properties` collection attributes:

| Attribute | Type | Notes |
|---|---|---|
| title | string | Required |
| description | string | Required |
| countryCode | string | `MW` or `CD` |
| city | string | Required |
| area | string | Neighbourhood |
| type | string | House, Apartment, Land, Shop, Office, Hotel |
| listingType | string | Rent or Sale |
| price | float | Numeric price |
| currency | string | MWK, USD or CDF |
| bedrooms | integer | Optional |
| bathrooms | integer | Optional |
| imageFileId | string | Storage file ID |
| verified | boolean | Set only after admin review |
| status | string | `pending`, `published`, `rejected`, `taken` |
| ownerUserId | string | Appwrite user ID |

Recommended indexes: `countryCode`, `status`, `city`, `listingType`, and a compound index on `countryCode + status`.

## 3. Important before production

- The current property cards use sample data in `src/data/properties.ts`. They are not yet loaded from Appwrite.
- Country detection currently uses `ipapi.co` and falls back to Malawi if lookup fails. Visitors can manually switch between Malawi and DRC. For production, proxy geolocation through a server function and make the fallback country configurable.
- Never trust the browser to approve an owner or mark a listing as verified. Enforce owner/admin permissions in Appwrite collection permissions or server functions.
- Do not expose Appwrite API keys in frontend environment variables. The web project ID and endpoint are public identifiers; server API keys must remain secret.
- Add real payment providers only after choosing providers for each country.
- Prices and currencies in the sample cards are illustrative demo values, not live offers.
- Replace the provisional brand name, contact email and sample photos before public launch.

## 4. Build for deployment

```bash
npm run build
```

Vite outputs the production site into `dist/`. Deploy that folder to Appwrite Sites (if enabled for your project) or another static host. Appwrite Database and Storage provide the backend services; the frontend hosting service serves the built React app.
