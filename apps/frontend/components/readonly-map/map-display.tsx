'use client';

import dynamic from 'next/dynamic';

const LeafletMapDisplay = dynamic(() => import('@/components/readonly-map/leaflet-map'), {
  ssr: false,
});

export default function MapDisplay({
  position,
  onLoad,
}: {
  position: { lat: number; lng: number };
  onLoad?: () => void;
}) {
  return (
    <LeafletMapDisplay 
      position={position}
      onLoad={onLoad}
    />
  );
}