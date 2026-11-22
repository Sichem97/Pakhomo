
import {
  ShieldCheck,
  Search,
  Globe2,
  Handshake,
  ArrowRight,
} from 'lucide-react'

interface WhyChooseSectionProps {
  language: 'en' | 'fr'
}

export default function WhyChooseSection({
  language,
}: WhyChooseSectionProps) {
  const isFrench = language === 'fr'

  const benefits = [
    {
      icon: ShieldCheck,
      title: isFrench ? 'Annonces examinées' : 'Reviewed Listings',
      description: isFrench
        ? 'Chaque annonce est soumise à un processus de vérification avant sa publication.'
        : 'Every submitted listing goes through an approval process before publication.',
    },
    {
      icon: Search,
      title: isFrench ? 'Recherche simplifiée' : 'Easy Property Search',
      description: isFrench
        ? 'Trouvez des maisons, appartements, terrains et locaux selon vos besoins.'
        : 'Find houses, apartments, land and commercial spaces that match your needs.',
    },
    {
      icon: Globe2,
      title: isFrench ? 'Présence régionale' : 'Regional Reach',
      description: isFrench
        ? 'Explorez les opportunités immobilières au Malawi et en République démocratique du Congo.'
        : 'Explore real estate opportunities in Malawi and the Democratic Republic of Congo.',
    },
    {
      icon: Handshake,
      title: isFrench ? 'Mise en relation' : 'Direct Connections',
      description: isFrench
        ? 'Facilitez les échanges entre les personnes à la recherche d’un bien et les propriétaires.'
        : 'Make it easier for property seekers and owners to connect.',
    },
  ]

  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        <div className="why-choose-intro">
          <span className="why-choose-eyebrow">
            {isFrench ? 'POURQUOI PAKHOMO ?' : 'WHY PAKHOMO?'}
          </span>

          <h2>
            {isFrench
              ? 'Une meilleure façon de trouver votre prochain chez-vous.'
              : 'A better way to find your next place to call home.'}
          </h2>

          <p>
            {isFrench
              ? 'Nous rendons la recherche et la publication immobilières plus simples, plus accessibles et plus transparentes.'
              : 'We make discovering and listing properties simpler, more accessible and more transparent.'}
          </p>

          <a href="#discover" className="why-choose-link">
            {isFrench ? 'Explorer les propriétés' : 'Explore properties'}
            <ArrowRight size={17} />
          </a>
        </div>

        <div className="why-choose-grid">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon

            return (
              <article
                className="why-choose-card"
                key={benefit.title}
              >
                <div className="why-choose-icon">
                  <Icon size={25} strokeWidth={1.7} />
                </div>

                <span className="why-choose-number">
                  0{index + 1}
                </span>

                <h3>{benefit.title}</h3>

                <p>{benefit.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
