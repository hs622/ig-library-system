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