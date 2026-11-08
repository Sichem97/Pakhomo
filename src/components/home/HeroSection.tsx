
import {
  ArrowRight,
  Sparkles,
} from 'lucide-react'

interface HeroSectionProps {
  t: Record<string, string>
}

export default function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="hero">
      <div className="hero-image" />
      <div className="hero-shade" />

      <div className="hero-content">
        <div className="eyebrow">
          <Sparkles size={15} />
          {t.nextChapter}
        </div>

        <h1>
          {t.heroTitle}
          <br />
          <em>{t.heroTitleEmphasis}</em>
        </h1>

        <p>{t.heroDescription}</p>

        <a className="hero-link" href="#discover">
          {t.exploreProperties}
          <ArrowRight size={17} />
        </a>
      </div>

      <div className="hero-note">
        <span className="note-dot" />
        {t.localTrusted}
      </div>
    </section>
  )
}
