export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 text-center">
      <p className="font-mono text-xs text-gray-600">
        © {new Date().getFullYear()} Harsh Kumar · built with React, Tailwind &
        too much caffeine
      </p>
    </footer>
  )
}
