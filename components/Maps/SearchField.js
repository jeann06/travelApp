import { GeoSearchControl } from "leaflet-geosearch";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const SearchField = ({ provider, ...props }) => {
  const searchControl = new GeoSearchControl({
    provider: provider,
    ...props,
  });

  const map = useMap();
  useEffect(() => {
    map.addControl(searchControl);
    return () => {
      map.removeControl(searchControl);
    };
  }, []);

  return null;
};

export default SearchField;
