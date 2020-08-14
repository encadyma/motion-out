<script>
  export let asf;

  const toggleGUI = () => {
    asf.editor.hidden = !asf.editor.hidden;
  };
</script>

<style>
  footer {
    display: flex;
    font-size: 0.8em;
    position: fixed;
    bottom: 25px;
    z-index: 100;
    width: 100%;
    box-sizing: border-box;
    padding-left: 50px;
  }

  a {
    display: inline-block;
    margin: 0 10px;
  }
</style>

<footer>
  <a href="https://github.com/encadyma/motion-out" target="_blank">
    Github Repo
  </a>
  <a href="https://encadyma.github.io/motion-out" target="_blank">
    Project Report Website
  </a>
  <a href="#" on:click={toggleGUI}>
    {#if asf.editor.hidden}Show GUI{:else}Hide GUI{/if}
  </a>
</footer>
