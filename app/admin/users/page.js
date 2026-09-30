import PageHeader from "@/components/admin/PageHeader";
import UserManagement from "@/components/admin/UserManagement";
import { getAllUsersAdmin } from "@/lib/actions/admin";
import { Suspense } from "react";


async function AdminUsers() {

    const result = await getAllUsersAdmin();
    console.log("resulttt: " , result)

    return <UserManagement users={result.users} />;
}


export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Admin"
        title="User management"
        description="Change roles, suspend accounts, or remove users."
      />
          <Suspense
          fallback={<p >Fetching Users...</p>}
          >
          <AdminUsers />
          </Suspense>
    </div>
  );
}
