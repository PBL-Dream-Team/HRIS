'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const LeafletMap = dynamic(() => import('@/components/leaftlet-map'), {
  ssr: false,
});

export default function MapPicker({ onLocationSelect }: {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}) {
  return <LeafletMap onLocationSelect={onLocationSelect} />;
}