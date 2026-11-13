import './OwnerPage.css'
import { useState } from 'react'

import {
  ArrowLeft,
  Camera,
  ImagePlus,
  MapPin,
  Send,
  X,
} from 'lucide-react'

import type {
  CountryCode,
  ListingType,
  Property,
  PropertyKind,
} from '../types'

interface OwnerPageProps {
  onBack: () => void
  onSubmit: (property: Property) => void
}

const propertyTypes: PropertyKind[] = [
  'House',
  'Apartment',
  'Land',
  'Shop',
  'Office',
  'Hotel',
]

export default function OwnerPage({
  onBack,
  onSubmit,
}: OwnerPageProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [countryCode, setCountryCode] = useState<CountryCode>('CD')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [type, setType] = useState<PropertyKind>('House')
  const [listingType, setListingType] =
    useState<ListingType>('Rent')

  const [price, setPrice] = useState('')
  const [currency, setCurrency] =
    useState<Property['currency']>('USD')

  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [size, setSize] = useState('')

  const [ownerName, setOwnerName] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')

  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState('')

  function handleImages(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || [])

    if (files.length === 0) return

    if (images.length + files.length > 5) {
      setError('You can upload a maximum of 5 photos.')
      event.target.value = ''
      return
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select image files only.')
        return false
      }

      if (file.size > 2 * 1024 * 1024) {
        setError('Each image must be smaller than 2 MB.')
        return false
      }

      return true
    })

    Promise.all(
      validFiles.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader()

          reader.onload = () => {
            resolve(String(reader.result))
          }

          reader.onerror = () => reject(
            new Error('Unable to read image.')
          )

          reader.readAsDataURL(file)
        })
      })
    )
      .then(newImages => {
        setImages(current => [...current, ...newImages])
        setError('')
      })
      .catch(() => {
        setError('An image could not be loaded. Please try again.')
      })

    event.target.value = ''
  }

  function removeImage(index: number) {
    setImages(current =>
      current.filter((_, imageIndex) => imageIndex !== index)
    )
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!images.length) {
      setError('Please upload at least one property photo.')
      return
    }

    const newProperty: Property = {
      id: `property-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      countryCode,
      city: city.trim(),
      area: area.trim(),
      type,
      listingType,
      price: Number(price),
      currency,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      size: size ? Number(size) : undefined,
      imageUrl: images[0],
      images,
      ownerName: ownerName.trim(),
      ownerPhone: ownerPhone.trim(),
      ownerEmail: ownerEmail.trim(),
      verified: false,
    }

    onSubmit(newProperty)
  }

  return (
    <main className="owner-page">
      <div className="owner-page-header">
        <button
          type="button"
          className="owner-back-button"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <span className="overline">PAKHOMO MARKETPLACE</span>

        <h1>List your property</h1>

        <p>
          Share your property with people looking for their
          next home or investment.
        </p>
      </div>

      <form
        className="owner-form"
        onSubmit={handleSubmit}
      >
        <section className="owner-form-section">
          <div className="owner-section-heading">
            <span>01</span>
            <div>
              <h2>Property information</h2>
              <p>Tell us about the property you want to list.</p>
            </div>
          </div>

          <label>
            Property title *
            <input
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="e.g. Modern family house in Lubumbashi"
              required
            />
          </label>

          <label>
            Description *
            <textarea
              value={description}
              onChange={event => setDescription(event.target.value)}
              placeholder="Describe the property, its condition and important features..."
              rows={5}
              required
            />
          </label>

          <div className="owner-form-grid">
            <label>
              Property type *
              <select
                value={type}
                onChange={event =>
                  setType(event.target.value as PropertyKind)
                }
              >
                {propertyTypes.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Listing purpose *
              <select
                value={listingType}
                onChange={event =>
                  setListingType(event.target.value as ListingType)
                }
              >
                <option value="Rent">For rent</option>
                <option value="Sale">For sale</option>
              </select>
            </label>
          </div>
        </section>

        <section className="owner-form-section">
          <div className="owner-section-heading">
            <span>02</span>
            <div>
              <h2>Property location</h2>
              <p>Help interested people find your property.</p>
            </div>
          </div>

          <div className="owner-form-grid">
            <label>
              Country *
              <select
                value={countryCode}
                onChange={event =>
                  setCountryCode(event.target.value as CountryCode)
                }
              >
                <option value="CD">
                  Democratic Republic of Congo
                </option>
                <option value="MW">Malawi</option>
              </select>
            </label>

            <label>
              City *
              <input
                value={city}
                onChange={event => setCity(event.target.value)}
                placeholder="e.g. Lubumbashi"
                required
              />
            </label>
          </div>

          <label>
            Neighbourhood / Area *
            <input
              value={area}
              onChange={event => setArea(event.target.value)}
              placeholder="e.g. Golf, Gombe, Kolwezi Centre..."
              required
            />
          </label>

          <div className="owner-location-hint">
            <MapPin size={16} />
            Make sure the location information is accurate.
          </div>
        </section>

        <section className="owner-form-section">
          <div className="owner-section-heading">
            <span>03</span>
            <div>
              <h2>Price and property details</h2>
              <p>Provide the price and available specifications.</p>
            </div>
          </div>

          <div className="owner-form-grid">
            <label>
              Price *
              <input
                type="number"
                min="1"
                value={price}
                onChange={event => setPrice(event.target.value)}
                placeholder="Enter amount"
                required
              />
            </label>

            <label>
              Currency *
              <select
                value={currency}
                onChange={event =>
                  setCurrency(
                    event.target.value as Property['currency']
                  )
                }
              >
                <option value="USD">USD</option>
                <option value="CDF">CDF</option>
                <option value="MWK">MWK</option>
              </select>
            </label>
          </div>

          <div className="owner-form-grid owner-form-grid-three">
            <label>
              Bedrooms
              <input
                type="number"
                min="0"
                value={bedrooms}
                onChange={event => setBedrooms(event.target.value)}
                placeholder="e.g. 3"
              />
            </label>

            <label>
              Bathrooms
              <input
                type="number"
                min="0"
                value={bathrooms}
                onChange={event => setBathrooms(event.target.value)}
                placeholder="e.g. 2"
              />
            </label>

            <label>
              Size (m²)
              <input
                type="number"
                min="0"
                value={size}
                onChange={event => setSize(event.target.value)}
                placeholder="e.g. 250"
              />
            </label>
          </div>
        </section>

        <section className="owner-form-section">
          <div className="owner-section-heading">
            <span>04</span>
            <div>
              <h2>Property photos</h2>
              <p>
                Upload up to 5 clear photos. Maximum 2 MB per photo.
              </p>
            </div>
          </div>

          <div className="owner-upload-area">
            <input
              id="property-images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
            />

            <label htmlFor="property-images">
              <ImagePlus size={28} />
              <strong>Upload property photos</strong>
              <span>Choose images from your phone</span>
            </label>
          </div>

          {images.length > 0 && (
            <div className="owner-image-previews">
              {images.map((image, index) => (
                <div
                  className="owner-image-preview"
                  key={`${index}-${image.slice(0, 30)}`}
                >
                  <img src={image} alt={`Property ${index + 1}`} />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>

                  {index === 0 && (
                    <span>Main photo</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="owner-location-hint">
            <Camera size={16} />
            The first photo will be used as the main property image.
          </div>
        </section>

        <section className="owner-form-section">
          <div className="owner-section-heading">
            <span>05</span>
            <div>
              <h2>Owner contact information</h2>
              <p>How can interested people contact you?</p>
            </div>
          </div>

          <label>
            Full name *
            <input
              value={ownerName}
              onChange={event => setOwnerName(event.target.value)}
              placeholder="Your full name"
              required
            />
          </label>

          <label>
            Phone number *
            <input
              type="tel"
              value={ownerPhone}
              onChange={event => setOwnerPhone(event.target.value)}
              placeholder="+243..."
              required
            />
          </label>

          <label>
            Email address
            <input
              type="email"
              value={ownerEmail}
              onChange={event => setOwnerEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
        </section>

        {error && (
          <div className="owner-form-error" role="alert">
            {error}
          </div>
        )}

        <div className="owner-submit-area">
          <p>
            Your listing will be reviewed by the Pakhomo admin
            before appearing publicly.
          </p>

          <button
            type="submit"
            className="owner-submit-button"
          >
            Submit property
            <Send size={17} />
          </button>
        </div>
      </form>
    </main>
  )
}
