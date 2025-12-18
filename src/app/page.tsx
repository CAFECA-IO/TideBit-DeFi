'use client';

// import LoginPageBody from '@/components/login/login_page_body';
import TermsOfServiceModal from '@/components/login/terms_of_service_modal';
import GuidedTourModal from '@/components/login/guided_tour_modal';
import RegisterModal from '@/components/login/register_modal';
import AuthenticationModal from '@/components/login/authentication_modal';

import FundingTicket from '@/components/funding/funding_ticket';
import { mockFundingItems } from '@/interfaces/funding';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col overflow-x-hidden bg-surface-neutral-background bg-login-background bg-cover bg-top bg-no-repeat">
      {/* <LoginPageBody /> */}

      <div className="grid grid-cols-2 gap-spacing-lv-7 p-2">
        {mockFundingItems.map((item) => (
          <FundingTicket key={item.id} data={item} />
        ))}
      </div>

      <TermsOfServiceModal />
      <GuidedTourModal />
      <RegisterModal />
      <AuthenticationModal />
    </main>
  );
}
