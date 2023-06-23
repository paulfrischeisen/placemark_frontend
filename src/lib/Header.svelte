<script>
    import TitleBar from './TitleBar.svelte';
</script>

<div class="columns is-vcentered">
    <div class="column is-two-thirds">
        <TitleBar title={'RockExplorer'}/>
    </div>
    <div class="column">
        <slot />
    </div>
</div>
