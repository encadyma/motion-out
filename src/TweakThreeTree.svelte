<div class="tweak-tree">
    <div class="tweak-tree-head" class:tweak-tree-head-selected="{asf.mmd.currBone == bone.name}" on:click="{changeSelected}" on:dblclick="{toggleOpen}">
    <span class="tweak-tree-toggle" on:click="{toggleOpen}">{bone.userData.opened ? "-" : ">"}</span>
    <span>{bone.name}</span>
    </div>
    {#if bone.userData.opened && bone != null && bone.children.length > 0}
    <div class="tweak-tree-family">
        {#each bone.children as child}
        <svelte:self bind:bone="{child}" bind:asf/>
        {/each}
    </div>
    {/if}
</div>

<style>
.tweak-tree-family {
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    margin-left: 10px;
    padding-left: 5px;
}
.tweak-tree-head {
    cursor: pointer;
    padding: 4px;
    margin: 2px 0;
    border-radius: 4px;
    min-width: 150px;
}
.tweak-tree-head:hover {
    background: rgba(0, 0, 0, 0.2);
}
.tweak-tree-toggle {
    display: inline-block;
    padding: 0px 4px;
    border-radius: 4px;
}
.tweak-tree-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
}
.tweak-tree-head-selected {
    background: #055720 !important;
    font-weight: 700;
}
</style>

<script>
import { onMount, createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();
export let bone, asf;

onMount(() => {
    bone.userData.opened = false;
})

const toggleOpen = () => {
    bone.userData.opened = !bone.userData.opened;
    dispatch('update');
}

const changeSelected = () => {
    asf.mmd.currBone = bone.name;
    dispatch('update');
}
</script>