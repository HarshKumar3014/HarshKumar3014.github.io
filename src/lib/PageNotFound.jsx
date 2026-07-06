import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PageNotFound() {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    return (
        <div className="grain flex min-h-screen items-center justify-center bg-background p-6 font-body text-foreground">
            <div className="text-center">
                <p className="font-mono text-xs tracking-[0.3em] text-ice/70">
                    harsh@lab:~$ cat /{pageName}
                </p>
                <h1 className="mt-6 font-display text-8xl font-semibold text-frost md:text-9xl">
                    4<span className="text-gradient-heat">0</span>4
                </h1>
                <p className="mt-4 font-mono text-sm text-muted-foreground">
                    no such file or directory
                </p>
                <Link
                    to="/"
                    className="mt-10 inline-flex items-center gap-2 rounded-full border border-ice/25 px-6 py-3 font-mono text-sm text-ice transition-colors hover:border-ember hover:text-heat"
                >
                    <ArrowLeft className="h-4 w-4" />
                    back to lab
                </Link>
            </div>
        </div>
    );
}
