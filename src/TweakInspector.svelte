<script>
  export let asf;
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
</style>

<section>
  <div class="section-header">🖱️ INSPECTOR</div>
  <div class="section-description">
    {#if asf.loaded}
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
    {:else}
    <p>No element selected.</p>
    {/if}
  </div>
</section>
