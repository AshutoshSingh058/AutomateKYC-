import MainLayout from "../components/layout/MainLayout";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <MainLayout>
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          
          {/* Left Side */}
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Verify customers securely with 
              <span className="text-emerald-600"> AI-powered KYC</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600">
              Fast, automated, and compliant KYC verification for modern businesses.
              Let AI extract documents, match details, detect fraud, and generate risk reports.
            </p>

            <div className="mt-8 flex space-x-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="px-8 py-4 rounded-xl font-bold border border-gray-300 text-gray-800 hover:bg-gray-100"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Right Side — Illustration */}
          <div className="mt-12 md:mt-0">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png"
              alt="KYC illustration"
              className="w-80 md:w-96 drop-shadow-lg"
            />
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose SecureKYC?
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            
            <div className="p-8 bg-white rounded-3xl shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-based OCR</h3>
              <p className="text-gray-600">
                Extract data from PAN, Aadhaar, Passports, and IDs with high accuracy.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Matching</h3>
              <p className="text-gray-600">
                AI compares declared details with extracted text — name, DOB, gender, and address.
              </p>
            </div>

            <div className="p-8 bg-white rounded-3xl shadow-md border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Decisions</h3>
              <p className="text-gray-600">
                Get APPROVED, NEEDS REVIEW, or REJECTED decisions in seconds.
              </p>
            </div>

          </div>

        </div>
      </section>

    </MainLayout>
  );
}
