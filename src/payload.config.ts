// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import { Config } from "./payload-types";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Categories } from "./collections/Categories";
import { Products } from "./collections/Products";
import { Tags } from "./collections/Tags";
import { Tenants } from "./collections/Tenants";
import { Orders } from "./collections/Orders";
import { Reviews } from "./collections/Reviews";
import { isSuperAdmin } from "./lib/access";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Tags,
    Tenants,
    Orders,
    Reviews,
  ],
  cookiePrefix: "funred",
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    declare: false,
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin({
      collections: {
        // Temporarily comment out products to test
        products: {
          useTenantAccess: true,
          tenantFieldOverrides: {
            admin: {
              hidden: true,
            },
          },
        },
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
  ],
});
