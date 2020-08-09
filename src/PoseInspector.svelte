<section>
<div class="section-header">💃 INSPECTOR</div>
<div class="section-description">
<ul class="tokens-list">
{#if asf.tokens.length > 0}
{#each asf.tokens as token, index}
<li title="[{token.type}] {token.words}" class="token-line token-type-{token.type.toLowerCase()}">
    <div>
    <span class="token-line-number">{index}</span>
    {#if token.type == "PROPERTY"}
    <span>&nbsp;&nbsp;<b>{token.words[0]}</b> <span style="color: violet;">{token.words.slice(1).join(' ')}</span></span>
    {:else if token.type == "STRING"}
    <span><i>{token.words.join(' ')}</i></span>
    {:else if token.type == "KEYWORD"}
    <span><b>:{token.words[0]}</b> <span style="color: aquamarine;">{token.words.slice(1).join(' ')}</span></span>
    {:else if token.type == "RELATION"}
    <span>&nbsp;&nbsp;<b>{token.words.join(' → ')}</b></span>
    {:else if token.type == "COMMENT"}
    <span>#{token.words.join(' ')}</span>
    {:else}
    <span>{token.words.join(' ')}</span>
    {/if}
    </div>
    <div class="token-line-type">{token.type}</div>
</li>
{/each}
{:else}
<li title="No tokens" class="token-line token-type-none">
    <div>
    <span class="token-line-number">0</span>
    <span>No tokens loaded</span>
    </div>
    <div class="token-line-type">SYSTEM</div>
</li>
{/if}
</ul>
</div>
</section>

<script>
import { ASFParser, SMALL_ASF } from './parser/asf';
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();
export let asf;

const processASF = () => {
    asf = new ASFParser();
    console.log(asf.tokenize(SMALL_ASF));
    dispatch('update');
}
</script>

<style>
section {
    background: #2e2e2e;
    color: #eee;
    font-size: 0.8em;
    max-width: 540px;
    max-height: 80vh;
    position: absolute;
    top: 120px;
    right: 50px;
    z-index: 100;
    box-shadow: 0px 2px 8px 4px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
}

.section-header {
    background: #ff4444;
    font-weight: 700;
    padding: 5px 20px;
}

.section-description {
    padding: 10px 20px;
}

.tokens-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.token-line {
    display: flex;
    padding: 4px;
    border-radius: 4px;
    justify-content: space-between;
    align-items: center;
}

.token-line-number {
    display: inline-block;
    width: 20px;
    font-size: 0.8em;
    text-align: right;
    color: #666 !important;
}

.token-type-none {
    min-width: 350px;
}

.token-type-whitespace {
    color: #888;
}

.token-type-comment {
    color: limegreen;
}

.token-type-property {
    color: palevioletred;
}

.token-type-relation {
    color: darkorange;
}

.token-type-keyword {
    color: aqua;
}

.token-type-begin, .token-type-end {
    color: burlywood;
}

.token-line-type {
    font-weight: 600;
    font-size: 0.9em;
    opacity: 0.6;
}

.token-line:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>