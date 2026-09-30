export default function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-[1.5rem] bg-[#1f1710] p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold text-[#FBDFC5]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[#FBDFC5]/40">{hint}</p>}
    </div>
  );
}
