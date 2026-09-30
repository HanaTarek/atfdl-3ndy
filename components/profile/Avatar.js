export default function Avatar({ url, name, size = 96 }) {
  const initial = (name?.trim()?.[0] || "?").toUpperCase();

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name || "Profile photo"}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className="flex items-center justify-center rounded-full bg-[#CA6200] font-bold text-[#FBDFC5]"
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {initial}
    </span>
  );
}
