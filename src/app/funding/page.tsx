'use client';

import FundingTicket from '@/components/funding/funding_ticket';
import { mockFundingItems } from '@/interfaces/funding';

export default function FundingPage() {
  return (
    <main className="flex min-h-screen w-full flex-col overflow-x-hidden bg-surface-neutral-background">
      <div></div>

      <div className="grid grid-cols-2 gap-spacing-lv-7 p-2">
        {mockFundingItems.map((item) => (
          <FundingTicket key={item.id} data={item} />
        ))}
      </div>
    </main>
  );
}
