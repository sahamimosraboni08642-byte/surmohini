import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">SurMohini</Link>

        <nav className="flex gap-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/tools" className="hover:text-primary">Tools</Link>
          <Link to="/how" className="hover:text-primary">How it Works</Link>
          <Link to="/blog" className="hover:text-primary">Blog</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
