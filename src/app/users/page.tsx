import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

import UserList from "@/app/users/user-list";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "Users Page",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function UsersPage() {
  return (
    <div className="container mx-auto py-3" suppressHydrationWarning>
      <Suspense
        fallback={
          <div className="flex h-10 items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </div>
        }
      >
        <UserList />
      </Suspense>
    </div>
  );
}
