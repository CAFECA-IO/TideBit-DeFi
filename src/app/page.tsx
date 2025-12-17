'use client';

import React, { useState } from 'react';
import LoginPageBody from '@/components/login/login_page_body';
import TermsOfServiceModal from '@/components/login/terms_of_service_modal';

export default function Home() {
  // ToDo: (20251216 - Julian) Move to global context
  const [isTosModalVisible, setIsTosModalVisible] = useState<boolean>(false);

  const toggleTosModal = () => setIsTosModalVisible((prev) => !prev);

  return (
    <main className="flex min-h-screen w-full flex-col overflow-x-hidden bg-surface-neutral-background bg-login-background bg-cover bg-top bg-no-repeat">
      <LoginPageBody toggleTosModal={toggleTosModal} />

      <TermsOfServiceModal isModalVisible={isTosModalVisible} onClose={toggleTosModal} />
    </main>
  );
}
