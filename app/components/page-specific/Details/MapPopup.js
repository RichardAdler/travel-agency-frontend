import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'; // Import Tooltip from react-leaflet
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../../firebase/firebase'; // Import Firestore config
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Import map marker icon

// Conditionally create Leaflet icon using FaMapMarkerAlt, ensure it's browser-safe
const createIcon = () => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="flex justify-center items-center text-red-500 hover:scale-110 transition-transform" style="width: 24px; height: 24px;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
          <path d="M12 2C8.1 2 5 5.1 5 9c0 4.3 7 13 7 13s7-8.7 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5 14.5 7.6 14.5 9 13.4 11.5 12 11.5z"></path>
        </svg>
      </div>`,
    iconSize: [24, 24],
    popupAnchor: [0, -15],
  });
};

const MapPopup = ({ latitude, longitude, name, imageUrl, locationId, address }) => {
  const [savedLocations, setSavedLocations] = useState([]); // State to store previously saved locations
  const [isClient, setIsClient] = useState(false); // Ensure this is only run on the client side

  // Ensure this code only runs on the client-side to avoid the "window is not defined" error
  useEffect(() => {
    setIsClient(true); // Set client-side flag to true
  }, []);

  // Load saved locations from Firestore (only in client mode)
  const loadSavedLocations = async () => {
    const mapCollectionRef = collection(db, 'map');
    const mapDocs = await getDocs(mapCollectionRef);
    const locations = mapDocs.docs.map((doc) => doc.data());
    setSavedLocations(locations);
  };

  useEffect(() => {
    if (isClient) {
      loadSavedLocations(); // Load saved locations when the component mounts on the client
    }
  }, [isClient]);

  // Avoid rendering the map on the server to prevent the "window is not defined" error
  if (!isClient) return null;

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-96 w-full rounded-lg shadow-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Display previously saved locations */}
      {savedLocations.map((location) => (
        <Marker
          key={location.locationId}
          position={[location.latitude, location.longitude]}
          icon={createIcon()}
        >
          <Tooltip>{location.name}</Tooltip> {/* Tooltip showing location name */}
          <Popup>
            <div className="text-left">
              <img
                src={location.imageUrl}
                alt={location.name}
                className="w-48 h-48 rounded-lg object-cover mb-2 mx-auto"
              />
              <p className="text-lg font-bold">{location.name}</p>
              <p className="text-sm text-gray-600">{location.address}</p> {/* Display address */}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Current location marker */}
      <Marker position={[latitude, longitude]} icon={createIcon()}>
        <Tooltip>{name}</Tooltip> {/* Tooltip showing location name */}
        <Popup>
          <div className="text-left">
            <img
              src={imageUrl}
              alt={name}
              className="w-48 h-48 rounded-lg object-cover mb-2 mx-auto"
            />
            <p className="text-lg font-bold">{name}</p>
            <p className="text-sm text-gray-600">{address}</p> {/* Display address */}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapPopup;
