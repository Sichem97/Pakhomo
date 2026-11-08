
import { ArrowRight } from 'lucide-react'

interface OwnerInvitationProps {
  t: Record<string, string>
  onListProperty: () => void
}

export default function OwnerInvitation({
  t,
  onListProperty,
}: OwnerInvitationProps) {
  return (
    <section className="owner-cta" id="list-property">
      <div>
        <span className="overline">{t.haveProperty}</span>

        <h2>{t.ownerTitle}</h2>

        <p>{t.ownerDescription}</p>
      </div>

      <button onClick={onListProperty}>
        {t.registerInterest}
        <ArrowRight size={16} />
      </button>
    </section>
  )
}
