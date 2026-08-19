export default function Footer() {
  return (
    <footer className="mt-10 border-t border-line py-8">
      <p className="font-mono text-[11.5px] text-faint">
        © {new Date().getFullYear()} Harsh Kumar · built with React & Tailwind
      </p>
    </footer>
  )
}
