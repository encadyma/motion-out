<script>
import AppHeader from './Header.svelte';
import ViewPanel from './ViewPanel.svelte';
import PosePanel from './PosePanel.svelte';
import PoseInspector from './PoseInspector.svelte';
import TweakPanel from './TweakPanel.svelte';
import TweakInspector from './TweakInspector.svelte';
import AnimatePanel from './AnimatePanel.svelte';
import AnimateInspector from './AnimateInspector.svelte';
import AnimateTimeline from './AnimateTimeline.svelte';
import NullPanel from './NullPanel.svelte';
import Scene from './Scene.svelte';

import { writable } from 'svelte/store';
import { AMCParser } from './parser/amc';
import { ASFParser } from './parser/asf';

let selectedView = 'view';
let amc = new AMCParser();
let asf = new ASFParser();
let scene;
let alerts = writable([]);
</script>

<main>
	<AppHeader bind:selectedView/>
	{#if selectedView == 'view'}
	<ViewPanel bind:asf bind:amc/>
	{:else if selectedView == 'pose'}
	<PosePanel bind:asf bind:scene/>
	<PoseInspector bind:asf/>
	{:else if selectedView == 'tweak'}
	<TweakPanel bind:asf/>
	<TweakInspector bind:asf/>
	{:else if selectedView == 'animate'}
	<AnimatePanel bind:asf bind:amc/>
	<AnimateInspector bind:asf bind:amc/>
	<AnimateTimeline bind:asf bind:amc/>
	{:else}
	<NullPanel/>
	{/if}
	<Scene bind:asf bind:scene/>
</main>

<style>

</style>