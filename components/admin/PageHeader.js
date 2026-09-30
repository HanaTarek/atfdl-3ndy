export default function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-[2.5px] text-[#CA6200]">
        {eyebrow}
      </span>
      <h1 className="text-3xl font-semibold text-[#FBDFC5] md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-xl text-sm text-[#FBDFC5]/60 mb-6">{description}</p>
      )}
    </div>
  );
}
