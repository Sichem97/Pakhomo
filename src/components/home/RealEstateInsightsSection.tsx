
import { ArrowRight, BookOpen } from 'lucide-react'

interface RealEstateInsightsSectionProps {
  language: 'en' | 'fr'
}

export default function RealEstateInsightsSection({
  language,
}: RealEstateInsightsSectionProps) {
  const isFrench = language === 'fr'

  const articles = [
    {
      category: isFrench ? 'ACHAT IMMOBILIER' : 'PROPERTY BUYING',
      title: isFrench
        ? 'Acheter son premier logement'
        : 'Buying Your First Home',
      description: isFrench
        ? 'Les éléments essentiels à vérifier avant de choisir et d’acheter votre premier logement.'
        : 'Essential things to consider before choosing and purchasing your first home.',
      image:
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=85',
      readTime: isFrench ? '5 min de lecture' : '5 min read',
    },
    {
      category: isFrench ? 'LOCATION' : 'RENTING',
      title: isFrench
        ? 'Comprendre un contrat de location'
        : 'Understanding Rental Agreements',
      description: isFrench
        ? 'Découvrez les clauses importantes à examiner avant de signer un contrat de location.'
        : 'Learn about the important clauses to review before signing a rental agreement.',
      image:
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85',
      readTime: isFrench ? '4 min de lecture' : '4 min read',
    },
    {
      category: isFrench ? 'INVESTISSEMENT' : 'INVESTMENT',
      title: isFrench
        ? 'Conseils pour investir dans l’immobilier'
        : 'Property Investment Tips',
      description: isFrench
        ? 'Quelques principes pour évaluer un bien et mieux comprendre les opportunités immobilières.'
        : 'Practical principles for evaluating properties and understanding real estate opportunities.',
      image:
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=85',
      readTime: isFrench ? '6 min de lecture' : '6 min read',
    },
  ]

  return (
    <section className="real-estate-insights-section">
      <div className="real-estate-insights-container">
        <div className="real-estate-insights-heading">
          <div>
            <span className="real-estate-insights-eyebrow">
              <BookOpen size={15} />
              {isFrench ? 'CONSEILS ET ACTUALITÉS' : 'KNOWLEDGE & INSIGHTS'}
            </span>

            <h2>
              {isFrench
                ? 'Mieux comprendre l’immobilier'
                : 'Explore Real Estate Insights'}
            </h2>

            <p>
              {isFrench
                ? 'Des conseils utiles pour vous accompagner dans vos décisions immobilières.'
                : 'Useful guidance to help you make more informed real estate decisions.'}
            </p>
          </div>
        </div>

        <div className="real-estate-insights-grid">
          {articles.map((article, index) => (
            <article
              className="real-estate-insight-card"
              key={article.title}
            >
              <div className="real-estate-insight-image">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                />
                <span className="real-estate-insight-number">
                  0{index + 1}
                </span>
              </div>

              <div className="real-estate-insight-content">
                <div className="real-estate-insight-meta">
                  <span>{article.category}</span>
                  <small>{article.readTime}</small>
                </div>

                <h3>{article.title}</h3>

                <p>{article.description}</p>

                <div className="real-estate-insight-footer">
                  <span>
                    {isFrench ? 'Conseil Pakhomo' : 'Pakhomo Guide'}
                  </span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
