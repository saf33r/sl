import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Button asChild>
        <Link href="/users">Users</Link>
      </Button>
    </main>
  );
}
