import React from 'react';
import { PollingPageConfig } from '../types';
import { PollingPage as PollingPageView } from '../components/PollingPage';

interface PollingPageProps {
  config?: PollingPageConfig;
  onGoHome: () => void;
}

export const PollingPage: React.FC<PollingPageProps> = ({ config, onGoHome }) => (
  <PollingPageView config={config} onGoHome={onGoHome} />
);
