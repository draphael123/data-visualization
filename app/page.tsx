import dynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';

const HomePageClient = dynamic(() => import('@/components/HomePageClient'), {
  ssr: false,
});

export default function HomePage() {
  return <HomePageClient />;
}
