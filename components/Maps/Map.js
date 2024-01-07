import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet-defaulticon-compatibility";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import SearchField from "../Maps/SearchField";

const Map = ({ position, zoom, onShowLocation, onRemoveLayer, ...props }) => {
  const prov = new OpenStreetMapProvider();

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker position={position} draggable={false} animate={true}>
        <Popup>Hey ! I live here</Popup>
      </Marker>

      {/* See more in https://github.com/smeijer/leaflet-geosearch */}
      <SearchField
        provider={prov}
        style="bar"
        onShowLocation={onShowLocation}
        onRemoveLayer={onRemoveLayer}
        showMarker={true}
        showPopup={false}
        popupFormat={({ query, result }) => result.label}
        maxMarkers={3}
        retainZoomLevel={false}
        animateZoom={true}
        autoClose={false}
        searchLabel={"Enter address, please"}
        keepResult={true}
      />
    </MapContainer>
  );
};

export default Map;
