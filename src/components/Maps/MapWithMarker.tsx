import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// /import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { INDONESIA_BOOUNDS } from '@/utils/map';

interface MapWithMarkerProps {
    lat: number;
    lon: number;
}

const MapWithMarker: React.FC<MapWithMarkerProps> = ({ lat, lon }) => {
    const position: [number, number] = [lat, lon];
    
    return (
        <MapContainer
            className='w-full h-52'
            center={position}
            zoom={4}
            maxBounds={INDONESIA_BOOUNDS}
            maxBoundsViscosity={1.0}
            style={{ zIndex: '1' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapWithMarker;
