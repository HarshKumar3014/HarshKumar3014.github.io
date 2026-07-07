// Renders `*word*` markers in a string as editorial serif italics.
// variant 'heat' = ember gradient (headlines), 'soft' = inherits tone (body copy).
export default function accentify(text, variant = 'heat') {
    const parts = text.split(/\*([^*]+)\*/g);
    if (parts.length === 1) return text;
    const cls = variant === 'soft' ? 'serif-soft' : 'serif-accent';
    return parts.map((part, i) =>
        i % 2 === 1 ? (
            <em key={i} className={cls}>
                {part}
            </em>
        ) : (
            part
        )
    );
}
