'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LeafletMap({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2, 106.8]);

  const LocationMarker = () => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.setView([position.lat, position.lng], 15);
      }
    }, [position, map]);

    useMapEvents({
      // click(e) {
      //   const { lat, lng } = e.latlng;
      //   setPosition({ lat, lng });

      //   fetch(
      //     `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      //   )
      //     .then((res) => res.json())
      //     .then((data) => {
      //       const address = data.display_name || '';
      //       onLocationSelect(lat, lng, address);
      //     });
      // },
    });

    return position ? <Marker position={position} icon={markerIcon} /> : null;
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);

          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
            .then((res) => res.json())
            .then((data) => {
              const address = data.display_name || '';
              onLocationSelect(latitude, longitude, address);
            });
        },
        (err) => {
          console.warn('GPS Error:', err);
        }
      );
    }
  }, []);

  return (
    <MapContainer
      center={mapCenter}
      zoom={15}
      dragging={false}
      scrollWheelZoom={true}
      attributionControl={false}
      className="h-64 w-full rounded-lg z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}
