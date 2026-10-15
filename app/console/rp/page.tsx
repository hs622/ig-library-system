import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RoleActions } from "@/components/rp/role-actions";
import { RPTableHeader } from "@/components/rp/table-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clientPromise from "@/lib/mongodb";
import { ObjectId, type Document } from "mongodb";

export const dynamic = "force-dynamic";

interface RoleDocument extends Document {
  title: string;
  slug: string;
  level: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface PermissionDocument extends Document {
  title: string;
  role_ids?: ObjectId[];
  role_id?: ObjectId;
  module: string;
  action: "create" | "edit" | "delete" | "view";
  status: boolean;
  associatedUserCount: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const activeRecordFilter = {
  $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
};

function formatDate(date: Date | undefined) {
  return date ? date.toLocaleDateString() : "—";
}

export default async function RolesPermissionsPage() {
  const client = await clientPromise;
  const database = client.db(process.env.DATABASE_NAME);

  const [roles, permissions, userCountsByRole] = await Promise.all([
    database
      .collection<RoleDocument>("roles")
      .find(activeRecordFilter)
      .sort({ level: -1, title: 1 })
      .toArray(),
    database
      .collection<PermissionDocument>("permissions")
      .find(activeRecordFilter)
      .sort({ module: 1, action: 1 })
      .toArray(),
    database
      .collection("users")
      .aggregate<{ _id: string; count: number }>([
        { $match: { role: { $type: "string" } } },
        { $group: { _id: "$role", count: { $sum: 1 } } },
      ])
      .toArray(),
  ]);

  const roleTitles = new Map(roles.map((role) => [role._id.toString(), role.title]));
  const rolePermissionCounts = new Map(roles.map((role) => [role._id.toString(), 0]));
  for (const permission of permissions) {
    for (const roleId of permission.role_ids ?? (permission.role_id ? [permission.role_id] : [])) {
      const roleIdString = roleId.toString();
      rolePermissionCounts.set(roleIdString, (rolePermissionCounts.get(roleIdString) ?? 0) + 1);
    }
  }
  const roleUserCounts = new Map(userCountsByRole.map(({ _id, count }) => [_id, count]));
  const rolePermissionRelationships = permissions.flatMap((permission) =>
    (permission.role_ids ?? (permission.role_id ? [permission.role_id] : [])).map((roleId) => ({
      key: `${roleId.toString()}-${permission._id.toString()}`,
      roleTitle: roleTitles.get(roleId.toString()) ?? "Unknown role",
      permission,
    })),
  );

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 gap-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Roles &amp; Permissions</h1>
          <p className="text-sm text-muted-foreground">
            Review the roles and permissions configured for the library system.
          </p>
        </div>

        <RPTableHeader />
      </header>

      <RoleActions
        permissions={permissions.map((permission) => ({
          id: permission._id.toString(),
          title: permission.title,
          module: permission.module,
          action: permission.action,
        }))}
      />

      <div className="grid min-h-0 grid-cols-1 xl:grid-cols-12 gap-4">
        <Card className="m-0! min-w-0 gap-0 p-0! xl:col-span-6">
          <CardContent className="min-w-0 overflow-x-auto p-0!">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.length ? (
                  roles.map((role) => (
                    <TableRow key={role._id.toString()}>
                      <TableCell className="font-medium">{role.title}</TableCell>
                      <TableCell>{role.slug}</TableCell>
                      <TableCell>{role.level}</TableCell>
                      <TableCell>{rolePermissionCounts.get(role._id.toString()) ?? 0}</TableCell>
                      <TableCell>{roleUserCounts.get(role.slug) ?? 0}</TableCell>
                      <TableCell>{formatDate(role.createdAt)}</TableCell>
                      <TableCell>{formatDate(role.updatedAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No roles found. Run <code>pnpm seed:rp</code> to seed roles.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="m-0! min-w-0 gap-0 p-0! xl:col-span-6">
          <CardContent className="min-w-0 overflow-x-auto p-0!">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead>Permission</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Roles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.length ? (
                  permissions.map((permission) => (
                    <TableRow key={permission._id.toString()}>
                      <TableCell className="font-medium">{permission.title}</TableCell>
                      <TableCell className="capitalize">{permission.module}</TableCell>
                      <TableCell className="capitalize">{permission.action}</TableCell>
                      <TableCell>
                        <Badge variant={permission.status ? "default" : "secondary"}>
                          {permission.status ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {(permission.role_ids ?? (permission.role_id ? [permission.role_id] : [])).length}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No permissions found. Run <code>pnpm seed:rp</code> to seed permissions.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="m-0! min-w-0 gap-0 p-0! xl:col-span-12">
          <CardContent className="min-w-0 overflow-x-auto p-0!">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Permission</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Associated users</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rolePermissionRelationships.length ? (
                  rolePermissionRelationships.map(({ key, roleTitle, permission }) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{roleTitle}</TableCell>
                      <TableCell>{permission.title}</TableCell>
                      <TableCell className="capitalize">{permission.module}</TableCell>
                      <TableCell className="capitalize">{permission.action}</TableCell>
                      <TableCell>{permission.associatedUserCount}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No role-permission relationships found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
