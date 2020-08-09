<script>
import AppHeader from './Header.svelte';
import ViewPanel from './ViewPanel.svelte';
import PosePanel from './PosePanel.svelte';
import PoseInspector from './PoseInspector.svelte';
import NullPanel from './NullPanel.svelte';
import Scene from './Scene.svelte';

import { writable } from 'svelte/store';
import { ASFParser } from './parser/asf';

let selectedView = 'view';
let asf = new ASFParser();
let alerts = writable([]);
</script>

<main>
	<AppHeader bind:selectedView/>
	{#if selectedView == 'view'}
	<ViewPanel bind:asf/>
	{:else if selectedView == 'pose'}
	<PosePanel bind:asf/>
	<PoseInspector bind:asf/>
	{:else}
	<NullPanel/>
	{/if}
	<Scene/>
</main>

<style>

</style>