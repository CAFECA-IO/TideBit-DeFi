'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiDatabase, FiSettings, FiBriefcase, FiCpu, FiPieChart } from 'react-icons/fi';

export default function AdminSidebar() {
    const pathname = usePathname();

    const navItems = [
        {
            name: 'General',
            path: '/admin',
            icon: <FiHome size={20} />,
            activePattern: /^\/admin$/,
        },
        {
            name: 'Platform Token',
            path: '/admin/platform_token',
            icon: <FiDatabase size={20} />,
            activePattern: /^\/admin\/platform_token/,
        },
        {
            name: 'Companies',
            path: '/admin/companies',
            icon: <FiBriefcase size={20} />,
            activePattern: /^\/admin\/companies/,
        },
        {
            name: 'Token Operations',
            path: '/admin/token_operations',
            icon: <FiCpu size={20} />,
            activePattern: /^\/admin\/token_operations/,
        },
        {
            name: 'User Portfolio',
            path: '/admin/user_portfolio',
            icon: <FiPieChart size={20} />,
            activePattern: /^\/admin\/user_portfolio/,
        },
        {
            name: 'Registry Settings',
            path: '/admin/registry_settings',
            icon: <FiSettings size={20} />,
            activePattern: /^\/admin\/registry_settings/,
        },
    ];

    return (
        <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900 md:flex">
            <div className="p-6">
                <h2 className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-xl font-bold text-transparent">
                    Admin Console
                </h2>
                <p className="text-xs text-slate-400">ERC-3643 Management</p>
            </div>

            <nav className="flex-1 space-y-1 px-4">
                {navItems.map((item) => {
                    const isActive = item.activePattern.test(pathname);
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4">
                <div className="rounded-lg bg-slate-800 p-4">
                    <p className="text-xs font-medium text-slate-400">System Status</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                        </span>
                        <span className="text-xs text-green-400">Operational</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
