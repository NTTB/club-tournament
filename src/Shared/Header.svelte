<script lang="ts">
  import FaArrowLeft from "svelte-icons/fa/FaArrowLeft.svelte";
  export let title = "";
  export let backUrl = "";
</script>

<style>
  .header {
    background-color: var(--nttb-blue);
    color: var(--text-white);
    height: 56px;
    font-size: 20px;
    font-weight: bold;

    display: grid;
    grid-template-columns: 48px 1fr;
    gap: 8px;
    align-items: center;
  }

  .icon {
    height: 32px;
    width: 32px;
    padding: 8px;
  }
  .title {
    overflow: hidden;
    white-space: pre;
  }
  a.back-button{
    color: var(--text-white);
  }
</style>

<div class="header">
  <a href={backUrl} class="back-button icon">
    <FaArrowLeft />
  </a>
  <div class="title">{title}</div>
</div>
