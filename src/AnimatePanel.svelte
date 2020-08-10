<section>
<div class="section-header">🏃‍♀️ ANIMATE PANEL</div>
<div class="section-description">
<p>Select an .AMC (CMU) Motion Capture file, or upload your own.</p>
<button on:click="{processAMC(Walk3AMC)}">Process walk3 AMC file</button>
<button on:click="{processAMC(Golf1AMC)}">Process golf1 AMC file</button>
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
import { createEventDispatcher } from 'svelte';
import Walk3AMC from '../assets/amc/walk_03.amc';
import Golf1AMC from '../assets/amc/golf_01.amc';

const dispatch = createEventDispatcher();
export let asf, amc;

const processAMC = (file) => () => {
    amc = new AMCParser();
    amc.setName("Walk_3");
    console.log(amc.tokenize(file));
    amc.process();
    dispatch('update');
}
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