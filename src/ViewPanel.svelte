<section>
<div class="section-header">👁️ VIEW PANEL</div>
<div class="section-description">
<h3>About</h3>
<p>This project will focus on bringing motion data alive from CMU’s motion capture database onto a web platform (WebGL/HTML5 Canvas). Much of the challenge will come from translating the motion capture data (distributed in ASF/AMC/C3D) into useful movements for our skeleton and designing a system capable of rendering out these motions accurately and efficiently. With the goal of portability in mind, this project will also allow users to tweak the motion data and animate it on a given 3D character model.</p>
<h3>Scene Information</h3>
<ul>
<li><b>Skeleton:</b>
{#if asf.loaded}
<span style="color: aqua;">{asf.metadata.name}</span>
{:else}
<span style="color: red;">Not loaded</span>
{/if}
</li>
<li><b>Motion:</b>
{#if amc.loaded}
<span style="color: violet;">{amc.metadata.name}</span>
{:else}
<span style="color: red;">Not loaded</span>
{/if}
</li>
<li>Playback FPS: {amc.player.fps} fps</li>
</ul>
<h3>Controls</h3>
<label>
<input type="checkbox" bind:checked="{asf.editor.shouldRotate}"/>
Enable camera auto-rotation
</label>
<h3>Credits</h3>
<p>Project by Kevin Mo (<a href="https://github.com/encadyma" target="_blank">@encadyma</a>).</p>
<p>The data used in this project was obtained from mocap.cs.cmu.edu.
The database was created with funding from NSF EIA-0196217.</p>
</div>
</section>

<script>
export let asf, amc;
</script>

<style>
section {
    background: #2e2e2e;
    color: #eee;
    font-size: 0.8em;
    max-width: 350px;
    position: absolute;
    top: 135px;
    left: 50px;
    z-index: 100;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.2);
}

.section-header {
    background: #ff00ff;
    font-weight: 700;
    padding: 5px 20px;
}

.section-description {
    padding: 10px 20px;
}
</style>