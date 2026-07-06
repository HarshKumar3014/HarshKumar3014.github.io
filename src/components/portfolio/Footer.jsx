import { PROFILE } from './data';

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-ice/10">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 font-mono text-xs text-muted-foreground sm:flex-row">
                <p>
                    © {new Date().getFullYear()} {PROFILE.name}
                </p>
                <p className="text-muted-foreground/60">
                    harsh@lab:~$ logout<span className="caret" />
                </p>
            </div>
        </footer>
    );
}
