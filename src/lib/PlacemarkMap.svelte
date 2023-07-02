<script>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-nocheck

    // import "leaflet/dist/leaflet.css";
    // import { LeafletMap } from "../services/leaflet-map";
    import { onMount } from "svelte";
    import { placemarkService } from "../services/placemark-service";
    import { latestPlacemark } from "../stores";

    export let id = "placemark-map";
    export let height = 80;
    export let location = { lat: 49.026535336512985, lng: 12.116058810677156 };
    export let zoom = 8;
    export let minZoom = 1;
    export let activeLayer = "Terrain";
    export let marker = null;
    export let seeAll = false;

    const mapConfig = {
        location: location,
        zoom: zoom,
        minZoom: minZoom
    };
    let map;
    let categories = [];

    onMount(async () => {
        // await import("leaflet/dist/leaflet.css");
        const { LeafletMap } = await import("../services/leaflet-map.js");

        const map = new LeafletMap(id, mapConfig, activeLayer);
        map.showZoomControl();
        //map.addLayerGroup("Placemarks");
        //map.showLayerControl();

        if (seeAll === true){
            const placemarks = await placemarkService.getPlacemarks();

            placemarks.forEach((placemark) => {
                if (!categories.includes(placemark.category)){
                    categories.push(placemark.category);
                }
            });

            for (let i = 0; i < categories.length; i++){
                map.addLayerGroup(categories[i]);
            }
            map.showLayerControl();


            placemarks.forEach((placemark) => {
                addPlacemarkMarker(map, placemark);
            });
        }
        if(seeAll === false){
            addPlacemarkMarker(map, marker);
        }

    });

    function addPlacemarkMarker(map, placemark) {
        const placemarkStr = `<a href='/poi/${placemark._id}'> ${placemark.name} <small>(click for details}</small></a>`;
        map.addMarker({ lat: placemark.lat, lng: placemark.lng }, placemarkStr, placemark.category);
        map.moveTo(zoom, { lat: placemark.lat, lng: placemark.lng });
    }

    latestPlacemark.subscribe((placemark) => {
        if (placemark && map) {
            if (!categories.includes(placemark.category)) {
                map.addLayerGroup(placemark.category);
            }
            addPlacemarkMarker(map, placemark);
        }
    });

</script>

<div class="box" id={id} style="height:{height}vh"></div>