import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

const DashboardClient = dynamicImport(() => import('@/components/DashboardClient'), {
  ssr: false,
});

export default function DashboardPage() {
  return <DashboardClient />;
}
