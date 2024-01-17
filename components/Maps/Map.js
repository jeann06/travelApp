import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet-defaulticon-compatibility";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { useEffect, useRef, useState } from "react";
import SearchField from "../Maps/SearchField";

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

const GetCoordinates = () => {
  const initialized = useRef(false);
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    async function loadLeaflet() {
      initialized.current = true;
      await import("leaflet");

      const L = window.L;

      const info = L.DomUtil.create("div", "card p-2");

      const position = L.Control.extend({
        options: {
          position: "bottomleft",
        },

        onAdd: function (map) {
          info.textContent = `Click on the map to get coordinates`;
          return info;
        },
      });

      map.on("click", (e) => {
        info.textContent = `[${e.latlng.lat}, ${e.latlng.lng}]`;
      });

      map.addControl(new position());
    }

    if (!initialized.current) {
      loadLeaflet();
    }
  }, []);

  return null;
};

const Map = ({ position, zoom, onClickMap, isDisabled = false }) => {
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
      <LocationMarker
        position={position}
        onClickMap={onClickMap}
        isDisabled={isDisabled}
      />
      {/* See more in https://github.com/smeijer/leaflet-geosearch */}
      {!isDisabled && (
        <>
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
          <GetCoordinates />
        </>
      )}
    </MapContainer>
  );
};

export default Map;
