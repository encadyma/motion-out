<script>
  import TweakTree from './TweakTree.svelte';
  import TweakThreeTree from './TweakThreeTree.svelte';

  const setView = (view) => () => {
    if (view == 'mmd') {
      asf.editor.mmdView = true;
    } else {
      asf.editor.mmdView = false;
    }
  }

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

  .skeleton-view-option {
    display: inline-block;
    cursor: pointer;
  }

  .skeleton-view-option:hover {
    text-decoration: underline;
  }

  .skeleton-view-option.selected {
    color: magenta;
    text-decoration: underline;
    font-weight: 600;
  }
</style>

<section>
  <div class="section-header">🖱️ SKELETON TREE</div>
  <div class="section-description">
    <nav>
      <div class="skeleton-view-option" class:selected="{!asf.editor.mmdView}" on:click="{setView('asf')}">
        asf view
      </div>
      <span> | </span>
      <div class="skeleton-view-option" class:selected="{asf.editor.mmdView}" on:click="{setView('mmd')}">
        mmd view
      </div>
    </nav>
    {#if asf.loaded && !asf.editor.mmdView}
    <TweakTree bind:name="{asf.root.name}" bind:tree="{asf.tree}" bind:asf/>
    {:else if asf.editor.mmdView && asf.mmd.loaded}
    <TweakThreeTree bind:bone="{asf.mmd.skeleton.bones[0]}" bind:asf/>
    {:else}
    <p>Skeleton not loaded.</p>
    {/if}
  </div>
</section>
