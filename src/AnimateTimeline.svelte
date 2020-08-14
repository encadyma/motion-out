<script>
  import { AMCParser } from "./parser/amc";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let asf, amc;

  const setFrame = frame => () => {
    amc.player.frame = Math.max(0, Math.min(frame, amc.frameCount - 1));
    asf.frameUpdate(amc.frames[amc.player.frame]);
    dispatch("update");
  };

  const toggleBake = () => {
    asf.editor.isBaking = !asf.editor.isBaking;
  };

  const startBake = () => {
    console.log(asf.bake(amc.frames, amc.metadata.name));
    asf = asf;
  };

  const playBake = () => {
    console.log(asf.baked.action.play());
    asf = asf;
  };

  const stopPlayBake = () => {
    console.log(asf.baked.action.stop());
    asf = asf;
  };

  const slowPlay = () => {
    if (amc.player.playInterval == null) {
      amc.player.playInterval = setInterval(() => {
        amc.player.frame = (amc.player.frame + 1) % amc.frameCount;
        asf.frameUpdate(amc.frames[amc.player.frame]);
        dispatch("update");
      }, Math.floor(1000 / amc.player.fps));
    }
  };

  const toggleFPS = () => {
    if (amc.player.fps == 10) {
      amc.player.fps = 24;
    } else if (amc.player.fps == 24) {
      amc.player.fps = 30;
    } else if (amc.player.fps == 30) {
      amc.player.fps = 60;
    } else if (amc.player.fps == 60) {
      amc.player.fps = 120;
    } else if (amc.player.fps == 120) {
      amc.player.fps = 1000;
    } else if (amc.player.fps == 1000) {
      amc.player.fps = 1;
    } else {
      amc.player.fps = 10;
    }
  };

  const stopPlay = () => {
    clearInterval(amc.player.playInterval);
    amc.player.playInterval = null;
  };
</script>

<style>
  section {
    background: #2e2e2e;
    color: #eee;
    font-size: 0.8em;
    height: 150px;
    max-height: 150px;
    width: calc(100vw - 100px);
    position: absolute;
    bottom: 60px;
    left: 50px;
    z-index: 100;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
  }

  .section-header {
    background: #4451ff;
    font-weight: 700;
    padding: 5px 20px;
  }

  .section-description {
    padding: 10px 20px;
  }
</style>

<section>
  <div class="section-header">🏃‍♀️ TIMELINE</div>
  <div class="section-description">
    {#if amc.loaded && asf.editor.isBaking}
      <h3>baking view</h3>
      <button on:click={toggleBake} disabled={amc.player.playInterval != null || !asf.loaded}>
        toggle bake view
      </button>
      <button on:click={startBake} disabled={amc.player.playInterval != null || !asf.loaded}>
        bake frames to animation
      </button>
      {#if asf.baked.action && asf.baked.action.isRunning()}
        <button on:click={stopPlayBake} disabled={!asf.baked.status || !asf.loaded}>
          stop baked animation ({asf.baked.status ? "ready" : "not loaded"})
        </button>
      {:else}
        <button on:click={playBake} disabled={!asf.baked.status || !asf.loaded}>
          play baked animation ({asf.baked.status ? "ready" : "not loaded"})
        </button>
      {/if}
    {:else if amc.loaded && !asf.editor.isBaking}
      <h3>frame {amc.player.frame}</h3>
      <button on:click={toggleBake} disabled={amc.player.playInterval != null || !asf.loaded}>
        toggle bake view
      </button>
      <button on:click={setFrame(0)} disabled={amc.player.playInterval != null}>
        first frame
      </button>
      <button
        on:click={setFrame(amc.player.frame - 1)}
        disabled={amc.player.playInterval != null}>
        frame -1
      </button>
      {#if amc.player.playInterval != null}
        <button on:click={stopPlay}>slow stop ({amc.player.fps} fps)</button>
      {:else}
        <button
          on:click={slowPlay}
          title="uses Javascript setInterval to play back animation">
          slow play ({amc.player.fps} fps)
        </button>
      {/if}
      <button on:click={toggleFPS} disabled={amc.player.playInterval != null}>
        toggle fps
      </button>
      <button
        on:click={setFrame(amc.player.frame + 1)}
        disabled={amc.player.playInterval != null}>
        frame +1
      </button>
      <button
        on:click={setFrame(amc.frameCount - 1)}
        disabled={amc.player.playInterval != null}>
        last frame
      </button>
    {:else}
      <p>Load some motion data first!</p>
    {/if}
  </div>
</section>
