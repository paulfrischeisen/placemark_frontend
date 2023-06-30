<script>
    import { user } from "../stores.js";
    export let title = '';
    export let subTitle = '';
</script>

<div class="box has-text-centered columns m-2">
    <div class="column">
        <div class="title is-5">{title}</div>
        <div class="subtitle is-5">{subTitle}</div>
    </div>
    <div class="column">
        {#if $user.email}
            <div class="is-size-7">currently logged in: {$user.email}</div>
        {:else}
            <div class="is-size-7">RockExplorer</div>
        {/if}
    </div>
</div>
