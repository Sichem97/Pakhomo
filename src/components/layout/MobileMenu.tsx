
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  t: {
    discover: string
    howItWorks: string
    listProperty: string
  }
}

export default function MobileMenu({
  isOpen,
  onClose,
  t,
}: MobileMenuProps) {
  return (
    <nav className={isOpen ? 'nav nav-open' : 'nav'}>
      <a href="#discover" onClick={onClose}>
        {t.discover}
      </a>

      <a href="#trending" onClick={onClose}>
        Trending
      </a>

      <a href="#how" onClick={onClose}>
        {t.howItWorks}
      </a>

      <a href="#list-property" onClick={onClose}>
        {t.listProperty}
      </a>
    </nav>
  )
}
