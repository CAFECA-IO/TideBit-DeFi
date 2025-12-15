import React from 'react';
import LoginPageBody from '@/components/login/login_page_body';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col overflow-x-hidden bg-surface-neutral-background bg-login-background bg-cover bg-top bg-no-repeat">
      <LoginPageBody />
    </main>
  );
}
