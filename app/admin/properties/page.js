import PageHeader from "@/components/admin/PageHeader";
import PropertyManagement from "@/components/admin/PropertyManagement";
import { getAllPropertiesAdmin } from "@/lib/actions/admin";
import { Suspense } from "react";

async function AdminProperties() {

    const properties = await getAllPropertiesAdmin();

    return <PropertyManagement properties={properties} />;
    
}

export default function AdminPropertiesPage() {
  return (
    <div className="flex flex-col gap-8">

      <PageHeader
        eyebrow="Admin"
        title="Property management"
        description="Review new listings and decide which ones go live."
      />
    <Suspense
    fallback={<p >Fetching Properties...</p>}
    >
    <AdminProperties />
    </Suspense>

    </div>
  );
}
