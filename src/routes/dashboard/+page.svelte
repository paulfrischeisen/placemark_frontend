<script>
    import Header from '$lib/Header.svelte';
    import MainNavigator from '$lib/MainNavigator.svelte';
    import PlacemarkMap from "$lib/PlacemarkMap.svelte";
    import PlacemarkForm from "$lib/PlacemarkForm.svelte";
</script>

<Header>
    <MainNavigator />
</Header>

<div class="columns is-vcentered">
    <div class="column has-text-centered">
        <PlacemarkMap seeAll={true}/>
    </div>

    <div class="column box has-text-centered">
        <h1 class="title is-4">Create a new Placemark</h1>
        <PlacemarkForm/>
    </div>
</div>