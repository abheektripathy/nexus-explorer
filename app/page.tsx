import { Header } from "@/components/header";
import { LatestBlocks } from "@/components/latest-blocks";
import { AccountStates } from "@/components/account-states";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 flex items-center justify-center flex-col">
        <div className="bg-[#121212] w-64 rounded-full text-2xl p-2 flex items-center justify-center text-center text-blue-500 my-6">
          Nexus Explorer
        </div>
        <div className="w-[90%] max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-8 mt-8">
            <LatestBlocks />
            <AccountStates />
          </div>
        </div>
      </div>
    </main>
  );
}
