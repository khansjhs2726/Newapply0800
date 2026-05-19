import { useEffect, useState } from "react";
import govLogo from "@/assets/splash-logo.jpg";

const SplashScreen = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2200);
    const hideTimer = setTimeout(() => setVisible(false), 2800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-hero transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      aria-label="Loading"
      role="status"
    >
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      <div className="relative flex flex-col items-center animate-fade-in">
        <div className="relative">
          <div className="absolute -inset-10 bg-gov-gold/40 blur-3xl rounded-full animate-pulse" />
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-gov-gold shadow-gold animate-scale-in">
            <img
              src={govLogo}
              alt="Government of Pakistan"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-6 text-center px-4">
          Government of Pakistan
        </h1>
        <p className="text-gov-gold text-sm sm:text-base mt-2 font-semibold tracking-wider uppercase">
          Ministry of Finance
        </p>
        <p className="text-white/80 text-xs sm:text-sm mt-1">
          Loan Assistance Programme
        </p>

        <div className="mt-8 flex items-center gap-2">
          <span className="w-2 h-2 bg-gov-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-gov-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-gov-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>

      <div className="absolute bottom-6 text-white/60 text-xs">
        Pakistan Zindabad
      </div>
    </div>
  );
};

export default SplashScreen;
