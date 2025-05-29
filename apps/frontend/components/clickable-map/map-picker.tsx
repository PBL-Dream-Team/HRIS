'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('@/components/clickable-map/leaftlet-map'), {
  ssr: false,
});

export default function MapPicker({
  onLocationSelect,
  onLoad,
  initialPosition,
}: {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  onLoad?: () => void;
  initialPosition?: { lat: number; lng: number };
}) {
  return (
    <LeafletMap 
      onLocationSelect={onLocationSelect} 
      onLoad={onLoad}
      initialPosition={initialPosition}
    />
  );
}