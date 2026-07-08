import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { PROFILE, PUBLICATIONS, PROJECTS, SKILLS } from '../portfolio/data';

const NEOFETCH = String.raw`
        .-~~~-.        harsh@lab
   .- ~ ~-(   )_ _     ─────────────────
  /           ~ -.     os        harshOS 2.0 (thermal)
 |     BRAIN     |     host      Columbia University, NYC
  \          .-'       kernel    multi-agent 6.1.0-agentic
   ~- . ___ . -~       uptime    22 yrs
                       papers    2 (1 accepted, 1 under review)
                       builds    ${PROJECTS.length} flagship, 6 in archive
                       shell     /bin/curiosity
                       memory    1,700+ annotated samples
                       gpu       borrowed, always
`;

// A real terminal. Small, honest command set — the fastest way for a
// developer visitor to feel at home.
export default function Terminal({ openApp, closeSelf }) {
    const [lines, setLines] = useState([
        'harshOS 2.0 — thermal kernel',
        "type 'help' to see what this thing does",
        '',
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: 'nearest' });
    }, [lines]);

    const print = (...out) => setLines((prev) => [...prev, ...out]);

    const run = (raw) => {
        const cmd = raw.trim();
        const [name, ...args] = cmd.split(/\s+/);
        print(`harsh@lab:~$ ${cmd}`);
        if (!name) return;

        switch (name) {
            case 'help':
                print(
                    'available commands:',
                    '  whoami         who is this guy',
                    '  neofetch       system info',
                    '  ls             list apps',
                    '  open <app>     launch an app (about, research, builds, log, contact)',
                    '  papers         published research',
                    '  skills         the toolbox',
                    '  cat resume     open the resume pdf',
                    '  sudo hire-harsh   try it',
                    '  clear          wipe the scrollback',
                    '  exit           close this window',
                    ''
                );
                break;
            case 'whoami':
                print(`${PROFILE.name} — ${PROFILE.role}`, PROFILE.tagline.replace(/\*/g, ''), '');
                break;
            case 'neofetch':
                print(...NEOFETCH.split('\n'), '');
                break;
            case 'ls':
                print('about.app  research.app  builds.app  field-log.app  contact.app', '');
                break;
            case 'open': {
                const target = (args[0] || '').replace(/\.app$/, '');
                if (['about', 'research', 'builds', 'log', 'contact'].includes(target)) {
                    openApp?.(target);
                    print(`launching ${target}.app …`, '');
                } else {
                    print(`open: no such app: ${args[0] || ''}`, "try 'ls'", '');
                }
                break;
            }
            case 'papers':
                PUBLICATIONS.forEach((p) => {
                    print(`${p.title} — ${p.venue} [${p.status}]`, `  ${p.link}`);
                });
                print('');
                break;
            case 'skills':
                print(SKILLS.join(' · '), '');
                break;
            case 'cat':
                if ((args[0] || '').startsWith('resume')) {
                    print('opening Harsh_Resume.pdf …', '');
                    window.open('/Harsh_Resume.pdf', '_blank', 'noreferrer');
                } else {
                    print(`cat: ${args[0] || ''}: no such file`, '');
                }
                break;
            case 'sudo':
                if (args.join(' ') === 'hire-harsh') {
                    confetti({
                        particleCount: 90,
                        spread: 100,
                        startVelocity: 30,
                        colors: ['#FF5C2E', '#FFAE45', '#7DE0FF'],
                        origin: { y: 0.6 },
                    });
                    print('[sudo] access granted.', `next step: ${PROFILE.email}`, '');
                } else {
                    print(`${PROFILE.name.split(' ')[0].toLowerCase()} is not in the sudoers file. this incident will be reported.`, '');
                }
                break;
            case 'pwd':
                print('/home/harsh/lab', '');
                break;
            case 'date':
                print(new Date().toString(), '');
                break;
            case 'clear':
                setLines([]);
                break;
            case 'exit':
                closeSelf?.();
                break;
            default:
                print(`command not found: ${name} — try 'help'`, '');
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        run(input);
        setInput('');
    };

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div className="flex h-full min-h-[280px] flex-col font-retro text-[17px] leading-snug" onClick={() => inputRef.current?.focus()}>
            <div className="flex-1 space-y-0.5 overflow-y-auto whitespace-pre-wrap text-[#9be8b7]">
                {lines.map((line, i) => (
                    <div key={i} className={line.startsWith('harsh@lab') ? 'text-ice' : undefined}>
                        {line || ' '}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <form onSubmit={onSubmit} className="mt-2 flex items-center gap-2 border-t border-ice/10 pt-2">
                <span className="text-ice">harsh@lab:~$</span>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-transparent text-frost caret-ember outline-none"
                    autoFocus
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label="Terminal input"
                />
            </form>
        </div>
    );
}
