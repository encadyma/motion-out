<div class="tweak-tree">
    <div class="tweak-tree-head" class:tweak-tree-head-selected="{asf.editor.currBone == name}" on:click="{changeSelected}" on:dblclick="{toggleOpen}">
    <span class="tweak-tree-toggle" on:click="{toggleOpen}">{asf.editor.openedBones[name] ? "-" : ">"}</span>
    <span>{name}</span>
    </div>
    {#if asf.editor.openedBones[name] && tree != null && Object.keys(tree).length > 0}
    <div class="tweak-tree-family">
        {#each Object.keys(tree) as child}
        <svelte:self bind:name="{child}" bind:tree="{tree[child]}" bind:asf/>
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
import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher();
export let name, tree, asf;

const toggleOpen = () => {
    asf.editor.openedBones[name] = !asf.editor.openedBones[name];
    dispatch('update');
}

const changeSelected = () => {
    asf.editor.currBone = name;
    dispatch('update');
}
</script>