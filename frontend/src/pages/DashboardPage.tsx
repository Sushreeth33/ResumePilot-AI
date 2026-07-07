import { useAuth } from '../hooks/useAuth';

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">
                Welcome, <span className="text-cyan-700">{user?.name}</span>
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Your resume workspace will appear here as the next features are added.
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
