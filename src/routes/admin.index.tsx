import { createFileRoute, redirect } from "@tanstack/react-router";
import { isAdminAuthed } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    throw redirect({ to: isAdminAuthed() ? "/admin/dashboard" : "/admin/login" });
  },
});
