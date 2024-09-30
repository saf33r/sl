import { z } from "zod";

import { userIdSchema } from "@/app/users/create/zod";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

import UserDetail from "@/app/users/user-detail";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "User",
  description: "User Page",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function ProfilePage({
  params,
}: {
  params: { id: z.infer<typeof userIdSchema> };
}) {
  const { id } = params;

  return (
    <div className="container mx-auto py-3">
      <Suspense
        fallback={
          <div className="flex h-10 items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </div>
        }
      >
        <UserDetail id={+id} />
      </Suspense>
    </div>
  );
}
