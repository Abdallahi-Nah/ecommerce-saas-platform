import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, X } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
  ];

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
      >
        <Globe size={20} className="text-gray-600" />
        <span className="hidden sm:inline text-sm font-medium">
          {languages.find((l) => l.code === i18n.language)?.flag || "🌐"}
        </span>
      </button>

      {/* Dropdown - Desktop & Mobile */}
      {isOpen && (
        <>
          {/* Overlay للموبايل فقط */}
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown Menu */}
          <div className="fixed md:absolute top-16 md:top-full right-4 md:right-0 md:mt-2 w-64 md:w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
            {/* Close button (Mobile only) */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 md:hidden">
              <span className="font-semibold text-gray-800">اختر اللغة</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Languages */}
            <div className="p-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3 transition rounded-lg ${
                    i18n.language === lang.code
                      ? "bg-mint-50 text-mint-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-sm">{lang.label}</span>
                  {i18n.language === lang.code && (
                    <span className="mr-auto text-mint-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
