import React from 'react';
import { Container, ContainerCard } from '@/entities/container';

interface ContainerGridProps {
  containers: Container[];
}

export const ContainerGrid = ({ containers }: ContainerGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {containers.map((container) => (
        <div key={container.id} className="h-full">
          <ContainerCard container={container} />
        </div>
      ))}
    </div>
  );
}; 