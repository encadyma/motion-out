<script>
  import TweakTree from './TweakTree.svelte';
  import { createEventDispatcher } from "svelte";
  import WalkASF from "../assets/asf/walk.asf";

  const dispatch = createEventDispatcher();
  export let asf;
</script>

<style>
  section {
    background: #2e2e2e;
    color: #eee;
    font-size: 0.8em;
    max-width: 350px;
    max-height: 60vh;
    overflow-y: auto;
    position: absolute;
    top: 135px;
    left: 50px;
    z-index: 100;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.2);
  }

  .section-header {
    background: #055720;
    font-weight: 700;
    padding: 5px 20px;
  }

  .section-description {
    padding: 10px 20px;
  }
</style>

<section>
  <div class="section-header">🖱️ TWEAK PANEL</div>
  <div class="section-description">
    {#if asf.loaded}
    <TweakTree bind:name="{asf.root.name}" bind:tree="{asf.tree}" bind:asf/>
    {:else}
    <p>Skeleton not loaded.</p>
    {/if}
  </div>
</section>
