'use client';

export default function Footer() {
    return (
        <footer className="w-full border-t border-slate-800 bg-slate-950 py-6 text-center">
            <p className="text-xs text-slate-600">
                © {new Date().getFullYear()} CAFECA - TideBit DeFi v2.0.0
            </p>
        </footer>
    );
}
