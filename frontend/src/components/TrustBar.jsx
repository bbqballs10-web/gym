import React from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Shield, Award, CheckCircle } from 'lucide-react';

const TrustBar = () => {
  const { t } = useTranslation();
  
  return (
    <div className="trust-bar">
      <div className="trust-bar-content">
        <div className="trust-item">
          <Truck size={20} />
          <span>{t('trustBar.freeShipping')}</span>
        </div>
        <div className="trust-item">
          <CheckCircle size={20} />
          <span>{t('trustBar.easyReturns')}</span>
        </div>
        <div className="trust-item">
          <Shield size={20} />
          <span>{t('trustBar.securePayment')}</span>
        </div>
        <div className="trust-item">
          <Award size={20} />
          <span>{t('trustBar.support')}</span>
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
