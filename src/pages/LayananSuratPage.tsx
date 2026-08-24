import React from 'react';
import { DocumentTemplate } from '../types';
import { DocumentGeneratorPage } from '../components/DocumentGeneratorPage';

interface LayananSuratPageProps {
  templates?: DocumentTemplate[];
  onGoHome: () => void;
}

export const LayananSuratPage: React.FC<LayananSuratPageProps> = ({ templates, onGoHome }) => (
  <DocumentGeneratorPage templates={templates} onGoHome={onGoHome} />
);
