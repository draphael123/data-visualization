import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

const HomePageClient = dynamicImport(() => import('@/components/HomePageClient'), {
  ssr: false,
});

export default function HomePage() {
  return <HomePageClient />;
}
