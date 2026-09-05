/**
 * Régua horizontal. Com `label`, o rótulo aparece centralizado em caixa alta —
 * é o "Leia também" do kit de blog.
 */
export function Separator({ label, className = '' }: { label?: string; className?: string }) {
  if (!label) {
    return <hr className={`border-0 border-t border-neutral-200 ${className}`} />
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="h-px flex-1 bg-neutral-200" />
      <span className="text-xs font-medium tracking-[0.18em] text-neutral-500 uppercase">
        {label}
      </span>
      <span className="h-px flex-1 bg-neutral-200" />
    </div>
  )
}
