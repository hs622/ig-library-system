# Library System

## Authentication

Authentication uses the NextAuth.js Credentials provider at `/api/auth/*` and
the sign-in page at `/login`. It looks up credentials in the MongoDB
`authUsers` collection; library member records in `users` are not used for
authentication.

Configure `MONGODB_URI`, `DATABASE_NAME`, and `NEXTAUTH_SECRET` in the
environment. Set `NEXTAUTH_URL` to the canonical application URL when
deploying.

Each `authUsers` document must contain a unique `username` and a bcrypt-hashed
`passwordHash`. Store usernames with a unique MongoDB index:

```js
db.authUsers.createIndex({ username: 1 }, { unique: true });
```

Passwords are stored only as bcrypt hashes and checked with bcrypt; database
lookups use the username, not the plaintext password. Create accounts through
a trusted administrative process; this module does not provide public
registration.

## Roles and permissions

The `/console/rp` page lists active records from the `roles` and `permissions`
MongoDB collections. Seed the essential role and permission records with:

```sh
pnpm seed:rp
```

Each permission is stored once with a `role_ids` array of ObjectId references
to its associated roles. The command reads `MONGODB_URI` and `DATABASE_NAME`
from the environment (and loads `.env.local` when present). It is safe to run
more than once: roles are matched by `slug`, and permissions by `module` and
`action`. On the first run after upgrading from the old role-specific format,
it removes the old seeded permission records and replaces them with shared
permission records.
Permission actions are `create`, `edit`, `delete`, and `view`; modules are
`users`, `roles`, `permissions`, `payments`, `subscriptions`, `books`, and
`categories`.