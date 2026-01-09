import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Using flag images from flagcdn.com for cross-platform compatibility
const languages = [
  { code: 'en', name: 'English', flagCode: 'us' },
  { code: 'es', name: 'Español', flagCode: 'es' },
  { code: 'fr', name: 'Français', flagCode: 'fr' },
  { code: 'de', name: 'Deutsch', flagCode: 'de' },
  { code: 'pt', name: 'Português', flagCode: 'pt' },
  { code: 'it', name: 'Italiano', flagCode: 'it' },
  { code: 'ja', name: '日本語', flagCode: 'jp' },
  { code: 'zh', name: '中文', flagCode: 'cn' },
  { code: 'ko', name: '한국어', flagCode: 'kr' },
  { code: 'nl', name: 'Nederlands', flagCode: 'nl' }
];

// Helper to get flag image URL
const getFlagUrl = (flagCode) => `https://flagcdn.com/24x18/${flagCode}.png`;

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
      >
        <img 
          src={getFlagUrl(currentLanguage.flagCode)} 
          alt={currentLanguage.name}
          className="language-flag-img"
        />
        <span className="language-name-display">{currentLanguage.name}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="language-overlay" 
            onClick={() => setIsOpen(false)}
          />
          <div className="language-dropdown">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`language-option ${lang.code === i18n.language ? 'active' : ''}`}
                onClick={() => changeLanguage(lang.code)}
              >
                <img 
                  src={getFlagUrl(lang.flagCode)} 
                  alt={lang.name}
                  className="language-flag-img"
                />
                <span className="language-name">{lang.name}</span>
                {lang.code === i18n.language && (
                  <span className="language-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .language-selector {
          position: relative;
          z-index: 1000;
        }

        .language-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .language-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #00d9ff;
        }

        .language-flag-img {
          width: 24px;
          height: 18px;
          border-radius: 2px;
          object-fit: cover;
        }

        .language-name-display {
          font-size: 14px;
          font-weight: 500;
          display: inline-block !important;
        }

        .language-code {
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        .language-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 999;
        }

        .language-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 200px;
          background: #1a1a1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          z-index: 1000;
        }

        .language-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: none;
          color: white;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
          text-align: left;
        }

        .language-option:hover {
          background: rgba(0, 217, 255, 0.1);
        }

        .language-option.active {
          background: rgba(0, 217, 255, 0.15);
          color: #00d9ff;
        }

        .language-name {
          flex: 1;
        }

        .language-check {
          color: #00d9ff;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .language-button {
            padding: 4px 6px;
            gap: 3px;
            font-size: 10px;
            border-radius: 4px;
            margin: 0px;
            min-height: 28px;
          }

          .language-flag-img {
            width: 16px;
            height: 12px;
          }

          .language-name-display {
            font-size: 10px;
            font-weight: 500;
          }

          .language-dropdown {
            right: auto;
            left: 0;
            min-width: 180px;
          }

          .language-option {
            padding: 10px 14px;
            font-size: 13px;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageSelector;
