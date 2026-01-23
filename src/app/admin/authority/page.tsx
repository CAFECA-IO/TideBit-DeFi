'use client';

import React from 'react';

export default function AdminAuthorityPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-gray-800">Authority & Roles</h2>
        <p className="mt-2 text-gray-600">
          Management of Agents and Admin roles for the Token and Registry.
        </p>
      </div>
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
        <h3 className="mb-2 text-lg font-bold text-yellow-800">Under Construction</h3>
        <p className="text-yellow-700">
          Advanced role management view is coming soon. Please use Hardhat tasks for critical role
          updates.
        </p>
      </div>
    </div>
  );
}
