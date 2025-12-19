'use client';

import FundingTicket from '@/components/funding/funding_ticket';
import { mockFundingItems } from '@/interfaces/funding';
import Layout from '@/components/common/layout';

export default function FundingPage() {
  return (
    <Layout>
      <div className="grid grid-cols-2 gap-spacing-lv-7 p-2">
        {mockFundingItems.map((item) => (
          <FundingTicket key={item.id} data={item} />
        ))}
      </div>
    </Layout>
  );
}
