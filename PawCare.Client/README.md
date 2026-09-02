# PawCare Client

PawCare frontend migrated from React + Vite to **Next.js 16 App Router** with TypeScript.

## Stack

- Next.js 16.3.x (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- TanStack Query
- React Hook Form + Zod
- Axios
- Sonner

## Development

```bash
npm install
npm run dev
```

Set the API URL in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.example.com
```

## Routes

- `/`
- `/login`
- `/register`
- `/verify-email`
- `/dashboard`
- `/pets`
- `/pets/new`
- `/pets/[id]/edit`
- `/veterinarians`
- `/book/[vetId]`
- `/appointments`

Authentication is currently preserved from the Vite application using the existing JWT in `localStorage`. The Next.js App Router is therefore used for routing and application structure, while the authenticated application remains client-driven where browser state and TanStack Query are required.
