"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function PropertyMap({ location, latitude, longitude }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude || !mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [longitude, latitude],
      zoom: 11,
    });

    new mapboxgl.Marker({ color: "#CA6200" })
      .setLngLat([longitude, latitude])
      .addTo(map);

    return () => map.remove();
  }, [latitude, longitude]);

  if (!latitude || !longitude) {
    return (
      <div className="flex h-64 items-center justify-center rounded-[1.5rem] bg-[#1f1710] text-sm text-[#FBDFC5]/40">
        Location not available
      </div>
    );
  }

  return (
    <div className="relative h-64 overflow-hidden rounded-[1.5rem]">
      <div ref={mapContainer} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-[#17110C]/70 px-3 py-1.5 text-xs font-medium text-[#FBDFC5] backdrop-blur-sm">
        {location}
      </div>
    </div>
  );
}
