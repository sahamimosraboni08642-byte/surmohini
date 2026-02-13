import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="text-center py-20 bg-white">
      <h1 className="text-4xl font-bold text-gray-900">
        Transform Your Audio with <span className="text-primary">AI Magic</span>
      </h1>

      <p className="mt-4 text-lg text-gray-600">
        Remove vocals, separate instruments, convert sounds & more.
      </p>

      <Link
        to="/tools"
        className="mt-8 inline-block bg-primary text-white px-8 py-3 rounded-md text-lg"
      >
        Start Using Tools
      </Link>
    </section>
  );
}
