<section>
<div class="section-header">🏃‍♀️ ANIMATE PANEL</div>
<div class="section-description">
<p>Select an .AMC (CMU) Motion Capture file from the list below.</p>
<select bind:value="{selectedAMC}" disabled="{amc.player.playInterval != null}">
  {#each Object.keys(AMC_FILES) as amcgroup}
    <optgroup label="{amcgroup}">
      {#each AMC_FILES[amcgroup] as amcObj}
        <option value="{amcObj}">{amcObj.name} ({amcObj.name}.amc)</option>
      {/each}
    </optgroup>
  {/each}
</select>
<button on:click="{processAMC(selectedAMC)}" disabled="{amc.player.playInterval != null}">Process AMC file</button>
<h3>Skeleton Info</h3>
<ul>
<li><b>Name:</b> {asf.metadata.name}</li>
<li><b>ASF Version:</b> {asf.metadata.version}</li>
<li><b>Namespace:</b> {asf.metadata.namespace}</li>
</ul>
<h3>Animation Info</h3>
<ul>
<li><b>Name:</b> {amc.metadata.name}</li>
<li><b>Total Frames:</b> {amc.frameCount}</li>
</ul>
</div>
</section>

<script>
import { AMCParser } from './parser/amc';
import { AMC_FILES } from "./parser/constants";

let selectedAMC;
export let asf, amc;

const processAMC = amcObj => async () => {
    // Setup the XMLHttpRequest for reading
    // the file location
    try {
      const data = await (await fetch(amcObj.src)).text();
      amc = new AMCParser();
      amc.setName(amcObj.name);
      amc.tokenize(data);
      amc.process();
      amc = amc;
    } catch (e) {
      alert("could not load the file @ " + file + "!");
      console.error("could not load the file @ " + file + "!", e);
    }
};
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
    background: #4451ff;
    font-weight: 700;
    padding: 5px 20px;
}

.section-description {
    padding: 10px 20px;
}
</style>