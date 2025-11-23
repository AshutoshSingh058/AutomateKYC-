import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden">
        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-7xl px-8 md:px-16">

            {/* TopNavBar */}
            <header className="flex items-center justify-between border-b border-gray-200 pb-6 pt-6">
              <div className="flex items-center gap-4">
                <div className="size-8 text-blue-600">
                  <svg fill="none" viewBox="0 0 48 48">
                    <path
                      d="M36.7 44c-2.7 0-5.1-4.2-6.3-10.3C29.1 39.8 26.7 44 24 44s-5.1-4.2-6.3-10.3C16.4 39.8 14 44 11.3 44 7.3 44 4 35 4 24S7.3 4 11.3 4c2.7 0 5.1 4.2 6.3 10.3C18.9 8.2 21.3 4 24 4s5.1 4.2 6.3 10.3C31.6 8.2 34 4 36.7 4 40.7 4 44 13 44 24s-3.3 20-7.3 20z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">SecureKYC</h2>
              </div>

              <div className="hidden md:flex items-center gap-12">
                <a className="text-sm hover:text-blue-600 transition-colors">Features</a>
                <a className="text-sm hover:text-blue-600 transition-colors">Pricing</a>
                <a className="text-sm hover:text-blue-600 transition-colors">Security</a>

                <button
                  className="h-11 w-34 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                  onClick={() => navigate("/register")}
                >
                  Request a Demo
                </button>
              </div>

              <div className="md:hidden">
                <span className="material-symbols-outlined">menu</span>
              </div>
            </header>

            <div className="h-10"></div>

            {/* Hero Section */}
            <section className="py-32">
              <div className="grid md:grid-cols-2 gap-24 items-center">

                {/* Left */}
                <div className="flex flex-col gap-10">
                  <h1 className="text-2xl md:text-3xl font-black leading-tight justify-center">
                    Intelligent, Secure KYC Verification. Simplified.
                  </h1>

                  <p className="text-gray-600 text-xl leading-relaxed">
                    Streamline identity verification with AI-driven accuracy and
                    enterprise-grade protection for modern businesses.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6 mt-4">
                    <button
                      className="h-14 w-46 px-9 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                      onClick={() => navigate("/login")}
                    >
                      Access User Portal
                    </button>

                    <button
                      className="h-14 w-40 px-7 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300"
                      onClick={() => navigate("/admin")}
                    >
                      Login to Admin Portal
                    </button>
                  </div>
                </div>

                {/* Right Card */}
                <div className="relative h-80 md:h-full flex justify-center">
                  <img
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                    src="https://imgs.search.brave.com/Gk_l-kHuTLuQBUkbCzbC7zbiU9W9jIObdA2Wn-72jRc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1Lzg4LzgyLzAz/LzM2MF9GXzU4ODgy/MDM1MF9yVW9nck1N/ekU3ZTZvM2JBRVpk/TElBTWp0MDR2NmpI/cS5qcGc"
                    alt="Secure data"
                  />
                </div>

              </div>
            </section>

            <div className="h-10"></div>

            {/* Features */}
            <section className="py-32">
              <h2 className="text-4xl font-bold text-center mb-20">
                Why Choose SecureKYC?
              </h2>

              <div className="grid md:grid-cols-3 gap-16">
                {[
                  {
                    title: "Secure Document Upload",
                    text: "End-to-end encrypted file uploads with strong data protection.",
                  },
                  {
                    title: "AI-Powered Verification",
                    text: "Fast, accurate, fraud-resistant identity analysis.",
                  },
                  {
                    title: "Seamless Integration",
                    text: "Simple API that plugs into existing systems with ease.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-10 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col gap-6"
                  >
                    <span className="material-symbols-outlined text-blue-600 text-5xl">
                      {item.icon}
                    </span>
                    <h3 className="text-2xl font-bold">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-10"></div>

            {/* How it Works */}
            <section className="py-32">
              <h2 className="text-4xl font-bold text-center mb-20">
                How It Works
              </h2>

              <div className="relative">
                <div className="absolute top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2 hidden md:block"></div>

                <div className="grid md:grid-cols-3 gap-20 text-center relative">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center gap-6">
                      <div className="size-16 flex items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold border-4 border-white shadow">
                        {step}
                      </div>

                      <h3 className="text-2xl font-semibold">
                        {step === 1 && "Upload Document"}
                        {step === 2 && "AI Verifies"}
                        {step === 3 && "Approved"}
                      </h3>

                      <p className="text-gray-600 leading-relaxed text-lg max-w-xs">
                        {step === 1 &&
                          "User uploads ID documents securely through the portal."}
                        {step === 2 &&
                          "AI validates identity, detects fraud, and verifies authenticity."}
                        {step === 3 &&
                          "Verification complete. User access granted securely."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="h-10"></div>

            {/* Trust Section */}
            <section className="py-32 bg-gray-100 rounded-3xl">
              <div className="grid md:grid-cols-2 gap-24 items-center px-8 md:px-16">
                <div className="flex flex-col gap-8">
                  <h2 className="text-4xl font-bold">
                    Built on a Foundation of Trust
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    We use industry-standard security frameworks to protect your
                    data.
                  </p>

                  <ul className="space-y-5 mt-4">
                    {[
                      "End-to-End Encryption",
                      "AI-powered verification",
                      "Real-time status tracking",
                      "OCR document extraction",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-lg">
                        <span className="text-blue-600 text-3xl">●</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-24 mt-24 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16">
                <div className="col-span-2 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="size-8 text-blue-600">
                      <svg fill="none" viewBox="0 0 48 48">
                        <path
                          d="M36.7 44c-2.7 0-5.1-4.2-6.3-10.3C29.1 39.8 26.7 44 24 44s-5.1-4.2-6.3-10.3C16.4 39.8 14 44 11.3 44 7.3 44 4 35 4 24S7.3 4 11.3 4c2.7 0 5.1 4.2 6.3 10.3C18.9 8.2 21.3 4 24 4s5.1 4.2 6.3 10.3C31.6 8.2 34 4 36.7 4 40.7 4 44 13 44 24s-3.3 20-7.3 20z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold">SecureKYC</h2>
                  </div>

                  <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                    Simplifying identity verification with innovative AI and
                    world-class security.
                  </p>
                </div>

                {[
                  {
                    title: "Product",
                    links: ["Features", "Pricing", "Security", "Integrations"],
                  },
                  {
                    title: "Company",
                    links: ["About Us", "Careers", "Contact"],
                  },
                  {
                    title: "Legal",
                    links: ["Privacy Policy", "Terms of Service"],
                  },
                ].map((section, i) => (
                  <div key={i} className="flex flex-col gap-5">
                    <h4 className="font-bold text-lg">{section.title}</h4>
                    {section.links.map((link, j) => (
                      <a
                        key={j}
                        href="#"
                        className="text-gray-600 text-sm hover:text-blue-600 transition-colors"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-20 pt-10 border-t border-gray-200 text-center text-gray-600 text-sm">
                © 2024 SecureKYC. All rights reserved.
              </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
}
