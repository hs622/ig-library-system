import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <section className="max-w-lg rounded-lg border p-4">
        <dl className="grid gap-4">
          <div>
            <dt className="text-sm text-muted-foreground">Name</dt>
            <dd>{user?.name || "Not available"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Username</dt>
            <dd>{user?.username || "Not available"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Role</dt>
            <dd>{user?.role || "Not available"}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
