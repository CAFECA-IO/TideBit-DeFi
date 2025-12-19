'use client';

import Image from 'next/image';
import { LuUserRound } from 'react-icons/lu';
import FundingTicket from '@/components/funding/funding_ticket';
import { mockFundingItems } from '@/interfaces/funding';
import Layout from '@/components/common/layout';
import { FundingStatus } from '@/constants/funding';

export default function FundingPage() {
  const tabOptions = Object.values(FundingStatus);

  return (
    <Layout className="flex flex-col">
      {/* Info: (20251219 - Julian) Funding Page Header */}
      <div className="flex items-end justify-between gap-spacing-lv-7 p-spacing-lv-8">
        <div className="flex flex-col gap-spacing-lv-0 whitespace-nowrap font-semibold text-text-neutral-primary">
          <h1 className="text-3xl">
            <span className="text-text-brand-primary">TideBit</span> Fuels the Future for Startup
          </h1>
          <p className="text-base">
            Your investment helps real companies take root, grow, and thrive.
          </p>
        </div>
        <div>
          <Image src="/elements/funding_banner.png" width={374} height={143} alt="funding_banner" />
        </div>
      </div>

      {/* Info: (20251219 - Julian) Funding Filter Section */}
      <div className="flex px-spacing-lv-8 py-spacing-lv-5"></div>

      {/* Info: (20251219 - Julian) Funding Tab */}
      <div className="flex items-end justify-between px-spacing-lv-8 py-spacing-lv-5">
        {/* Info: (20251219 - Julian) Tab */}
        <div className="grid grid-cols-3 gap-spacing-lv-2 py-spacing-lv-3">
          {tabOptions.map((status) => (
            <button
              key={status}
              type="button"
              className={`rounded-t-radius-m border-b-2 px-spacing-lv-6 py-spacing-lv-3 text-tabs-text-default`}
            >
              {status}
            </button>
          ))}
        </div>
        {/* Info: (20251219 - Julian) Sorting */}
        <div className="flex items-center gap-spacing-lv-2 rounded-radius-s border border-text-field-outline-default bg-text-field-surface-default px-spacing-lv-4 py-spacing-lv-2 font-medium text-text-field-text-active">
          <LuUserRound size={20} />
          <p>Upload Date</p>
        </div>
      </div>

      {/* Info: (20251219 - Julian) Funding List */}
      <div className="grid grid-cols-2 justify-items-center gap-spacing-lv-7 p-2 px-spacing-lv-8">
        {mockFundingItems.map((item) => (
          <FundingTicket key={item.id} data={item} />
        ))}
      </div>
    </Layout>
  );
}
