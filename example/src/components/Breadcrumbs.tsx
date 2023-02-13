import { useMatches } from 'react-router-dom'

export function Breadcrumbs() {
  const matches = useMatches()

  const crumbs: Array<string> = matches
    .filter((match) => Boolean((match.handle as any)?.crumb))
    .map((match) => (match.handle as any)?.crumb(match.params))

  return (
    <nav>
      <ol className="flex space-x-2 text-gray-600 text-sm">
        {crumbs.map((crumb, index) => (
          <>
            <li key={index}>{crumb}</li>
            {index < crumbs.length - 1 && <li className="text-gray-300">/</li>}
          </>
        ))}
      </ol>
    </nav>
  )
}
