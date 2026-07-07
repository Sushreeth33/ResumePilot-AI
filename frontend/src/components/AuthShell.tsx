import type { ReactNode } from 'react';

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              ResumePilot AI
            </p>
            <h1 className="mt-8 max-w-md text-5xl font-semibold leading-tight">
              Sharpen your resume before the interview starts.
            </h1>
          </div>
          <div className="grid gap-4 text-sm text-slate-300">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              ATS-focused resume review for software engineering roles.
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              Built for students who want clear, actionable preparation.
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
                ResumePilot AI
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
