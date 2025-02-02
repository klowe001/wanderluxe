import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    switch (path) {
      case "Explore":
        navigate("/explore");
        break;
      case "My Trips":
        navigate("/my-trips");
        break;
      case "Inspiration":
        navigate("/inspiration");
        break;
      default:
        break;
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`text-xl font-bold ${
            isScrolled ? "text-earth-500" : "text-white"
          }`}
        >
          Wanderlust
        </motion.a>
        <div className="hidden space-x-8 md:flex">
          {["Explore", "My Trips", "Inspiration"].map((item) => (
            <motion.button
              key={item}
              onClick={() => handleNavigation(item)}
              whileHover={{ y: -2 }}
              className={`text-sm font-medium ${
                isScrolled ? "text-earth-500" : "text-white"
              }`}
            >
              {item}
            </motion.button>
          ))}
        </div>
        <motion.button
          onClick={() => navigate("/create-trip")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            isScrolled
              ? "bg-earth-500 text-white hover:bg-earth-600"
              : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
          }`}
        >
          Create Trip
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navigation;