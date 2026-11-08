
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Compass,
} from 'lucide-react'

interface TrustSectionProps {
  t: Record<string, string>
}

export default function TrustSection({ t }: TrustSectionProps) {
  return (
    <section className="trust-section" id="how">
      <div className="trust-copy">
        <span className="overline">{t.peaceOfMind}</span>

        <h2>{t.confidenceTitle}</h2>

        <p>{t.confidenceDescription}</p>

        <a href="#verification">
          {t.verificationWorks}
          <ArrowRight size={15} />
        </a>
      </div>

      <div className="trust-features">
        <article>
          <span>
            <BadgeCheck size={21} />
          </span>

          <div>
            <h3>{t.reviewedOwners}</h3>
            <p>{t.reviewedOwnersDescription}</p>
          </div>
        </article>

        <article>
          <span>
            <Compass size={21} />
          </span>

          <div>
            <h3>{t.localDiscovery}</h3>
            <p>{t.localDiscoveryDescription}</p>
          </div>
        </article>

        <article>
          <span>
            <BedDouble size={21} />
          </span>

          <div>
            <h3>{t.madeForLife}</h3>
            <p>{t.madeForLifeDescription}</p>
          </div>
        </article>
      </div>
    </section>
  )
}
