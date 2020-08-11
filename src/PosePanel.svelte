<script>
  import { ASFParser } from "./parser/asf";
  import { ASF_FILES } from "./parser/constants";
  import { createEventDispatcher, tick } from "svelte";
  import WalkASF from "../assets/asf/walk.asf";
  import GolfASF from "../assets/asf/golf.asf";

  const dispatch = createEventDispatcher();
  let selectedASF;
  export let asf, amc, scene;

  const processASF = file => async () => {
    // Setup the XMLHttpRequest for reading
    // the file location
    try {
      const data = await (await fetch(file)).text();

      if (asf.three.enabled) {
        scene.remove(asf.three.helper);
        scene.remove(asf.three.container);
      }
      asf = new ASFParser();
      console.log(asf.tokenize(data));
      asf.process();
      console.log(asf.construct());
      scene.add(asf.three.helper);
      scene.add(asf.three.container);
      asf = asf;
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
    background: #ff4444;
    font-weight: 700;
    padding: 5px 20px;
  }

  .section-description {
    padding: 10px 20px;
  }
</style>

<section>
  <div class="section-header">💃 POSE PANEL</div>
  <div class="section-description">
    <p>Select a bundled .ASF (CMU) skeleton file from the list below.</p>
    <select bind:value="{selectedASF}" disabled="{amc.player.playInterval != null}">
      {#each Object.values(ASF_FILES) as asf}
        <option value="{asf.src}">{asf.name} ({asf.id}.asf)</option>
      {/each}
    </select>
    <button disabled="{amc.player.playInterval != null}" on:click="{processASF(selectedASF)}">
      Process ASF skeleton file
    </button>
    <h3>Skeleton Info</h3>
    <ul>
      <li>
        <b>Name:</b>
        {asf.metadata.name}
      </li>
      <li>
        <b>ASF Version:</b>
        {asf.metadata.version}
      </li>
      <li>
        <b>Namespace:</b>
        {asf.metadata.namespace}
      </li>
    </ul>
    <h3>Unit Info</h3>
    <ul>
      <li>
        <b>Mass:</b>
        {asf.metadata.units.mass}
      </li>
      <li>
        <b>Length:</b>
        {asf.metadata.units.length}
      </li>
      <li>
        <b>Angle Mode:</b>
        {asf.metadata.units.angle}
      </li>
    </ul>
    <h3>File Info</h3>
    <p>{asf.metadata.documentation}</p>
  </div>
</section>
