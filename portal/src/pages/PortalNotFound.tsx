import { Link } from "react-router-dom";

const PortalNotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">This portal page does not exist.</h1>
        <p className="mt-3 text-slate-400">Return to the NovaPulse Digital dashboard to continue.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3 text-sm font-medium text-indigo-100 transition hover:bg-indigo-500/20"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PortalNotFound;
