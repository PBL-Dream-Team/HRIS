'use client';

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LeafletMapDisplay({
  position,
  onLoad,
}: {
  position: { lat: number; lng: number };
  onLoad?: () => void;
}) {
  const MapController = () => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.setView([position.lat, position.lng], 15);
      }
      if (onLoad) onLoad();
    }, [position, map]);

    return null;
  };

  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={15}
      dragging={false} // Disable dragging for read-only
      scrollWheelZoom={false} // Disable zoom for read-only
      zoomControl={false} // Hide zoom controls
      attributionControl={false}
      className="h-64 w-full rounded-lg z-0"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} icon={markerIcon} />
      <MapController />
    </MapContainer>
  );
}
