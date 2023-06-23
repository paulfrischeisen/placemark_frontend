<script>
    import Header from '$lib/Header.svelte';
    import WelcomeNavigator from "$lib/WelcomeNavigator.svelte";
</script>

<Header>
    <WelcomeNavigator />
</Header>

<div class="columns is-vcentered content">
    <div class="column has-text-centered">
        <img width="300" src="/boulder.png" alt="homer" />
    </div>
    <div class="column">
        <h1 class="title">Discover and Share Climbing Spots in Regensburg</h1>
        <p>Add whatever place you like and describe what you can do there!</p>
    </div>
</div>
