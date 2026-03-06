import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-10 mt-10">
      <div className="max-w-6xl mx-auto text-center space-y-4">
        <p className="text-lg font-semibold">SurMohini</p>
        <div className="flex justify-center gap-6">
          <Link to="/privacy" className="hover:text-primary">Privacy</Link>
          <Link to="/terms" className="hover:text-primary">Terms</Link>
        </div>
        <p className="text-gray-500">
          © {new Date().getFullYear()} SurMohini – AI Audio Tools
        </p>
      </div>
    </footer>
  );
}
