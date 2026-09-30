import PageHeader from "@/components/admin/PageHeader";
import BookingRequest from "@/components/host/BookingRequest";
import { getAllRequestsPerHost } from "@/lib/actions/hosts";
import { Suspense } from "react";

async function BookingList() {
  const requests = await getAllRequestsPerHost();

  return <BookingRequest requests={requests} />;
}

export default function BookingListPage() {
  return (
    <main className="min-h-screen bg-[#17110C] px-6 pb-16 pt-28 md:px-10">
      <PageHeader
        eyebrow="Host"
        title="Booking requests management"
        description="Review new booking requests and decide which one to accept to confirm his booking"
      />
      <Suspense fallback={<p>Fetching Requests...</p>}>
        <BookingList />
      </Suspense>
    </main>
  );
}