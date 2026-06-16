import { useEffect, useRef } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { HtmlMapView, HtmlMapViewHandle } from '@/components/shared/HtmlMapView';

interface OSMMapProps {
  from?: string;
  to?: string;
  style?: ViewStyle;
}

const MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html, #map { width: 100%; height: 100%; background: #0B1220; }
    .leaflet-control-attribution { display: none !important; }
    .leaflet-bar {
      border: none !important;
      box-shadow: 0 2px 12px rgba(0,0,0,0.5) !important;
      border-radius: 12px !important;
      overflow: hidden;
    }
    .leaflet-bar a {
      background-color: #111A2E !important;
      color: #FFFFFF !important;
      border-bottom: 1px solid rgba(255,255,255,0.06) !important;
      width: 36px !important;
      height: 36px !important;
      line-height: 36px !important;
      font-size: 20px !important;
    }
    .leaflet-bar a:hover { background-color: #1E293B !important; }
    .leaflet-popup-content-wrapper {
      background: #111A2E;
      color: #fff;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 4px 24px rgba(0,0,0,0.5);
    }
    .leaflet-popup-tip { background: #111A2E; }
    .leaflet-popup-content { font-size: 13px; font-family: -apple-system, sans-serif; }
    .pin-from {
      background: #4F46E5;
      width: 18px; height: 18px;
      border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.35), 0 4px 16px rgba(79,70,229,0.6);
    }
    .pin-to {
      background: #A855F7;
      width: 18px; height: 18px;
      border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 0 0 3px rgba(168,85,247,0.35), 0 4px 16px rgba(168,85,247,0.6);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: true,
      attributionControl: false
    }).setView([23.766, 90.405], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      subdomains: 'abcd'
    }).addTo(map);

    var fromMarker = null;
    var toMarker = null;
    var routeLine = null;

    var LOCATIONS = {
      'shahbag': [23.7386, 90.3958],
      'motijheel': [23.7330, 90.4172],
      'mirpur': [23.8223, 90.3654],
      'banani': [23.7937, 90.4066],
      'gulshan': [23.7925, 90.4078],
      'uttara': [23.8759, 90.3795],
      'dhanmondi': [23.7461, 90.3742],
      'baridhara': [23.7999, 90.4208],
      'farmgate': [23.7561, 90.3872],
      'mohammadpur': [23.7542, 90.3625],
      'badda': [23.7805, 90.4267],
      'tejgaon': [23.7593, 90.3989],
      'mohakhali': [23.7778, 90.4006],
      'rampura': [23.7612, 90.4244],
      'khilgaon': [23.7525, 90.4269],
      'bashundhara': [23.8193, 90.4284],
      'wari': [23.7196, 90.4178],
      'lalbagh': [23.7189, 90.3882],
      'paltan': [23.7361, 90.4111],
      'mogbazar': [23.7490, 90.4031],
      'dhaka': [23.8103, 90.4125],
      'airport': [23.8481, 90.3982],
      'zinzira': [23.7034, 90.3749],
      'shyamoli': [23.7710, 90.3605],
      'cantonment': [23.8027, 90.3997]
    };

    function findLocal(q) {
      if (!q) return null;
      var key = q.toLowerCase().trim();
      if (LOCATIONS[key]) return LOCATIONS[key];
      for (var k in LOCATIONS) {
        if (key.includes(k) || k.includes(key)) return LOCATIONS[k];
      }
      return null;
    }

    function geocode(query, cb) {
      if (!query || !query.trim()) { cb(null); return; }
      var local = findLocal(query);
      if (local) { cb(local); return; }
      fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query + ', Dhaka, Bangladesh') + '&limit=1&accept-language=en')
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data && data.length > 0) {
            cb([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          } else { cb(null); }
        })
        .catch(function() { cb(null); });
    }

    function makeIcon(cls) {
      return L.divIcon({ className: '', html: '<div class="' + cls + '"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
    }

    function updateMap(fromLoc, toLoc) {
      if (fromMarker) { map.removeLayer(fromMarker); fromMarker = null; }
      if (toMarker)   { map.removeLayer(toMarker);   toMarker = null;  }
      if (routeLine)  { map.removeLayer(routeLine);   routeLine = null; }

      geocode(fromLoc, function(fc) {
        geocode(toLoc, function(tc) {
          if (fc) {
            fromMarker = L.marker(fc, { icon: makeIcon('pin-from') })
              .addTo(map)
              .bindPopup('<b>Pickup</b><br>' + (fromLoc || ''));
          }
          if (tc) {
            toMarker = L.marker(tc, { icon: makeIcon('pin-to') })
              .addTo(map)
              .bindPopup('<b>Destination</b><br>' + (toLoc || ''));
          }
          if (fc && tc) {
            routeLine = L.polyline([fc, tc], {
              color: '#10B981',
              weight: 4,
              opacity: 0.85,
              dashArray: '10, 8',
              lineJoin: 'round'
            }).addTo(map);
            map.fitBounds(L.latLngBounds([fc, tc]), { padding: [60, 60], maxZoom: 15 });
          } else if (fc) {
            map.setView(fc, 15);
          } else if (tc) {
            map.setView(tc, 15);
          }
        });
      });
    }

    function handleMsg(e) {
      try {
        var msg = JSON.parse(e.data);
        if (msg.type === 'UPDATE_MARKERS') {
          updateMap(msg.from, msg.to);
        }
      } catch(err) {}
    }
    document.addEventListener('message', handleMsg);
    window.addEventListener('message', handleMsg);
  </script>
</body>
</html>
`;

export function OSMMap({ from = '', to = '', style }: OSMMapProps) {
  const mapRef = useRef<HtmlMapViewHandle>(null);
  const prevFrom = useRef('');
  const prevTo = useRef('');

  useEffect(() => {
    if (prevFrom.current === from && prevTo.current === to) return;
    prevFrom.current = from;
    prevTo.current = to;

    mapRef.current?.postMapMessage(
      JSON.stringify({ type: 'UPDATE_MARKERS', from, to }),
    );
  }, [from, to]);

  return <HtmlMapView ref={mapRef} html={MAP_HTML} style={style} />;
}
