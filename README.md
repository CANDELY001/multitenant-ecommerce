# 🛍️ Multitenant E-commerce Platform

A modern, scalable multitenant e-commerce platform built with Next.js 15, Payload CMS, and TypeScript. This platform allows multiple vendors to create their own storefronts while sharing a common infrastructure.

## 🌟 Features

### 🏢 Multi-Tenant Architecture

- **Separate vendor storefronts** with custom branding
- **Tenant-specific product catalogs** and inventory
- **Isolated data** between different vendors
- **Super admin dashboard** for platform management

### 🛒 E-commerce Functionality

- **Product management** with rich text descriptions
- **Shopping cart** with persistent state
- **Secure checkout** with Stripe integration
- **Order management** and tracking
- **Digital product delivery** through user library

### 👤 User Management & Authentication

- **JWT-based authentication** with secure cookies
- **Role-based access control** (Super Admin, Vendor, Customer)
- **User library** for purchased digital products
- **Account verification** workflow

### 📱 Modern UI/UX

- **Responsive design** built with Tailwind CSS
- **Component library** using Radix UI primitives
- **Dark/light mode** support
- **Mobile-first** approach
- **Skeleton loading** states

### 🎨 Content Management

- **Payload CMS** for admin dashboard
- **Rich text editor** with Lexical
- **Media management** with Vercel Blob storage
- **Category and tag** organization
- **Product reviews** and ratings

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15.5.2](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Radix UI](https://www.radix-ui.com/)** - Accessible components
- **[Lucide React](https://lucide.dev/)** - Icons

### Backend & Database

- **[Payload CMS 3.54.0](https://payloadcms.com/)** - Headless CMS
- **[MongoDB](https://www.mongodb.com/)** - Database
- **[tRPC](https://trpc.io/)** - Type-safe API layer
- **[Zod](https://zod.dev/)** - Schema validation

### State Management & Data Fetching

- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Client state management
- **[React Hook Form](https://react-hook-form.com/)** - Form management

### Payment & Storage

- **[Stripe](https://stripe.com/)** - Payment processing
- **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** - File storage

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[TypeScript](https://www.typescriptlang.org/)** - Type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- MongoDB database
- Stripe account
- Vercel account (for blob storage)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/CANDELY001/multitenant-ecommerce.git
   cd multitenant-ecommerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URI=mongodb+srv://your-connection-string

   # Payload CMS
   PAYLOAD_SECRET=your-payload-secret-key
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000

   # App Configuration
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
   NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING=false

   # Admin User
   ADMIN_EMAIL=your-admin@email.com
   ADMIN_PASSWORD=your-secure-password

   # Stripe
   STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

   # Storage
   BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (app)/                   # App routes
│   │   ├── (home)/             # Homepage and categories
│   │   ├── (auth)/             # Authentication pages
│   │   ├── (library)/          # User library
│   │   └── checkout/           # Checkout flow
│   └── (payload)/              # Payload CMS routes
│       └── admin/              # Admin dashboard
├── collections/                 # Payload CMS collections
│   ├── Users.ts               # User management
│   ├── Products.ts            # Product catalog
│   ├── Categories.ts          # Product categories
│   ├── Tenants.ts            # Vendor tenants
│   ├── Orders.ts             # Order management
│   └── Reviews.ts            # Product reviews
├── modules/                    # Feature modules
│   ├── auth/                  # Authentication
│   ├── products/              # Product management
│   ├── checkout/              # Shopping cart & checkout
│   ├── library/               # User's purchased products
│   ├── home/                  # Homepage components
│   └── tenants/               # Tenant management
├── components/                 # Shared UI components
├── lib/                       # Utility functions
└── trpc/                      # tRPC setup and routers
```

## 🔧 Key Features Implementation

### Multi-Tenant Plugin Configuration

```typescript
multiTenantPlugin({
  collections: {
    products: { useTenantAccess: true },
    media: { useTenantAccess: true },
  },
  userHasAccessToAllTenants: (user) => isSuperAdmin(user),
});
```

### Type-Safe API with tRPC

```typescript
export const productRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(productFiltersSchema)
    .query(async ({ ctx, input }) => {
      // Type-safe product fetching
    }),
});
```

### Shopping Cart with Zustand

```typescript
export const useCart = (tenantSlug: string) => {
  return useCartStore((state) => ({
    products: state.products[tenantSlug] || [],
    toggleProduct: (productId: string) =>
      state.toggleProduct(tenantSlug, productId),
  }));
};
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Update environment variables** for production:
   ```env
   NEXT_PUBLIC_SERVER_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_ROOT_DOMAIN=your-domain.vercel.app
   NODE_ENV=production
   ```

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

- Database connection string
- Payload secret key
- Stripe keys
- Vercel Blob token
- Admin credentials

## 🧪 Development

### Running Tests

```bash
npm run test
```

### Build for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

## 📝 API Documentation

### tRPC Routers

- **Auth Router**: Authentication and session management
- **Products Router**: Product CRUD operations
- **Categories Router**: Category management
- **Library Router**: User's purchased products
- **Checkout Router**: Cart and order processing

### Payload CMS Collections

- **Users**: User accounts and authentication
- **Products**: Product catalog with rich content
- **Categories**: Hierarchical category structure
- **Tenants**: Vendor storefronts
- **Orders**: Purchase history and tracking
- **Reviews**: Product reviews and ratings
- **Media**: File uploads and management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Open an issue on GitHub
- Email: candely1charifa@gmail.com

## 🙏 Acknowledgments

- [Payload CMS](https://payloadcms.com/) for the excellent headless CMS
- [Vercel](https://vercel.com/) for hosting and deployment
- [Stripe](https://stripe.com/) for payment processing
- [Radix UI](https://www.radix-ui.com/) for accessible components

---

**Built with ❤️ using Next.js and Payload CMS**
