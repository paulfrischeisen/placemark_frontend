<script>
    import {page} from '$app/stores';
    import {onDestroy, onMount} from 'svelte';
    import PlacemarkMap from "$lib/PlacemarkMap.svelte";
    import {placemarkService} from "../../../services/placemark-service.js";
    import MainNavigator from "$lib/MainNavigator.svelte";
    import Header from "$lib/Header.svelte";
    import ImageSelection from "$lib/ImageSelection.svelte";
    import {imageSuccessfullyUploaded} from "../../../stores.js";
    import {get} from "svelte/store";

    let id;
    let placemark;
    let user;
    let location;
    let isEditable = false;
    let imageUploadStatus = false;
    let successUploadingImage = false;

    let editableValues = {
        "title": null,
        "lat": null,
        "lng": null,
        "description": null,
        "category": null
    }

    onMount(load);

    let unsubscribe = imageSuccessfullyUploaded.subscribe(value => {
        if (value) {
            if (value.success === false) {
                successUploadingImage = false;
            } else {
                placemark = get(imageSuccessfullyUploaded);
                successUploadingImage = true;
            }
            imageSuccessfullyUploaded.set(null);
            imageUploadStatus = true;
            //after 5000 ms the status is being set to false and the application times out
            setTimeout(() => {
                imageUploadStatus = false;
            }, 5000);
        }
    });

    onDestroy(() => {
        unsubscribe();
    });

    async function load() {
        id = $page.params.id;
        placemark = await placemarkService.getPlacemark(id);
        location = { lat: placemark.lat, lng: placemark.lng };
        isEditable = false;

        editableValues["title"] = placemark.name;
        editableValues["lat"] = placemark.lat;
        editableValues["lng"] = placemark.lng;
        editableValues["description"] = placemark.description;
        editableValues["category"] = placemark.category;

        user = await placemarkService.getUser(placemark.user);
    }

    async function toggleEditable() {
        //to always toggle you can just use the opposite of the value every time
        isEditable = !isEditable;

        if (!isEditable) {
            placemark = await placemarkService.updatePlacemark(id , {
                name: editableValues["title"],
                lat: editableValues["lat"],
                lng: editableValues["lng"],
                description: editableValues["description"],
                category: editableValues["category"]
            });
        }
    }

    function updateValues(event) {
        const id = event.target.id;
        editableValues[id] = event.target.innerText;
    }


    $: {
        let reloadID = $page.params.id;
        if (reloadID !== id) {
            load();
        }
    }
</script>


<Header>
    <MainNavigator/>
</Header>

<div class="card box m-2">
    {#if placemark && user}
        {#each [placemark] as p (p)}
            <header class="card-header">
                <p id="title" class="card-header-title is-size-3 has-text-centered is-centered" contenteditable={isEditable}
                   on:input={updateValues}>
                    {editableValues["title"]}
                </p>

                <button class="button my-auto mr-3" on:click={toggleEditable}>
                    {#if isEditable}
                        <i class="fas fa-save fa-lg"></i>
                    {:else}
                        <i class="fas fa-edit fa-lg"></i>
                    {/if}
                </button>
            </header>

            <div class="card-content">
                <div class="content">
                    <div class="columns">

                        <div class="column">
                            <PlacemarkMap id="street-map" marker={p} see={false} zoom={15} height={50}/>
                        </div>

                        <div class="column is-half">
                            <PlacemarkMap id="satellite-map" marker={p} see={false} zoom={15} height={50} showLayer="Satellite"/>
                        </div>

                    </div>
                    <div class="columns">

                        <div class="column is-half">
                            <PlacemarkMap id="all-marker-map" see={true} height={50} location={location}/>
                        </div>

                        <div class="column is-half">
                            <table class="table is-fullwidth table is-bordered table is-striped">
                                <tbody>
                                <tr>
                                    <td>Latitude</td>
                                    <td id="lat" contenteditable={isEditable} on:input={updateValues}>{editableValues["lat"]}</td>
                                </tr>
                                <tr>
                                    <td>Longitude</td>
                                    <td id="lng" contenteditable={isEditable} on:input={updateValues}>{editableValues["lng"]}</td>
                                </tr>
                                </tbody>
                            </table>

                            <p id="description" contenteditable={isEditable} on:input={updateValues}> {editableValues["description"] } </p>

                            <br/>

                            <p> Category: <span id="category" contenteditable={isEditable} on:input={updateValues}>{editableValues["category"]}</span> </p>


                            <table class="table is-fullwidth table is-bordered table is-striped">
                                <tbody>
                                <tr>
                                    <td>Creator of the Placemark: </td>
                                    <td>{user.firstName + user.lastName}</td>
                                </tr>
                                <tr>
                                    <td>E-Mail: </td>
                                    <td>{user.email}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>

        {:else}
            <div class="card-content">
                <div class="content">
                    <p class="has-text-centered is-size-3">Loading...</p>
                </div>
            </div>
        {/each}
    {/if}
</div>