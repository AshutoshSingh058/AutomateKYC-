export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500" />
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            SecureKYC
          </span>
        </div>

        {/* Nav (static for now) */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <a href="#features" className="text-gray-700 hover:text-gray-900">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-700 hover:text-gray-900">
            How it works
          </a>
          <a href="#security" className="text-gray-700 hover:text-gray-900">
            Security
          </a>
        </nav>

        {/* Right actions */}
        <div className="flex items-center space-x-3">
          <a
            href="/login"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-800 hover:bg-gray-100"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Request a Demo
          </a>
        </div>

      </div>
    </header>
  );
}
