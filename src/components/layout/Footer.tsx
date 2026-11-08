
interface FooterProps {
  t: {
    footerDescription: string
    discover: string
    howItWorks: string
    listProperty: string
  }
}

export default function Footer({ t }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <a className="brand" href="#">
            <span className="brand-mark">⌂</span>
            <span>
              habitat<span className="brand-light">africa</span>
            </span>
          </a>

          <p>{t.footerDescription}</p>
        </div>

        <div className="footer-links">
          <a href="#discover">{t.discover}</a>
          <a href="#how">{t.howItWorks}</a>
          <a href="#list-property">{t.listProperty}</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Habitat Africa.
          All rights reserved.
        </span>

        <span>Connecting people with places across Africa.</span>
      </div>
    </footer>
  )
}
