import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IndustryData } from '@/types/industry';
import { UseFormSetValue } from 'react-hook-form';
import { INDONESIA_BOOUNDS } from '@/utils/map';

interface ChainSelectBoxProps {
    setValue: UseFormSetValue<IndustryData>;
}

const ClickableMap: React.FC<ChainSelectBoxProps> = ({ setValue }) => {
    const [position, setPosition] = useState<LatLng | null>(null);

    useEffect(() => {
        if (position) {
            setValue('latitude', position?.lat.toString())
            setValue('longitude', position?.lng.toString())
        }
    }, [position])

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                setPosition(e.latlng)
            },
        });

        return null;
    };

    return (
        <div>
            <MapContainer
                center={[-2.5489, 118.0149]}
                zoom={5}
                style={{ height: '50vh', width: '100%', zIndex: '1' }}
                maxBounds={INDONESIA_BOOUNDS}
                maxBoundsViscosity={1.0}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler />
                {position && (
                    <Marker position={position}>
                        <Popup>
                            Latitude: {position.lat} <br /> Longitude: {position.lng}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default ClickableMap;