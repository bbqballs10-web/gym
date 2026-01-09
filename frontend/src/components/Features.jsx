import React from 'react';
import { useTranslation } from 'react-i18next';
import { features } from '../data/mock';
import { Activity, Minimize2, Target, Crosshair } from 'lucide-react';

const iconMap = {
  'activity': Activity,
  'minimize-2': Minimize2,
  'target': Target,
  'globe': Crosshair
};

const Features = () => {
  const { t } = useTranslation();
  
  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('nav.whyRaze')}</h2>
          <p className="section-subtitle">{t('features.performanceDesc')}</p>
          <p className="section-subtitle-secondary">{t('features.qualityDesc')}</p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">
                  {Icon && <Icon size={36} strokeWidth={1.5} />}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
        
        <p className="features-tagline">{t('features.designDesc')}</p>
      </div>
    </section>
  );
};

export default Features;
