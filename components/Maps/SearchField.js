import { GeoSearchControl } from "leaflet-geosearch";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const SearchField = ({
  provider,
  onShowLocation,
  onRemoveLayer = (e) => console.log("Layer removed"),
  ...props
}) => {
  const searchControl = new GeoSearchControl({
    provider: provider,
    ...props,
  });

  const map = useMap();
  useEffect(() => {
    map.addControl(searchControl);
    map.on("geosearch/showlocation", (result) => {
      onShowLocation?.(result.location);
    });
    map.on("layerremove", onRemoveLayer);
    return () => {
      map.removeControl(searchControl);
      map.removeEventListener("geosearch/showlocation");
      map.removeEventListener("layerremove", onRemoveLayer);
    };
  }, []);

  return null;
};

export default SearchField;
