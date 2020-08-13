<script>
  import { onMount } from "svelte";
  import * as THREE from 'three';

  export let asf;
  let mmdView = false;
  let nextBone = "nobone";

  onMount(() => {
    nextBone = asf.mmd.bonemap[asf.editor.currBone] ? asf.mmd.bonemap[asf.editor.currBone] : "nobone";
  })

  const setView = (view) => () => {
    if (view == 'mmd') {
      mmdView = true;
    } else {
      mmdView = false;
    }
  }

  const createTransforms = () => {
    asf.mmd.transforms[asf.editor.currBone] = {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler()
    }
  }

  const relinkBone = (n) => () => {
    asf.mmd.bonemap[asf.editor.currBone] = n;
    console.log(asf.mmd.bonemap)
  }

  const unlinkAll = () => {
    for (const entry in asf.mmd.bonemap) {
      asf.mmd.bonemap[entry] = "nobone";
    }
    console.log(asf.mmd.bonemap)
  }

  const quatToString = (quat) => {
    return `Quaternion(${quat.x}, ${quat.y}, ${quat.z}, ${quat.w})`;
  }

  const eulerToString = (euler) => {
    return `Euler(${euler.x}, ${euler.y}, ${euler.z})::${euler.order}`;
  }

  const vec3ToString = (vec) => {
    return `Vector3(${vec.x}, ${vec.y}, ${vec.z})`;
  }
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
    right: 50px;
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
  <div class="section-header">🖱️ INSPECTOR</div>
  <div class="section-description">
    <nav>
      <div class="skeleton-view-option" class:selected="{!mmdView}" on:click="{setView('asf')}">
        inspector
      </div>
      <span> | </span>
      <div class="skeleton-view-option" class:selected="{mmdView}" on:click="{setView('mmd')}">
        mmd post-transforms
      </div>
    </nav>
    {#if asf.loaded && mmdView}
      {#if asf.mmd.transforms[asf.editor.currBone]}
        <p>Set the MMD correction transforms that will be applied to the bone.</p>
        <b>transform x:</b>
        <input bind:value="{asf.mmd.transforms[asf.editor.currBone].position.x}" type="number" step="0.10"/><br/>
        <b>transform y:</b>
        <input bind:value="{asf.mmd.transforms[asf.editor.currBone].position.y}" type="number" step="0.10"/><br/>
        <b>transform z:</b>
        <input bind:value="{asf.mmd.transforms[asf.editor.currBone].position.z}" type="number" step="0.10"/><br/>
        <b>euler x:</b>
        <input bind:value="{asf.mmd.transforms[asf.editor.currBone].rotation.x}" type="number" step="0.0628"/><br/>
        <b>euler y:</b>
        <input bind:value="{asf.mmd.transforms[asf.editor.currBone].rotation.y}" type="number" step="0.0628"/><br/>
        <b>euler z:</b>
        <input bind:value="{asf.mmd.transforms[asf.editor.currBone].rotation.z}" type="number" step="0.0628"/><br/>
      {:else}
        <p>No post-animated MMD transforms have been set for this bone.</p>
        <button on:click="{createTransforms}">Create empty MMD transforms</button>
      {/if}
    {:else if asf.loaded && !mmdView}
      {#if asf.editor.currBone == asf.root.name}
      <h3>Root Bone</h3>
      <ul>
        <li><b>id:</b> {asf.root.id}</li>
        <li><b>name:</b> {asf.root.name}</li>
        <li><b>order:</b> {asf.root.order}</li>
        <li><b>axis:</b> {asf.root.axis}</li>
        <li><b>position:</b> {asf.root.position}</li>
        <li><b>orientation:</b> {asf.root.orientation}</li>
      </ul>
      {:else}
      <h3>{asf.editor.currBone}</h3>
      <ul>
        <li><b>id:</b> {asf.bones[asf.editor.currBone].id}</li>
        <li><b>name:</b> {asf.bones[asf.editor.currBone].name}</li>
        <li><b>direction:</b> {asf.bones[asf.editor.currBone].direction}</li>
        <li><b>length:</b> {asf.bones[asf.editor.currBone].length}</li>
        <li><b>axis:</b> {asf.bones[asf.editor.currBone].axis}</li>
        <li><b>axis order:</b> {asf.bones[asf.editor.currBone].axis_order}</li>
        <li><b>dof:</b> {asf.bones[asf.editor.currBone].dof}</li>
        <li><b>constraints:</b> {asf.bones[asf.editor.currBone].limits}</li>
      </ul>
      {/if}
      <h3>Skeleton Properties</h3>
      {#if asf.three.skeleton.getBoneByName(asf.editor.currBone)}
      <ul>
        <li><b>uuid:</b> {asf.three.skeleton.getBoneByName(asf.editor.currBone).uuid}</li>
        <li><b>position:</b> {vec3ToString(asf.three.bones[asf.editor.currBone].position)}</li>
        <li><b>rotation:</b> {eulerToString(asf.three.bones[asf.editor.currBone].rotation)}</li>
        <li><b>quaternion:</b> {quatToString(asf.three.bones[asf.editor.currBone].quaternion)}</li>
      </ul>
      {:else}
      <p>Could not find the bone in the given skeleton.</p>
      {/if}
      <h3>MMD Properties</h3>
      {#if asf.mmd.loaded}
      <b>Current Linked: {asf.mmd.bonemap[asf.editor.currBone] ? asf.mmd.bonemap[asf.editor.currBone] : "no bone"}</b>
      <br/>
      <select bind:value={nextBone}>
        <option value="nobone">No Bone</option>
        {#each asf.mmd.skeleton.bones as bone}
          <option value="{bone.name}">{bone.name}</option>
        {/each}
      </select>
      <button on:click="{relinkBone(nextBone)}">Relink Bone</button>
      <button on:click="{relinkBone("nobone")}">Unlink Bone</button>
      <button on:click="{unlinkAll}">Unlink All Bones</button>
      {:else}
      <p>No MMD model loaded</p>
      {/if}
    {:else}
    <p>No element selected.</p>
    {/if}
  </div>
</section>
