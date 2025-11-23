export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-emerald-500" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              SecureKYC
            </span>
          </div>

          {/* Links */}
          <div className="flex space-x-6 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#security" className="hover:text-gray-900">Security</a>
            <a href="#privacy" className="hover:text-gray-900">Privacy</a>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} SecureKYC. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
