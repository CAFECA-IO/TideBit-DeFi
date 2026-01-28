'use client';

import RegistrySettings from '@/components/admin/registry_settings';

export default function RegistrySettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="mb-2 text-2xl font-bold text-white">Registry Settings</h1>
                <p className="text-slate-400">Configure Identity and Trusted Issuers registries.</p>
            </div>

            <RegistrySettings />
        </div>
    );
}
