import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Hospital } from 'lucide-react';
import { motion } from 'framer-motion';
import { googleMapsApiKey } from '../config';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '1rem',
};

const defaultCenter = {
  lat: 20.5937, // India center
  lng: 78.9629,
};

export function NearbyHospitalsMap() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey,
    libraries: ['places'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(5);
  const [hospitals, setHospitals] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<google.maps.places.PlaceResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const handleSearch = () => {
    if (!map || !searchTerm) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchTerm }, (results, status) => {
      if (status === 'OK' && results) {
        const location = results[0].geometry.location;
        map.panTo(location);
        setCenter({ lat: location.lat(), lng: location.lng() });
        setZoom(12);
        searchNearbyHospitals(location);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  const searchNearbyHospitals = (location: google.maps.LatLng) => {
    if (!map) return;
    const service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location,
        radius: 5000, // 5km radius
        type: 'hospital',
      },
      (results, status) => {
        if (status === 'OK' && results) {
          setHospitals(results);
        }
      }
    );
  };

  return isLoaded ? (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Enter your city or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.place_id}
            position={hospital.geometry?.location}
            onClick={() => setSelectedHospital(hospital)}
            icon={{
              url: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233B82F6" width="32px" height="32px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
            }}
          />
        ))}

        {selectedHospital && (
          <InfoWindow
            position={selectedHospital.geometry?.location}
            onCloseClick={() => setSelectedHospital(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-lg">{selectedHospital.name}</h3>
              <p>{selectedHospital.vicinity}</p>
              {selectedHospital.rating && (
                <p>Rating: {selectedHospital.rating} ★</p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  ) : (
    <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
      <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
    </div>
  );
}
