//import './PropertyDetailsPage.css'
import { useState } from 'react'


import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Bath,
  MapPin,
  Maximize,
  Phone,
  Mail,
  Home,
} from 'lucide-react'

import type { Property } from '../types'

interface PropertyDetailsPageProps {
  property: Property
  onBack: () => void
}

function formatPrice(property: Property) {
  const amount = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(property.price)

  return `${amount} ${property.currency}`
}

export default function PropertyDetailsPage({
  property,
  onBack,
}: PropertyDetailsPageProps) {
  const images = property.images?.length
    ? property.images
    : [property.imageUrl]

  const [activeImage, setActiveImage] = useState(0)

  function previousImage() {
    setActiveImage(current =>
      current === 0 ? images.length - 1 : current - 1
    )
  }

  function nextImage() {
    setActiveImage(current =>
      (current + 1) % images.length
    )
  }

  return (
    <main className="property-details-page">
      <div className="details-container">

        <button
          type="button"
          className="details-back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Back to properties
        </button>

        <section className="details-gallery">
          <div className="details-main-image">
            <img
              src={images[activeImage]}
              alt={property.title}
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-arrow gallery-previous"
                  onClick={previousImage}
                  aria-label="Previous image"
                >
                  <ArrowLeft size={20} />
                </button>

                <button
                  type="button"
                  className="gallery-arrow gallery-next"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ArrowRight size={20} />
                </button>

                <span className="gallery-counter">
                  {activeImage + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="details-thumbnails">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={index}
                  className={
                    activeImage === index
                      ? 'details-thumbnail active'
                      : 'details-thumbnail'
                  }
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="details-content">

          <section className="details-main-content">
            <div className="details-labels">
              <span className="details-type">
                {property.listingType === 'Rent'
                  ? 'For rent'
                  : 'For sale'}
              </span>

              {property.verified && (
                <span className="details-verified">
                  <BadgeCheck size={15} />
                  Verified property
                </span>
              )}
            </div>

            <h1>{property.title}</h1>

            <p className="details-location">
              <MapPin size={17} />
              {property.area}, {property.city}
              {property.countryCode === 'CD'
                ? ', DR Congo'
                : ', Malawi'}
            </p>

            <div className="details-price">
              <strong>{formatPrice(property)}</strong>
              {property.listingType === 'Rent' && (
                <span>/ month</span>
              )}
            </div>

            <div className="details-divider" />

            <h2>Property overview</h2>

            <div className="details-specifications">
              <div>
                <Home size={19} />
                <span>Property type</span>
                <strong>{property.type}</strong>
              </div>

              {property.bedrooms !== undefined && (
                <div>
                  <BedDouble size={19} />
                  <span>Bedrooms</span>
                  <strong>{property.bedrooms}</strong>
                </div>
              )}

              {property.bathrooms !== undefined && (
                <div>
                  <Bath size={19} />
                  <span>Bathrooms</span>
                  <strong>{property.bathrooms}</strong>
                </div>
              )}

              {property.size !== undefined && (
                <div>
                  <Maximize size={19} />
                  <span>Size</span>
                  <strong>{property.size} m²</strong>
                </div>
              )}
            </div>

            <div className="details-divider" />

            <h2>Description</h2>

            <p className="details-description">
              {property.description ||
                'No additional description has been provided.'}
            </p>
          </section>

          <aside className="details-contact-card">
            <h2>Contact property owner</h2>

            <p>
              Interested in this property? Contact the owner
              for more information or to arrange a visit.
            </p>

            {property.ownerName && (
              <div className="details-owner">
                <div className="owner-avatar">
                  {property.ownerName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <strong>{property.ownerName}</strong>
                  <span>Property owner</span>
                </div>
              </div>
            )}

            {property.ownerPhone && (
              <a
                className="details-contact-button"
                href={`tel:${property.ownerPhone}`}
              >
                <Phone size={17} />
                Call owner
              </a>
            )}

            {property.ownerPhone && (
              <a
                className="details-whatsapp-button"
                href={`https://wa.me/${property.ownerPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
              >
                Contact on WhatsApp
              </a>
            )}

            {property.ownerEmail && (
              <a
                className="details-email-link"
                href={`mailto:${property.ownerEmail}`}
              >
                <Mail size={16} />
                {property.ownerEmail}
              </a>
            )}

            {!property.ownerPhone && !property.ownerEmail && (
              <p className="details-no-contact">
                Owner contact information is not available yet.
              </p>
            )}
          </aside>

        </div>
      </div>
    </main>
  )
}
