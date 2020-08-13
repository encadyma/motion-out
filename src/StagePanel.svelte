<script>
  import { ASFParser } from "./parser/asf";
  import { MMD_FILES, STAGE_FILES } from "./parser/constants";
  import * as THREE from 'three';
  import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
  import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader';
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let selectedModel, selectedScene, statusMsg = 'ready to load';
  export let asf, amc, scene;

  const processModel = modelObj => async () => {
    if (asf.mmd.mesh) {
      scene.remove(asf.mmd.mesh);
      scene.remove(asf.mmd.helper);
      asf.mmd.mesh = null;
      asf.mmd.helper = null;
      statusMsg = 'mesh unloaded';
      asf.mmd.loaded = false;
    }

    if (modelObj && asf.loaded) {
      let loader;
      if (modelObj.type == "MMD") {
        loader = new MMDLoader();
      } else {
        loader = new FBXLoader();
      }

      loader.load(
        modelObj.src,
        function (mesh) {
          console.log(mesh);
          // Method 1: changing the skeleton forcibly
          // mesh.skeleton = asf.three.skeleton;
          
          if (modelObj.id == "trackerman") {
            // Special handling for FBX...
            // TODO: move this to a data property
            asf.mmd.mesh = mesh;
            asf.mmd.skeleton = asf.mmd.mesh.children[2].children[6].skeleton;
            asf.mmd.mesh.scale.copy(new THREE.Vector3(0.2, 0.2, 0.2));
          } else {
            asf.mmd.mesh = mesh;
            asf.mmd.skeleton = mesh.skeleton;
            asf.mmd.mesh.scale.copy(new THREE.Vector3(1 / 0.65, 1 / 0.65, 1 / 0.65));
          }
          
          asf.mmd.helper = new THREE.SkeletonHelper(asf.mmd.skeleton.bones[0]);
          asf.mmd.metadata = modelObj;
          asf.mmd.bonemap = modelObj.bonemap;
          asf.mmd.transforms = modelObj.transforms;

          statusMsg = `${modelObj.name} character loaded`;

          scene.add(asf.mmd.helper);
          scene.add(asf.mmd.mesh);
          statusMsg = `${modelObj.name} character added to scene. Rendering may take a while.`;
          asf.mmd.loaded = true;
        },
        function (xhr) {
          statusMsg = 'MMD ' + Math.round( xhr.loaded / xhr.total * 100 ) + '% loaded';
        },
        function (error) {
          statusMsg = `An error happened while loading the character`;
          console.log( 'An error happened' );
          console.error(error);
        }
      );
    } else if (!asf.loaded) {
      statusMsg = 'A skeleton must be loaded in from the Pose Panel first!';
    }
  }

  const processStage = sceneObj => async () => {
    if (asf.three.stage) {
      scene.remove(asf.three.stage);
      asf.three.stage = null;
    }

    if (sceneObj) {
      let loader;

      switch (sceneObj.type) {
        case "COLLADA":
          loader = new ColladaLoader();
          break;
        case "GLTF":
          loader = new GLTFLoader();
          break;
        default:
          statusMsg = "unknown type!";
          console.error("unknown type " + sceneObj.type);
          return;
      }

      loader.load(
        sceneObj.src,
        function (mesh) {
          console.log(mesh);
          asf.three.stage = mesh.scene;

          if (sceneObj.scale) {
            asf.three.stage.scale.copy(new THREE.Vector3(sceneObj.scale, sceneObj.scale, sceneObj.scale));
          }
          
          statusMsg = `${sceneObj.name} stage loaded`;

          scene.add(asf.three.stage);
          statusMsg = `${sceneObj.name} stage added to scene`;
          asf.three.loaded = true;
        },
        function (xhr) {
          statusMsg = 'stage ' + Math.round( xhr.loaded / xhr.total * 100 ) + '% loaded';
        },
        function (error) {
          statusMsg = `An error happened while loading the scene`;
          console.log( 'An error happened' );
          console.error(error);
        }
      );
    }
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
    background: #ffb120;
    font-weight: 700;
    padding: 5px 20px;
  }

  .section-description {
    padding: 10px 20px;
  }
</style>

<section>
  <div class="section-header">🎭 STAGE PANEL</div>
  <div class="section-description">
    <p><b>(Experimental)</b> Select a bundled character model from the list below.</p>
    <select bind:value="{selectedModel}">
      <option value="{null}">No Model</option>
      {#each Object.values(MMD_FILES) as model}
        <option value="{model}">{model.name} ({model.author})</option>
      {/each}
    </select>
    <button on:click="{processModel(selectedModel)}">
      Process Model
    </button>
    <p>Select a bundled scene from the list below.</p>
    <select bind:value="{selectedScene}">
      <option value="{null}">No Stage</option>
      {#each Object.values(STAGE_FILES) as stage}
        <option value="{stage}">{stage.name}</option>
      {/each}
    </select>
    <button on:click="{processStage(selectedScene)}">
      Process Scene
    </button>
    <div><b>status:</b> {statusMsg}</div>
    {#if selectedScene != null}
    <div><b>scene description:</b> {selectedScene.description}</div>
    {/if}
  </div>
</section>
