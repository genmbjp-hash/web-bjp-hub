import React from 'react';
import { RtRwPageConfig } from '../types';
import { RtRwView } from '../components/RtRwView';
import { Container } from '../components/ui/Container';

interface RtRwPageProps {
  config: RtRwPageConfig;
  onBack: () => void;
}

export const RtRwPage: React.FC<RtRwPageProps> = ({ config, onBack }) => (
  <Container className="py-8">
    <RtRwView config={config} onBack={onBack} />
  </Container>
);
