const STYLES = {
  pending: "bg-[#CA6200]/15 text-[#CA6200]",
  approved: "bg-emerald-400/10 text-emerald-300",
  rejected: "bg-red-400/10 text-red-400",
  active: "bg-emerald-400/10 text-emerald-300",
  suspended: "bg-red-400/10 text-red-400",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        STYLES[status] ?? "bg-[#FBDFC5]/10 text-[#FBDFC5]/70"
      }`}
    >
      {status}
    </span>
  );
}
