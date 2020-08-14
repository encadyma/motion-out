<script>
  import AppHeader from "./Header.svelte";
  import ViewPanel from "./ViewPanel.svelte";
  import PosePanel from "./PosePanel.svelte";
  import PoseInspector from "./PoseInspector.svelte";
  import TweakPanel from "./TweakPanel.svelte";
  import TweakInspector from "./TweakInspector.svelte";
  import AnimatePanel from "./AnimatePanel.svelte";
  import AnimateInspector from "./AnimateInspector.svelte";
  import AnimateTimeline from "./AnimateTimeline.svelte";
  import StagePanel from "./StagePanel.svelte";
  import NullPanel from "./NullPanel.svelte";
  import AppFooter from "./Footer.svelte";
  import Scene from "./Scene.svelte";

  import { writable } from "svelte/store";
  import { AMCParser } from "./parser/amc";
  import { ASFParser } from "./parser/asf";

  let selectedView = "view";
  let amc = new AMCParser();
  let asf = new ASFParser();
  let scene;
  let alerts = writable([]);
</script>

<style>

</style>

<main>
  <AppHeader bind:selectedView bind:asf />
  {#if !asf.editor.hidden}
    <div>
      {#if selectedView == 'view'}
        <ViewPanel bind:asf bind:amc />
      {:else if selectedView == 'pose'}
        <PosePanel bind:asf bind:amc bind:scene />
        <PoseInspector bind:asf />
      {:else if selectedView == 'tweak'}
        <TweakPanel bind:asf />
        <TweakInspector bind:asf />
      {:else if selectedView == 'animate'}
        <AnimatePanel bind:asf bind:amc />
        <AnimateInspector bind:asf bind:amc />
        <AnimateTimeline bind:asf bind:amc />
      {:else if selectedView == 'stage'}
        <StagePanel bind:asf bind:amc bind:scene />
      {:else}
        <NullPanel />
      {/if}
    </div>
  {/if}
  <AppFooter bind:asf />
  <Scene bind:asf bind:scene />
</main>
