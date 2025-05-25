'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('@/components/leaftlet-map'), {
  ssr: false,
});

export default function MapPicker({
  onLocationSelect,
  onLoad,
}: {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  onLoad?: () => void;
}) {
  return <LeafletMap onLocationSelect={onLocationSelect} onLoad={onLoad} />;
}
