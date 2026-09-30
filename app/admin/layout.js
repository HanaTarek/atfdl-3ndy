import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }) {
  return (
    <main className="min-h-screen bg-[#17110C] px-6 pb-24 pt-28 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <AdminNav />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
