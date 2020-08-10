<section>
<div class="section-header">🏃‍♀️ TIMELINE</div>
<div class="section-description">
{#if amc.loaded}
<h3>frame {amc.player.frame}</h3>
<button on:click="{setFrame(0)}" disabled="{amc.player.playInterval != null}">first frame</button>
<button on:click="{setFrame(amc.player.frame - 1)}" disabled="{amc.player.playInterval != null}">frame -1</button>
{#if amc.player.playInterval != null}
<button on:click="{stopPlay}">stop ({amc.player.fps} fps)</button>
{:else}
<button on:click="{slowPlay}">play ({amc.player.fps} fps)</button>
{/if}
<button on:click="{toggleFPS}" disabled="{amc.player.playInterval != null}">toggle fps</button>
<button on:click="{setFrame(amc.player.frame + 1)}" disabled="{amc.player.playInterval != null}">frame +1</button>
<button on:click="{setFrame(amc.frameCount - 1)}" disabled="{amc.player.playInterval != null}">last frame</button>
{:else}
<p>Load some motion data first!</p>
{/if}
</div>
</section>

<script>
import { AMCParser } from './parser/amc';
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
export let asf, amc;

const setFrame = (frame) => () => {
    amc.player.frame = Math.max(0, Math.min(frame, amc.frameCount - 1));
    asf.frameUpdate(amc.frames[amc.player.frame]);
    dispatch('update');
}

const slowPlay = () => {
    if (amc.player.playInterval == null) {
        amc.player.playInterval = setInterval(() => {
            amc.player.frame = (amc.player.frame + 1) % amc.frameCount;
            asf.frameUpdate(amc.frames[amc.player.frame]);
            dispatch('update');
        }, Math.round(1000 / amc.player.fps));
    }
}

const toggleFPS = () => {
    if (amc.player.fps == 10) {
        amc.player.fps = 24;
    } else if (amc.player.fps == 24) {
        amc.player.fps = 30;
    } else if (amc.player.fps == 30) {
        amc.player.fps = 60;
    } else {
        amc.player.fps = 10;
    }
}

const stopPlay = () => {
    clearInterval(amc.player.playInterval);
    amc.player.playInterval = null;
}
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
    bottom: 50px;
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