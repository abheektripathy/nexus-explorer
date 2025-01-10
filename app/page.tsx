import { Header } from '@/components/header';
import { Search } from '@/components/search';
import { LatestBlocks } from '@/components/latest-blocks';
import { AccountStates } from '@/components/account-states';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Search />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <LatestBlocks />
          <AccountStates />
        </div>
      </div>
    </main>
  );
}