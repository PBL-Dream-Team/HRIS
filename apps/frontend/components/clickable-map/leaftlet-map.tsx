'use client';

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LeafletMap({
  onLocationSelect,
  onLoad,
  initialPosition,
}: {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  onLoad?: () => void;
  initialPosition?: { lat: number; lng: number };
}) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    initialPosition || null,
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialPosition
      ? [initialPosition.lat, initialPosition.lng]
      : [-6.2, 106.8],
  );

  // Flag untuk mencegah auto-centering setelah user klik
  const hasUserInteracted = useRef(false);
  const isInitialized = useRef(false);

  const LocationMarker = () => {
    const map = useMap();

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        hasUserInteracted.current = true; // Set flag bahwa user sudah berinteraksi
        setPosition({ lat, lng });

        // Fetch address from coordinates
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        )
          .then((res) => res.json())
          .then((data) => {
            const address =
              data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            onLocationSelect(lat, lng, address);
          })
          .catch((error) => {
            console.error('Error fetching address:', error);
            onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          });
      },
    });

    // Auto-center ke posisi marker setiap kali position berubah
    useEffect(() => {
      if (position) {
        map.setView([position.lat, position.lng], map.getZoom());
      }
    }, [position, map]);

    return position ? <Marker position={position} icon={markerIcon} /> : null;
  };

  // Effect untuk menginisialisasi posisi
  useEffect(() => {
    // Jika sudah diinisialisasi, jangan lakukan apapun
    if (isInitialized.current) {
      return;
    }

    // Jika ada initialPosition, set posisi dan panggil onLocationSelect
    if (initialPosition) {
      setPosition(initialPosition);
      setMapCenter([initialPosition.lat, initialPosition.lng]);

      // Fetch address untuk initial position
      fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${initialPosition.lat}&lon=${initialPosition.lng}&format=json&addressdetails=1`,
      )
        .then((res) => res.json())
        .then((data) => {
          const address =
            data.display_name ||
            `${initialPosition.lat.toFixed(6)}, ${initialPosition.lng.toFixed(6)}`;
          onLocationSelect(initialPosition.lat, initialPosition.lng, address);
          if (onLoad) onLoad();
        })
        .catch((error) => {
          console.error('Error fetching initial address:', error);
          onLocationSelect(
            initialPosition.lat,
            initialPosition.lng,
            `${initialPosition.lat.toFixed(6)}, ${initialPosition.lng.toFixed(6)}`,
          );
          if (onLoad) onLoad();
        });
    } else {
      // Jika tidak ada initialPosition, coba dapatkan lokasi GPS
      if (typeof window !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setPosition({ lat: latitude, lng: longitude });
            setMapCenter([latitude, longitude]);

            fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            )
              .then((res) => res.json())
              .then((data) => {
                const address =
                  data.display_name ||
                  `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                onLocationSelect(latitude, longitude, address);
                if (onLoad) onLoad();
              })
              .catch((error) => {
                console.error('Error fetching GPS address:', error);
                onLocationSelect(
                  latitude,
                  longitude,
                  `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                );
                if (onLoad) onLoad();
              });
          },
          (err) => {
            console.warn('GPS Error:', err);
            if (onLoad) onLoad();
          },
        );
      } else {
        if (onLoad) onLoad();
      }
    }
  }, []); // Hapus dependency initialPosition, onLocationSelect, onLoad

  return (
    <MapContainer
      center={mapCenter}
      zoom={15}
      dragging={true}
      scrollWheelZoom={true}
      attributionControl={false}
      className="h-64 w-full rounded-lg z-0 cursor-pointer"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
}
