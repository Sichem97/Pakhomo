
import {
  Search,
  SlidersHorizontal,
  MessageCircle,
  House,
  ArrowRight,
} from 'lucide-react'

interface HowItWorksSectionProps {
  language: 'en' | 'fr'
}

export default function HowItWorksSection({
  language,
}: HowItWorksSectionProps) {
  const isFrench = language === 'fr'

  const steps = [
    {
      icon: Search,
      number: '01',
      title: isFrench ? 'Recherchez' : 'Search',
      description: isFrench
        ? 'Choisissez votre ville, le type de bien et votre budget.'
        : 'Choose your city, property type and preferred budget.',
    },
    {
      icon: SlidersHorizontal,
      number: '02',
      title: isFrench ? 'Explorez' : 'Explore',
      description: isFrench
        ? 'Parcourez les annonces et comparez les biens disponibles.'
        : 'Browse property listings and compare available options.',
    },
    {
      icon: MessageCircle,
      number: '03',
      title: isFrench ? 'Contactez' : 'Connect',
      description: isFrench
        ? 'Prenez contact avec le propriétaire pour obtenir plus de détails.'
        : 'Contact the property owner to learn more about the listing.',
    },
    {
      icon: House,
      number: '04',
      title: isFrench ? 'Trouvez votre bien' : 'Find Your Place',
      description: isFrench
        ? 'Organisez une visite et avancez vers votre prochain logement.'
        : 'Arrange a viewing and take the next step towards your new home.',
    },
  ]

  return (
    <section className="how-it-works-section">
      <div className="how-it-works-container">
        <div className="how-it-works-heading">
          <span className="how-it-works-eyebrow">
            {isFrench ? 'SIMPLE ET RAPIDE' : 'SIMPLE AND EASY'}
          </span>

          <h2>
            {isFrench
              ? 'Comment fonctionne Pakhomo ?'
              : 'How Does Pakhomo Work?'}
          </h2>

          <p>
            {isFrench
              ? 'Quelques étapes simples pour découvrir des opportunités immobilières.'
              : 'Just a few simple steps to discover real estate opportunities.'}
          </p>
        </div>

        <div className="how-it-works-grid">
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <article
                className="how-it-works-card"
                key={step.number}
              >
                <div className="how-it-works-card-top">
                  <div className="how-it-works-icon">
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <span className="how-it-works-number">
                    {step.number}
                  </span>
                </div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>

                {index < steps.length - 1 && (
                  <ArrowRight
                    className="how-it-works-arrow"
                    size={20}
                  />
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}