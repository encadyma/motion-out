<section>
<div class="section-header">🏃‍♀️ KEY INSPECTOR</div>
<div class="section-description">
{#if amc.loaded}
<h3>frame {amc.player.frame}</h3>
{#each Object.entries(amc.frames[amc.player.frame]) as data}
<div class="key-item">
<b class="key-item-name">{data[0]}</b>
<span class="key-item-attributes">
{#each data[1] as kdata}
<span class="key-item-attr">{kdata}</span>
{/each}
</span>
</div>
{/each}
{:else}
<p>Nothing to inspect</p>
{/if}
</div>
</section>

<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
export let asf, amc;
</script>

<style>
section {
    background: #2e2e2e;
    color: #eee;
    font-size: 0.8em;
    max-width: 450px;
    max-height: 60vh;
    overflow-y: auto;
    position: absolute;
    top: 135px;
    right: 50px;
    z-index: 100;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.2);
}

.section-header {
    background: #4451ff;
    font-weight: 700;
    padding: 5px 20px;
}

.section-description {
    padding: 10px 20px;
}

.key-item-attr {
    display: inline-block;
    margin: 0 2px;
    padding: 4px;
}

.key-item-attr:hover {
    background: rgba(0, 0, 0, 0.2);
    color: rgba(255, 255, 255, 0.6);
}
</style>