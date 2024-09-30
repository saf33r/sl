"use client";

import { z } from "zod";
import { userIdSchema } from "@/app/users/create/zod";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import DeleteButton from "@/app/users/delete-user";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

export default function UserDetail({
  id,
}: {
  id: z.infer<typeof userIdSchema>;
}) {
  const router = useRouter();

  const [user] = api.user.one.useSuspenseQuery({
    id: id,
  });

  const formatDate = (date: Date) => {
    return String(new Date(date));
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/users">Users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{user?.name ?? "Profile"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {user ? (
        <>
          <div className="my-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <DeleteButton id={id} onSuccess={() => router.push("/users")} />
          </div>
          <div className="my-3 rounded-md border">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created
                  </TableCell>
                  <TableCell>
                    <span suppressHydrationWarning>
                      {formatDate(user.createdAt)}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Updated
                  </TableCell>
                  <TableCell>
                    <span suppressHydrationWarning>
                      {user.updatedAt ? formatDate(user.updatedAt) : "-"}
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">User not found</h1>
          <Button type="button" className="my-3" asChild>
            <Link href="/users">Back to Users</Link>
          </Button>
        </>
      )}
    </>
  );
}
