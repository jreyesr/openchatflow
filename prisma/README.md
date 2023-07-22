# Migrations

OpenChatflow uses [Prisma](https://prisma.io) as an ORM/DB access library.

## Commands

To generate a new migration:

1. Make changes in the `schema.prisma` file
1. Open a CLI session, `cd prisma`
1. `yarn prisma migrate dev --name my_migration_name`
1. Verify that a file has been created in the `migrations/` folder
1. Check the contents of the new migration, it should reflect the changes that you made to the `schema.prisma` file

This command will also aply the migration to the test database, so there's no need for a separate apply step.

To apply the migration:

`yarn prisma migrate deploy`

This is already configured to be done on deployment of the project to Vercel, so there shoould be no need to run it manually.
