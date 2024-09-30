"use client";

import { parseAsInteger, useQueryState } from "nuqs";
import { api } from "@/trpc/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/app/users/data-table";
import DeleteUser from "@/app/users/delete-user";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type User = {
  id: number;
  name: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export default function UsersList() {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            <Button type="button" size="sm" variant="outline" asChild>
              <Link href={`/users/${row.original.id}`}>View</Link>
            </Button>
            <DeleteUser
              id={row.original.id}
              onSuccess={() => usersQuery.refetch()}
            />
          </div>
        );
      },
    },
  ];

  const [pageIndex, setPageIndex] = useQueryState(
    "offset",
    parseAsInteger.withDefault(0),
  );

  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger.withDefault(1),
  );

  const [data, usersQuery] = api.user.all.useSuspenseQuery(
    {
      pageIndex,
      pageSize,
    },
    {
      refetchOnMount: "always",
    },
  );

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="my-3 flex justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button asChild>
          <Link href="/users/create">Add</Link>
        </Button>
      </div>
      <div className="my-3">
        <DataTable
          columns={columns}
          data={data.rows}
          pagination={{
            pageIndex,
            pageSize,
          }}
          setPagination={(paginationChanges) => {
            void setPageIndex(paginationChanges.pageIndex);
            void setPageSize(paginationChanges.pageSize);
          }}
          rowCount={data.total}
        />
      </div>
    </>
  );
}
