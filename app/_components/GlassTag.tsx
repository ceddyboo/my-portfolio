import { memo, useState, useEffect } from "react";

interface GlassTagProps {
  text?: string;
  className?: string;
}

const GlassTag = memo(function GlassTag({ text, className = "" }: GlassTagProps) {
  const roles = ["VIDEO EDITOR", "THUMBNAIL DESIGNER", "CONTENT STRATEGIST"];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <div
      className={`px-4 py-1 rounded-xl backdrop-blur-[6px] bg-white/10 border border-white/10 transition-all duration-300 ease-out ${className}`}
      style={{
        zIndex: 40,
      }}
    >
      <span 
        className={`block text-purple-400 font-bold text-xs md:text-sm uppercase tracking-wide transition-opacity duration-300 whitespace-nowrap ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {roles[currentRoleIndex]}
      </span>
    </div>
  );
});

export default GlassTag; 