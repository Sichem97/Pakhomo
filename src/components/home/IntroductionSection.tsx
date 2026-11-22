
interface IntroductionSectionProps {
  language: 'en' | 'fr'
}

export default function IntroductionSection({
  language,
}: IntroductionSectionProps) {
  const isFrench = language === 'fr'

  return (
    <section className="introduction-section">
      <div className="introduction-content">
        <span className="overline">
          {isFrench ? 'BIENVENUE CHEZ PAKHOMO' : 'WELCOME TO PAKHOMO'}
        </span>

        <h2>
          {isFrench
            ? 'Votre prochain chez-vous commence ici.'
            : 'Your next home begins here.'}
        </h2>

        <p>
          {isFrench
            ? 'Pakhomo est votre passerelle vers l’immobilier en Afrique. Que vous souhaitiez louer, acheter ou publier un bien, nous facilitons la découverte de nouvelles opportunités, la mise en relation avec les propriétaires et la recherche d’un endroit à appeler chez soi.'
            : 'Pakhomo is your gateway to real estate across Africa. Whether you want to rent, buy, or list a property, we make it easier to discover opportunities, connect with property owners, and find a place to call home.'}
        </p>

        <div className="introduction-decoration">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  )
}
