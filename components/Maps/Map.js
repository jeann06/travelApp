import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMapEvent,
} from "react-leaflet";

import "leaflet-defaulticon-compatibility";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import SearchField from "../Maps/SearchField";
import { useState, useEffect } from "react";

const LocationMarker = ({
  position = [51.505, -0.09],
  onClickMap,
  isDisabled = false,
}) => {
  const [marker, setMarker] = useState(position);
  const map = useMapEvents({
    click(e) {
      if (!isDisabled) {
        setMarker(e.latlng);
        onClickMap?.(e.latlng);
      }
    },
  });

  return (
    <>
      <Marker position={marker}>
        <Popup>
          Coordinate: {marker.lat ?? position[1]} - {marker.lng ?? position[0]}
        </Popup>
      </Marker>
    </>
  );
};

const Map = ({ position, zoom, onClickMap, isDisabled = false }) => {
  const prov = new OpenStreetMapProvider();
  const [userLocation, setUserLocation] = useState(null);

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
      <LocationMarker
        position={position}
        onClickMap={onClickMap}
        isDisabled={isDisabled}
      />
      {/* See more in https://github.com/smeijer/leaflet-geosearch */}
      {!isDisabled && (
        <SearchField
          provider={prov}
          style="bar"
          showMarker={false} // We set it to false, so basically this is just a search function
          showPopup={false}
          popupFormat={({ query, result }) => result.label}
          maxMarkers={3}
          retainZoomLevel={false}
          animateZoom={true}
          autoClose={false}
          searchLabel={"Enter address, please"}
          keepResult={true}
        />
      )}
    </MapContainer>
  );
};

export default Map;
