import type { FullProfile } from '@/lib/db/schema';

export function ProfileMeta({ user }: { user: FullProfile }) {
  return (
    <section className="space-y-4">
      {user.terms && user.terms.length > 0 && (
        <section className="flex flex-col">
          <h2 className="mb-2 text-lg font-semibold">Term{user.terms.length > 1 ? 's' : ''}</h2>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Terms participated in">
            {[...user.terms].sort().map((term) => (
              <span
                key={term}
                role="listitem"
                className="rounded-md border border-slate-600/50 bg-black/50 px-2.5 py-1 text-sm font-medium text-gray-200 capitalize"
              >
                {term}
              </span>
            ))}
          </div>
        </section>
      )}

      {user.roles && user.roles.length > 0 && (
        <section className="flex flex-col">
          <h2 className="mb-2 text-lg font-semibold">Role{user.roles.length > 1 ? 's' : ''}</h2>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Roles in the project">
            {[...user.roles].sort().map((role) => (
              <span
                key={role}
                role="listitem"
                className="rounded-md border border-slate-600/50 bg-black/50 px-2.5 py-1 text-sm font-medium text-gray-200 capitalize"
              >
                {role}
              </span>
            ))}
          </div>
        </section>
      )}

      {user.teams && user.teams.length > 0 && (
        <section className="flex flex-col">
          <h2 className="mb-2 text-lg font-semibold">Team{user.teams.length > 1 ? 's' : ''}</h2>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Teams participated in">
            {[...user.teams].sort().map((team) => (
              <span
                key={team}
                role="listitem"
                className="rounded-md border border-slate-600/50 bg-black/50 px-2.5 py-1 text-sm font-medium text-gray-200 capitalize"
              >
                {team}
              </span>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
