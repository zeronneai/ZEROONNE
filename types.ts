// Fix: Import React to resolve namespace error for React.ReactNode
import React from 'react';

export interface Service {
  id: string;
  title: string;
  desc: string;
  detail: string;
}

export interface RevealProps {
  children: React.ReactNode;
}