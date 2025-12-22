'use client';

import LoginPageBody from '@/components/login/login_page_body';
import RegisterModal from '@/components/login/register_modal';
import TermsOfServiceModal from '@/components/login/terms_of_service_modal';
import AuthenticationModal from '@/components/login/authentication_modal';
import GuidedTourModal from '@/components/login/guided_tour_modal';

const LoginPage = () => {
  return (
    // Info: (20251219 - Tzuhan) 使用與首頁相同的背景設定，確保視覺一致性
    <main className="flex min-h-screen w-full flex-col overflow-x-hidden bg-surface-neutral-background bg-login-background bg-cover bg-top bg-no-repeat">
      <LoginPageBody />

      <RegisterModal />
      <TermsOfServiceModal />
      <AuthenticationModal />
      <GuidedTourModal />
    </main>
  );
};

export default LoginPage;
