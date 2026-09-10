import { redirect } from "next/navigation";

export default function EmployerJobPage({ params }: { params: { id: string } }) {
  redirect(`/employer/jobs/${params.id}/pipeline`);
}
