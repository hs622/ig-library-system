import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const databaseName = process.env.DATABASE_NAME;

if (!uri || !databaseName) {
  throw new Error("MONGODB_URI and DATABASE_NAME must be configured.");
}

const seedDataPath = fileURLToPath(new URL("./rp-seed-data.json", import.meta.url));
const { roles } = JSON.parse(await readFile(seedDataPath, "utf8"));
const client = new MongoClient(uri);

try {
  await client.connect();

  const database = client.db(databaseName);
  const roleCollection = database.collection("roles");
  const permissionCollection = database.collection("permissions");
  const now = new Date();

  await roleCollection.createIndex({ slug: 1 }, { unique: true });

  await roleCollection.bulkWrite(
    roles.map(({ title, slug, level }) => ({
      updateOne: {
        filter: { slug },
        update: {
          $set: { title, level, updatedAt: now, deletedAt: null },
          $setOnInsert: { slug, createdAt: now },
        },
        upsert: true,
      },
    })),
  );

  const seededRoles = await roleCollection
    .find({ slug: { $in: roles.map(({ slug }) => slug) } })
    .toArray();
  const roleIds = new Map(seededRoles.map(({ slug, _id }) => [slug, _id]));
  const permissionSeedsByKey = new Map();

  for (const role of roles) {
    const roleId = roleIds.get(role.slug);
    if (!roleId) throw new Error(`Could not resolve seeded role "${role.slug}".`);

    for (const [module, actions] of Object.entries(role.permissions)) {
      for (const action of actions) {
        const key = `${module}:${action}`;
        const permission = permissionSeedsByKey.get(key) ?? {
          title: `${action[0].toUpperCase()}${action.slice(1)} ${module}`,
          module,
          action,
          role_ids: [],
        };
        permission.role_ids.push(roleId);
        permissionSeedsByKey.set(key, permission);
      }
    }
  }

  const permissionSeeds = [...permissionSeedsByKey.values()];
  const legacyPermissionKeys = roles.flatMap((role) =>
    Object.entries(role.permissions).flatMap(([module, actions]) =>
      actions.map((action) => ({
        role_id: roleIds.get(role.slug),
        module,
        action,
      })),
    ),
  );

  if (legacyPermissionKeys.length) {
    await permissionCollection.deleteMany({ $or: legacyPermissionKeys });
  }

  const permissionsCollectionExists = await database
    .listCollections({ name: "permissions" }, { nameOnly: true })
    .hasNext();
  if (permissionsCollectionExists) {
    const indexes = await permissionCollection.listIndexes().toArray();
    if (indexes.some(({ name }) => name === "role_id_1_module_1_action_1")) {
      await permissionCollection.dropIndex("role_id_1_module_1_action_1");
    }
  }

  await permissionCollection.createIndex(
    { module: 1, action: 1 },
    { unique: true },
  );

  await permissionCollection.bulkWrite(
    permissionSeeds.map(({ title, module, action, role_ids }) => ({
      updateOne: {
        filter: { module, action },
        update: {
          $set: {
            title,
            role_ids,
            status: true,
            associatedUserCount: 1,
            description: `${title} permission.`,
            updatedAt: now,
            deletedAt: null,
          },
          $setOnInsert: { createdAt: now },
        },
        upsert: true,
      },
    })),
  );

  console.info(
    `Seeded ${roles.length} roles and ${permissionSeeds.length} shared permissions in "${databaseName}".`,
  );
} finally {
  await client.close();
}
