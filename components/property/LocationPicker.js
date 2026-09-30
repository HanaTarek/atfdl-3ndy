"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const DEFAULT_LAT = 30.0444;
const DEFAULT_LNG = 31.2357;

const SEARCH_DEBOUNCE_MS = 500;
const PIN_DEBOUNCE_MS = 500;

export default function LocationPicker({
  initialLat = DEFAULT_LAT,
  initialLng = DEFAULT_LNG,
}) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const pinTimeoutRef = useRef(null);

  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [country, setCountry] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [initialLng, initialLat],
      zoom: 9,
    });

    markerRef.current = new mapboxgl.Marker({
      color: "#CA6200",
      draggable: true,
    })
      .setLngLat([initialLng, initialLat])
      .addTo(mapRef.current);

    markerRef.current.on("dragend", () => {
      const { lng, lat } = markerRef.current.getLngLat();
      setCoords({ lat, lng });
      scheduleReverseGeocode(lng, lat);
    });

    mapRef.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      markerRef.current.setLngLat([lng, lat]);
      setCoords({ lat, lng });
      scheduleReverseGeocode(lng, lat);
    });

    mapRef.current.on("error", (e) => {
      console.error("Mapbox error:", e.error);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      clearTimeout(searchTimeoutRef.current);
      clearTimeout(pinTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pin -> address, debounced: waits until the pin has been still
  // for PIN_DEBOUNCE_MS before actually firing the request.
  function scheduleReverseGeocode(lng, lat) {
    clearTimeout(pinTimeoutRef.current);
    setIsLocating(true);
    pinTimeoutRef.current = setTimeout(() => {
      reverseGeocode(lng, lat);
    }, PIN_DEBOUNCE_MS);
  }

  async function reverseGeocode(lng, lat) {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&types=country,region,place`,
      );
      const data = await res.json();
      const feature = data.features?.[0];
      if (feature) {
        setLocationName(feature.place_name);
        setSearchQuery(feature.place_name);

        const countryCtx = feature.place_type?.includes("country")
          ? feature
          : feature.context?.find((c) => c.id.startsWith("country"));
        setCountry(countryCtx?.text || "");
      }
    } catch (err) {
      console.error("Reverse geocode error:", err);
    } finally {
      setIsLocating(false);
    }
  }

  // Address -> pin, debounced: waits until the user pauses typing
  // for SEARCH_DEBOUNCE_MS before firing.
  function scheduleSearch(query) {
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      runSearch(query);
    }, SEARCH_DEBOUNCE_MS);
  }

  async function runSearch(query) {
    const q = query.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        q,
      )}.json?access_token=${mapboxgl.accessToken}&limit=5`,
    );
    const data = await res.json();
    setSearchResults(data.features || []);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    clearTimeout(searchTimeoutRef.current); // typed Enter/clicked — skip the wait
    runSearch(searchQuery);
  }

  function handleInputChange(e) {
    const value = e.target.value;
    setSearchQuery(value);
    scheduleSearch(value);
  }

  function handleSelectResult(feature) {
    const [lng, lat] = feature.center;
    mapRef.current.flyTo({ center: [lng, lat], zoom: 12 });
    markerRef.current.setLngLat([lng, lat]);
    setCoords({ lat, lng });
    setSearchResults([]);
    setSearchQuery(feature.place_name);
    setLocationName(feature.place_name);

    const countryCtx = feature.place_type?.includes("country")
      ? feature
      : feature.context?.find((c) => c.id.startsWith("country"));
    setCountry(countryCtx?.text || "");
  }

  return (
    <div className="flex flex-col gap-4 mt-5">
      {/* Map + search/info row */}
      <div className="flex flex-col gap-2 md:flex-row">
        {/* Map — left */}
        <div className="flex flex-col w-full md:h-96 md:w-1/2 gap-3">
          <div
            ref={mapContainer}
            className="h-72 w-full overflow-hidden rounded-2xl"
          />
          {/* Hint — full width, bottom of the whole picker */}
          <p className="text-xs text-[#FBDFC5]/40 self-end text-end align-left ">
            Click anywhere on the map, or drag the pin, to set the exact
            location.
          </p>
        </div>

        {/* Search + location info — right */}
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="relative">
            <div className="flex items-end gap-3">
              <div className="flex-1 gap-3">
                <label
                  htmlFor="address"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
                >
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(e)}
                  placeholder="Search an address..."
                  className="w-full rounded-xl bg-[#17110C] px-4 py-3 text-sm text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/30"
                />
              </div>
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="shrink-0 rounded-xl bg-[#CA6200] px-4 py-3 text-sm font-bold text-[#FBDFC5]"
              >
                Search
              </button>
            </div>

            {searchResults.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl bg-[#1f1710] shadow-xl">
                {searchResults.map((feature) => (
                  <li key={feature.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectResult(feature)}
                      className="w-full px-4 py-2.5 text-left text-sm text-[#FBDFC5]/80 hover:bg-[#17110C]"
                    >
                      {feature.place_name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/40">
              Country
            </span>
            <p className="text-sm text-[#FBDFC5]/90">
              {country || (isLocating ? "Locating..." : "—")}
            </p>
          </div>

          <div className="flex flex-col gap-0.5 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/40">
              Location
            </span>
            <p className="text-sm text-[#FBDFC5]/90">
              {locationName ||
                (isLocating
                  ? "Locating..."
                  : "Click or drag the pin to set a location")}
            </p>
          </div>
        </div>
      </div>

      <input type="hidden" name="latitude" value={coords.lat} />
      <input type="hidden" name="longitude" value={coords.lng} />
      <input type="hidden" name="country" value={country} />
      <input type="hidden" name="locationName" value={locationName} />
    </div>
  );
}
