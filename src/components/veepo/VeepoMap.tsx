import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Importamos a biblioteca Leaflet principal para o ícone

// Reutilizando o tipo Provider que você já tem em seus hooks
// Ajuste o caminho do import se o seu tipo estiver em outro lugar
import type { Provider } from '../../hooks/useProviders';

// Adicionando latitude e longitude ao nosso tipo
type ProviderWithLocation = Provider & {
  latitude?: number | null;
  longitude?: number | null;
};

interface VeepoMapProps {
  providers: ProviderWithLocation[];
}

// Criamos um ícone personalizado usando o seu logo
// Ele espera que o arquivo 'logo-feedo.svg' esteja na sua pasta /public
const veepoIcon = new L.Icon({
  iconUrl: '/logo-feedo.svg',
  iconSize: [38, 38], // Tamanho do ícone em pixels: [largura, altura]
  className: 'bg-fundo-card rounded-full border-2 border-realce p-1' // Classes Tailwind para estilizar o ícone
});

export const VeepoMap: React.FC<VeepoMapProps> = ({ providers }) => {
  // Coordenadas iniciais para o mapa (ex: Carazinho, RS)
  const initialPosition: [number, number] = [-28.2833, -52.7865];

  return (
    <MapContainer 
      center={initialPosition} 
      zoom={13} 
      scrollWheelZoom={true} 
      style={{height: "100%", width: "100%", backgroundColor: '#161616'}}
    >
      {/* Camada de "tiles" que busca as imagens do mapa do OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* Mapeamos os providers para criar os marcadores (pins) */}
      {providers.map(provider => {
        // Renderiza o marcador apenas se tiver latitude e longitude
        if (provider.latitude && provider.longitude) {
          return (
            <Marker 
              key={provider.id} 
              position={[provider.latitude, provider.longitude]}
              icon={veepoIcon} // Usamos o nosso ícone personalizado aqui
            >
              <Popup>
                {/* O que aparece quando o usuário clica no pin */}
                <span className="font-bold">{provider.name || 'Veeper'}</span>
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
    </MapContainer>
  );
};