'use client';

import UserPortfolio from '@/components/admin/user_portfolio';

export default function UserPortfolioPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="mb-2 text-2xl font-bold text-white">User Portfolio</h1>
                <p className="text-slate-400">View and manage user asset portfolios.</p>
            </div>

            <UserPortfolio />
        </div>
    );
}
