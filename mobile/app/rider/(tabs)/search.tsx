import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { SolidButton } from '@/components/ui';
import { Colors, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { locationService } from '@/services/location.service';
import { RecentPlace, recentPlacesService } from '@/services/recent-places.service';
import { matchLocationByName } from '@/services/mappers';
import { DhakaLocation } from '@/types';
import { buildLocationCoordLookup, findCoordsInLookup } from '@/utils/location-coords';

// ─── Local coordinate lookup for common Dhaka areas ─────────────────────────
const DHAKA_LOCS: Record<string, [number, number]> = {
  shahbag: [23.7386, 90.3958],
  motijheel: [23.7330, 90.4172],
  mirpur: [23.8223, 90.3654],
  banani: [23.7937, 90.4066],
  gulshan: [23.7925, 90.4078],
  uttara: [23.8759, 90.3795],
  dhanmondi: [23.7461, 90.3742],
  baridhara: [23.7999, 90.4208],
  farmgate: [23.7561, 90.3872],
  mohammadpur: [23.7542, 90.3625],
  badda: [23.7805, 90.4267],
  tejgaon: [23.7593, 90.3989],
  mohakhali: [23.7778, 90.4006],
  rampura: [23.7612, 90.4244],
  khilgaon: [23.7525, 90.4269],
  bashundhara: [23.8193, 90.4284],
  wari: [23.7196, 90.4178],
  lalbagh: [23.7189, 90.3882],
  paltan: [23.7361, 90.4111],
  mogbazar: [23.7490, 90.4031],
  dhaka: [23.8103, 90.4125],
  airport: [23.8481, 90.3982],
  shyamoli: [23.7710, 90.3605],
  cantonment: [23.8027, 90.3997],
  ramna: [23.7324, 90.4013],
  sadarghat: [23.7103, 90.4073],
  demra: [23.7181, 90.4566],
  jatrabari: [23.7208, 90.4397],
  kamalapur: [23.7328, 90.4267],
  malibagh: [23.7494, 90.4172],
  hatirjheel: [23.7617, 90.4078],
  gulistan: [23.7235, 90.4089],
  kawran: [23.7516, 90.3930],
};

function findLocal(q: string, lookup: Record<string, [number, number]>): [number, number] | null {
  return findCoordsInLookup(q, lookup);
}

async function geocodeRN(
  query: string,
  lookup: Record<string, [number, number]>,
): Promise<[number, number] | null> {
  if (!query || !query.trim()) return null;
  const local = findLocal(query, lookup);
  if (local) return local;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=en&q=${encodeURIComponent(query + ', Dhaka, Bangladesh')}`,
      { headers: { 'User-Agent': 'NittoJatra-App/1.0' } },
    );
    const data = await res.json();
    if (data?.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch {}
  return null;
}

// ─── Leaflet map HTML (receives coords, not text) ────────────────────────────
const MAP_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body,html,#map{width:100%;height:100%;background:#F1F5F9}
    .leaflet-control-attribution{display:none!important}
    .leaflet-bar{border:none!important;box-shadow:0 2px 12px rgba(0,0,0,.15)!important;border-radius:12px!important;overflow:hidden}
    .leaflet-bar a{background:#ffffff!important;color:#1E293B!important;border-bottom:1px solid #E2E8F0!important;width:38px!important;height:38px!important;line-height:38px!important;font-size:22px!important}
    .leaflet-bar a:hover{background:#F1F5F9!important}
    .leaflet-popup-content-wrapper{background:#ffffff;color:#0F172A;border-radius:14px;border:1px solid #E2E8F0;box-shadow:0 8px 32px rgba(0,0,0,.12)}
    .leaflet-popup-tip{background:#ffffff}
    .leaflet-popup-content{font-size:13px;font-family:-apple-system,sans-serif;margin:10px 14px}
    .leaflet-popup-content b{color:#4F46E5}
    .pin-from{width:22px;height:22px;border-radius:50%;background:#4F46E5;border:3px solid #fff;box-shadow:0 0 0 4px rgba(79,70,229,.25),0 4px 16px rgba(79,70,229,.5)}
    .pin-to{width:22px;height:22px;border-radius:50%;background:#A855F7;border:3px solid #fff;box-shadow:0 0 0 4px rgba(168,85,247,.25),0 4px 16px rgba(168,85,247,.5)}
  </style>
</head>
<body>
<div id="map"></div>
<script>
  var map=L.map('map',{zoomControl:true,attributionControl:false}).setView([23.766,90.405],12);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:20,subdomains:'abcd'}).addTo(map);

  var fM=null,tM=null,line=null;

  function icon(cls){
    return L.divIcon({className:'',html:'<div class="'+cls+'"></div>',iconSize:[22,22],iconAnchor:[11,11]});
  }

  function setMarkers(fromLat,fromLng,fromName,toLat,toLng,toName){
    if(fM){map.removeLayer(fM);fM=null}
    if(tM){map.removeLayer(tM);tM=null}
    if(line){map.removeLayer(line);line=null}

    var pts=[];
    if(fromLat!==null&&fromLng!==null){
      fM=L.marker([fromLat,fromLng],{icon:icon('pin-from')}).addTo(map)
        .bindPopup('<b>Pickup</b><br>'+fromName);
      pts.push([fromLat,fromLng]);
    }
    if(toLat!==null&&toLng!==null){
      tM=L.marker([toLat,toLng],{icon:icon('pin-to')}).addTo(map)
        .bindPopup('<b>Destination</b><br>'+toName);
      pts.push([toLat,toLng]);
    }
    if(pts.length===2){
      line=L.polyline(pts,{color:'#10B981',weight:4,opacity:.9,dashArray:'10,7',lineJoin:'round'}).addTo(map);
      map.fitBounds(L.latLngBounds(pts),{padding:[70,70],maxZoom:15,animate:true});
    } else if(pts.length===1){
      map.flyTo(pts[0],15,{animate:true,duration:0.8});
    }
  }

  function handleMsg(e){
    try{
      var d=JSON.parse(e.data);
      if(d.type==='SET_MARKERS'){
        setMarkers(
          d.fromLat,d.fromLng,d.fromName,
          d.toLat,d.toLng,d.toName
        );
      }
    }catch(err){}
  }
  document.addEventListener('message',handleMsg);
  window.addEventListener('message',handleMsg);
</script>
</body>
</html>`;

// ─── Component ───────────────────────────────────────────────────────────────
export default function FindScreen() {
  const [from, setFrom] = useState('Mirpur');
  const [to, setTo] = useState('Motijheel');
  const [geocoding, setGeocoding] = useState(false);
  const [apiLocations, setApiLocations] = useState<DhakaLocation[]>([]);
  const [recentPlaces, setRecentPlaces] = useState<RecentPlace[]>([]);
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined);
  const [seatPreference, setSeatPreference] = useState<string | undefined>(undefined);
  const [genderRestriction, setGenderRestriction] = useState<string | undefined>(undefined);
  const coordLookup = useRef<Record<string, [number, number]>>({ ...DHAKA_LOCS });
  const webRef = useRef<WebView>(null);
  const mapReady = useRef(false);
  const pendingMsg = useRef<string | null>(null);
  const fromTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Store resolved coords so we don't re-geocode when the other field changes
  const fromCoords = useRef<[number, number] | null>(null);
  const toCoords = useRef<[number, number] | null>(null);
  const fromLabel = useRef('');
  const toLabel = useRef('');

  // ─── Swipeable/Draggable bottom sheet state ──────────────────────────────────
  const [sheetHeight, setSheetHeight] = useState(500);
  const collapsedOffset = sheetHeight - 110;

  const translateY = useRef(new Animated.Value(0)).current;
  const lastTranslateY = useRef(0);

  const onSheetLayout = (event: { nativeEvent: { layout: { height: number } } }) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && Math.abs(height - sheetHeight) > 2) {
      setSheetHeight(height);
    }
  };

  const toggleSheet = () => {
    const targetValue = lastTranslateY.current === 0 ? collapsedOffset : 0;
    lastTranslateY.current = targetValue;
    Animated.spring(translateY, {
      toValue: targetValue,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
    if (targetValue === collapsedOffset) {
      Keyboard.dismiss();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateY.setOffset(lastTranslateY.current);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        let nextValue = gestureState.dy;
        const currentOffset = lastTranslateY.current + nextValue;

        if (currentOffset < -20) {
          nextValue = -20 + (currentOffset + 20) * 0.2 - lastTranslateY.current;
        } else if (currentOffset > collapsedOffset + 20) {
          nextValue = collapsedOffset + 20 + (currentOffset - collapsedOffset - 20) * 0.2 - lastTranslateY.current;
        }

        translateY.setValue(nextValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();
        const currentTranslation = lastTranslateY.current + gestureState.dy;

        // If it was a tap (very little movement), toggle the sheet open/close state
        if (Math.abs(gestureState.dy) < 5 && Math.abs(gestureState.dx) < 5) {
          toggleSheet();
          return;
        }

        let targetValue = 0;
        if (currentTranslation > collapsedOffset / 2) {
          targetValue = collapsedOffset;
        }

        lastTranslateY.current = targetValue;

        Animated.spring(translateY, {
          toValue: targetValue,
          useNativeDriver: true,
          tension: 40,
          friction: 8,
        }).start();

        if (targetValue === collapsedOffset) {
          Keyboard.dismiss();
        }
      },
    })
  ).current;

  const sendToMap = useCallback((
    fc: [number, number] | null, fn: string,
    tc: [number, number] | null, tn: string,
  ) => {
    const msg = JSON.stringify({
      type: 'SET_MARKERS',
      fromLat: fc ? fc[0] : null,
      fromLng: fc ? fc[1] : null,
      fromName: fn,
      toLat: tc ? tc[0] : null,
      toLng: tc ? tc[1] : null,
      toName: tn,
    });

    if (!mapReady.current) {
      pendingMsg.current = msg;
      return;
    }

    const js = `(function(){
      document.dispatchEvent(new MessageEvent('message',{data:${JSON.stringify(msg)}}));
    })();true;`;
    webRef.current?.injectJavaScript(js);
  }, []);

  const handleFromChange = (val: string) => {
    setFrom(val);
    if (fromTimer.current) clearTimeout(fromTimer.current);
    if (!val.trim()) {
      fromCoords.current = null;
      fromLabel.current = '';
      sendToMap(null, '', toCoords.current, toLabel.current);
      return;
    }
    fromTimer.current = setTimeout(async () => {
      setGeocoding(true);
      const coords = await geocodeRN(val, coordLookup.current);
      fromCoords.current = coords;
      fromLabel.current = val;
      setGeocoding(false);
      sendToMap(coords, val, toCoords.current, toLabel.current);
    }, 500);
  };

  const handleToChange = (val: string) => {
    setTo(val);
    if (toTimer.current) clearTimeout(toTimer.current);
    if (!val.trim()) {
      toCoords.current = null;
      toLabel.current = '';
      sendToMap(fromCoords.current, fromLabel.current, null, '');
      return;
    }
    toTimer.current = setTimeout(async () => {
      setGeocoding(true);
      const coords = await geocodeRN(val, coordLookup.current);
      toCoords.current = coords;
      toLabel.current = val;
      setGeocoding(false);
      sendToMap(fromCoords.current, fromLabel.current, coords, val);
    }, 500);
  };

  const handleRecentPress = (name: string) => {
    setTo(name);
    if (toTimer.current) clearTimeout(toTimer.current);
    const local = findLocal(name, coordLookup.current);
    toCoords.current = local;
    toLabel.current = name;
    if (local) {
      sendToMap(fromCoords.current, fromLabel.current, local, name);
    } else {
      geocodeRN(name, coordLookup.current).then((coords) => {
        toCoords.current = coords;
        sendToMap(fromCoords.current, fromLabel.current, coords, name);
      });
    }
  };

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const [locations, recent] = await Promise.all([
          locationService.getAll(),
          recentPlacesService.getAll(),
        ]);
        if (!active) return;

        setApiLocations(locations);
        coordLookup.current = buildLocationCoordLookup(locations, DHAKA_LOCS);
        setRecentPlaces(recent);

        const defaultFrom = matchLocationByName(locations, 'Mirpur')?.nameEn ?? 'Mirpur';
        const defaultTo = matchLocationByName(locations, 'Motijheel')?.nameEn ?? 'Motijheel';
        setFrom(defaultFrom);
        setTo(defaultTo);
        fromLabel.current = defaultFrom;
        toLabel.current = defaultTo;

        const fromPoint = findLocal(defaultFrom, coordLookup.current);
        const toPoint = findLocal(defaultTo, coordLookup.current);
        fromCoords.current = fromPoint;
        toCoords.current = toPoint;
        sendToMap(fromPoint, defaultFrom, toPoint, defaultTo);
      } catch {
        const fromPoint = findLocal('Mirpur', coordLookup.current);
        const toPoint = findLocal('Motijheel', coordLookup.current);
        fromCoords.current = fromPoint;
        toCoords.current = toPoint;
        sendToMap(fromPoint, 'Mirpur', toPoint, 'Motijheel');
      }
    })();

    return () => {
      active = false;
    };
  }, [sendToMap]);

  const onMapLoad = () => {
    mapReady.current = true;
    if (pendingMsg.current) {
      const msg = pendingMsg.current;
      pendingMsg.current = null;
      const js = `(function(){
        document.dispatchEvent(new MessageEvent('message',{data:${JSON.stringify(msg)}}));
      })();true;`;
      webRef.current?.injectJavaScript(js);
    }
  };

  const search = () => {
    void recentPlacesService.add(to || 'Motijheel').then(setRecentPlaces);
    router.push({
      pathname: '/ride/results',
      params: {
        from: from || 'Mirpur',
        to: to || 'Motijheel',
        timeSlot: timeSlot || '',
        seatPreference: seatPreference || '',
        genderRestriction: genderRestriction || '',
      },
    });
  };

  return (
    <View style={styles.root}>
      {/* ── Full-screen OSM Map ── */}
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html: MAP_HTML }}
        style={styles.map}
        javaScriptEnabled
        domStorageEnabled
        allowUniversalAccessFromFileURLs
        mixedContentMode="always"
        onLoad={onMapLoad}
      />

      {/* ── Geocoding spinner overlay ── */}
      {geocoding && (
        <View style={styles.geocodingBadge}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.geocodingText}>Finding location…</Text>
        </View>
      )}

      {/* ── Back button ── */}
      <SafeAreaView edges={['top']} style={styles.topOverlay} pointerEvents="box-none">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </Pressable>
      </SafeAreaView>

      {/* ── Bottom Sheet ── */}
      <Animated.View
        onLayout={onSheetLayout}
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        <View
          {...panResponder.panHandlers}
          style={styles.dragHandleZone}
        >
          <View style={styles.handle} />
          <Text style={styles.title}>Where do you want to go?</Text>
        </View>

        {/* Scrollable Content Zone */}
        <ScrollView style={styles.scrollableContent} showsVerticalScrollIndicator={false}>
          {/* Route Inputs */}
          <View style={styles.routeStack}>
            <LinearGradient
              colors={[...Gradients.routeDivider]}
              style={styles.routeDivider}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            {/* FROM */}
            <View style={[styles.routeCard, styles.routeCardFrom]}>
              <View style={styles.fromDot} />
              <View style={styles.routeInput}>
                <Text style={styles.routeLabel}>FROM</Text>
                <TextInput
                  accessibilityLabel="From location"
                  placeholder="Enter pickup location"
                  placeholderTextColor={Colors.textMuted}
                  value={from}
                  onChangeText={handleFromChange}
                  style={styles.input}
                  returnKeyType="next"
                />
              </View>
              {from.length > 0 && (
                <Pressable onPress={() => { setFrom(''); fromCoords.current = null; fromLabel.current = ''; sendToMap(null, '', toCoords.current, toLabel.current); }}>
                  <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
                </Pressable>
              )}
            </View>
            {/* TO */}
            <View style={styles.routeCard}>
              <View style={styles.toDot} />
              <View style={styles.routeInput}>
                <Text style={styles.routeLabel}>TO</Text>
                <TextInput
                  accessibilityLabel="To location"
                  placeholder="Enter destination"
                  placeholderTextColor={Colors.textMuted}
                  value={to}
                  onChangeText={handleToChange}
                  style={styles.input}
                  returnKeyType="search"
                  onSubmitEditing={search}
                />
              </View>
              {to.length > 0 && (
                <Pressable onPress={() => { setTo(''); toCoords.current = null; toLabel.current = ''; sendToMap(fromCoords.current, fromLabel.current, null, ''); }}>
                  <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
                </Pressable>
              )}
            </View>
          </View>

          {/* Filters Group */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionLabel}>RIDE FILTERS</Text>

            {/* Time Slot Chips */}
            <Text style={styles.filterLabel}>Departure Time</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {[
                { label: 'Any Time', value: undefined },
                { label: 'Morning (6am-12pm)', value: 'morning' },
                { label: 'Afternoon (12pm-6pm)', value: 'afternoon' },
                { label: 'Evening (6pm-12am)', value: 'evening' },
                { label: 'Night (12am-6am)', value: 'night' },
              ].map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => setTimeSlot(item.value)}
                  style={[
                    styles.filterChip,
                    timeSlot === item.value && styles.activeFilterChip,
                  ]}
                >
                  <Text style={[styles.chipLabel, timeSlot === item.value && styles.activeChipLabel]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Seat Preference Chips */}
            <Text style={styles.filterLabel}>Seat Preference</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {[
                { label: 'Any Seat', value: undefined },
                { label: 'Window Seat', value: 'window' },
                { label: 'Aisle Seat', value: 'aisle' },
                { label: 'Front Row', value: 'front' },
                { label: 'Back Row', value: 'back' },
              ].map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => setSeatPreference(item.value)}
                  style={[
                    styles.filterChip,
                    seatPreference === item.value && styles.activeFilterChip,
                  ]}
                >
                  <Text style={[styles.chipLabel, seatPreference === item.value && styles.activeChipLabel]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Gender Restriction Chips */}
            <Text style={styles.filterLabel}>Gender Option</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {[
                { label: 'Any Gender', value: undefined },
                { label: 'Only Male Rides', value: 'male' },
                { label: 'Only Female Rides', value: 'female' },
              ].map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => setGenderRestriction(item.value)}
                  style={[
                    styles.filterChip,
                    genderRestriction === item.value && styles.activeFilterChip,
                  ]}
                >
                  <Text style={[styles.chipLabel, genderRestriction === item.value && styles.activeChipLabel]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <Text style={styles.sectionLabel}>RECENT PLACES</Text>
          <View style={styles.recentContainer}>
            {(recentPlaces.length > 0
              ? recentPlaces
              : apiLocations.slice(0, 6).map((loc) => ({
                  id: loc.id,
                  name: loc.nameEn,
                  label: loc.zone,
                }))
            ).map((p) => (
              <Pressable
                key={p.id}
                accessibilityRole="button"
                accessibilityLabel={`${p.name}, ${p.label}`}
                onPress={() => handleRecentPress(p.name)}
                style={styles.recentRow}
              >
                <View style={styles.recentIcon}>
                  <Ionicons name="time-outline" size={18} color={Colors.textMuted} />
                </View>
                <View style={styles.recentText}>
                  <Text style={styles.recentName}>{p.name}</Text>
                  <Text style={styles.recentLabel}>{p.label}</Text>
                </View>
                <Ionicons name="arrow-up-outline" size={16} color={Colors.textMuted} style={{ transform: [{ rotate: '45deg' }] }} />
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <SolidButton title="SEARCH AVAILABLE RIDE" onPress={search} style={styles.searchBtn} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B1220' },

  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F1F5F9',
  },

  geocodingBadge: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    ...Shadows.float,
  },

  geocodingText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
  },

  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.xl,
  },

  backBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    ...Shadows.float,
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 34,
    maxHeight: '70%',
    ...Shadows.sheet,
  },

  dragHandleZone: {
    paddingTop: Spacing.xl,
    width: '100%',
    alignItems: 'center',
  },

  handle: {
    width: 48,
    height: 6,
    backgroundColor: Colors.track,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },

  title: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.lg,
    letterSpacing: Typography.letterSpacing.h2,
    color: Colors.textPrimary,
    lineHeight: 28,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  routeStack: {
    position: 'relative',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.sm,
  },

  routeDivider: {
    position: 'absolute',
    left: 31,
    top: 42,
    bottom: 42,
    width: 2,
    opacity: 0.2,
    borderRadius: 1,
  },

  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  routeCardFrom: {
    marginBottom: -14,
    zIndex: 1,
  },

  fromDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primaryGradStart,
    backgroundColor: Colors.white,
    flexShrink: 0,
  },

  toDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.purple500,
    borderWidth: 2,
    borderColor: Colors.white,
    flexShrink: 0,
  },

  routeInput: { flex: 1 },

  routeLabel: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
    lineHeight: 10,
    textTransform: 'uppercase',
  },

  input: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
    paddingVertical: 4,
    letterSpacing: Typography.letterSpacing.stat,
  },

  sectionLabel: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
  },

  recentList: { flex: 1 },

  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },

  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  recentText: { flex: 1 },

  recentName: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.stat,
    lineHeight: 20,
  },

  recentLabel: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.stat,
    lineHeight: 15,
  },

  searchBtn: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  scrollableContent: {
    flex: 1,
    width: '100%',
  },
  recentContainer: {
    width: '100%',
    marginBottom: Spacing.sm,
  },
  filterSection: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  filterLabel: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs - 1,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipScroll: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderMid,
    backgroundColor: '#F8FAFC',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipLabel: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
  },
  activeChipLabel: {
    color: Colors.white,
  },
});
