import { ArrowUp, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function FloatingButtons() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", checkScroll);
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll to top */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          title="Remonter"
          className="fixed bottom-24 right-4 z-50 bg-green-700 hover:bg-green-800 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* WhatsApp */}
      <a
        href="https://wa.me/+242064407066 "
        target="_blank"
        rel="noopener noreferrer"
        title="Discuter sur WhatsApp"
        className="fixed bottom-6 right-4 z-50 bg-[#25D366] hover:bg-[#1DA851] text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110"
      >
        <FaWhatsapp className="w-5 h-5" />
      </a>
    </>
  );
}
