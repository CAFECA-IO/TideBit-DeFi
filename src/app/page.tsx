'use client';

import LoginPageBody from '@/components/login/login_page_body';
import TermsOfServiceModal from '@/components/login/terms_of_service_modal';
import GuidedTourModal from '@/components/login/guided_tour_modal';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col overflow-x-hidden bg-surface-neutral-background bg-login-background bg-cover bg-top bg-no-repeat">
      <LoginPageBody />

      <TermsOfServiceModal />
      <GuidedTourModal />
    </main>
  );
}
