<script>
    // @ts-nocheck

    import "leaflet/dist/leaflet.css";
    import { LeafletMap } from "../services/leaflet-map";
    import { onMount } from "svelte";
    import { placemarkService } from "../services/placemark-service";
    import { latestPlacemark } from "../stores";

    export let id = "placemark-map";
    export let height = 80;
    export let location = { lat: 49.026535336512985, lng: 12.116058810677156 };
    export let zoom = 8;
    export let minZoom = 1;
    export let activeLayer = "Terrain";
    export let marker;
    export let see = false;

    const mapConfig = {
        location: location,
        zoom: zoom,
        minZoom: minZoom
    };
    let map;

    onMount(async () => {
        map = new LeafletMap(id, mapConfig, activeLayer);
        map.showZoomControl();
        map.addLayerGroup("Placemarks");
        map.showLayerControl();
        if (see === true) {
            const placemarks = await placemarkService.getPlacemarks();
            placemarks.forEach((placemark) => {
                addPlacemarkMarker(map, placemark);
            });
        }
        if (see === false){
            addPlacemarkMarker(map, marker);
            map.moveTo(zoom, { lat: marker.lat, lng: marker.lng });
        }
    });

    function addPlacemarkMarker(map, placemark) {
        const placemarkStr = `<a href='/poi/${placemark._id}'>${placemark.name} <small>(click for details}</small></a>`;
        map.addMarker({ lat: placemark.lat, lng: placemark.lng }, placemarkStr, "Placemarks");
    }

    latestPlacemark.subscribe((placemark) => {
        if (placemark && map) {
            addPlacemarkMarker(map, placemark);
            map.moveTo(zoom, { lat: placemark.lat, lng: placemark.lng });
        }
    });

</script>

<div class="box" id={id} style="height:{height}vh"></div>