export default function footer() {
  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center">
        <p className="text-sm text-base-content/70">
          © {new Date().getFullYear()} Amrenther. All rights reserved.
        </p>

        <p className="mt-1 text-xs text-base-content/50">
          Built with Next.js & TypeScript
        </p>
      </div>
    </footer>
  );
}