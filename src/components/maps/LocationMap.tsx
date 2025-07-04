// Em: src/components/maps/LocationMap.tsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapStyles.css';

// --- CORREÇÃO PARA O ÍCONE PADRÃO (Mantemos como fallback) ---
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

// --- NOSSO ÍCONE CUSTOMIZADO ---
// Criamos uma nova definição de ícone usando o seu logo.
const customPinIcon = L.icon({
  iconUrl: '/logo-pink.svg', // Caminho para o seu logo na pasta /public
  shadowUrl: iconShadowUrl, // Podemos usar a sombra padrão se quisermos

  iconSize:     [35, 35], // Tamanho do ícone [largura, altura] - ajuste se necessário
  iconAnchor:   [17, 35], // Ponto do ícone que corresponderá à localização (metade da largura, altura total)
  popupAnchor:  [1, -34], // Ponto a partir do qual o pop-up deve abrir, relativo ao iconAnchor
  shadowSize:   [41, 41]  // Tamanho da sombra
});


// --- Definição das Props e do Componente ---

interface MapFeedback {
  id: string;
  lat: number;
  lng: number;
}

interface LocationMapProps {
  feedbacks: MapFeedback[];
}

export const LocationMap: React.FC<LocationMapProps> = ({ feedbacks }) => {
  if (!feedbacks || feedbacks.length === 0) {
    return <div className="flex w-full h-full items-center justify-center text-gray-400">Nenhuma localização para exibir.</div>;
  }

  return (
    <MapContainer 
      center={[-14.235, -51.925]} 
      zoom={4} 
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {feedbacks.map(feedback => (
        // Adicionamos a prop "icon" para usar nosso ícone customizado
        <Marker 
          key={feedback.id} 
          position={[feedback.lat, feedback.lng]}
          icon={customPinIcon} 
        >
         <Popup>
    Um feedback foi registrado nesta localização. <br /> ID: {feedback.id}
  </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};