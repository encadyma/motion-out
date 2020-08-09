<section>
<div class="section-header">💃 POSE PANEL</div>
<div class="section-description">
<p>Select a bundled .ASF (CMU) skeleton file, or upload your own.</p>
<button on:click="{processSmallASF}">Process sample ASF file</button><br/>
<button on:click="{processASF}">Process full walk ASF file</button>
<h3>Skeleton Info</h3>
<ul>
<li><b>Name:</b> {asf.metadata.name}</li>
<li><b>ASF Version:</b> {asf.metadata.version}</li>
<li><b>Namespace:</b> {asf.metadata.namespace}</li>
</ul>
<h3>Unit Info</h3>
<ul>
<li><b>Mass:</b> {asf.metadata.units.mass}</li>
<li><b>Length:</b> {asf.metadata.units.length}</li>
<li><b>Angle Mode:</b> {asf.metadata.units.angle}</li>
</ul>
<h3>File Info</h3>
<p>{asf.metadata.documentation}</p>
</div>
</section>

<script>
import { ASFParser, SMALL_ASF } from './parser/asf';
import { createEventDispatcher } from 'svelte';
import WalkASF from '../assets/asf/walk.asf';

const dispatch = createEventDispatcher();
export let asf;

const processSmallASF = () => {
    asf = new ASFParser();
    console.log(asf.tokenize(SMALL_ASF));
    asf.process();
    dispatch('update');
}

const processASF = () => {
    asf = new ASFParser();
    console.log(asf.tokenize(WalkASF));
    asf.process();
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
    background: #ff4444;
    font-weight: 700;
    padding: 5px 20px;
}

.section-description {
    padding: 10px 20px;
}
</style>