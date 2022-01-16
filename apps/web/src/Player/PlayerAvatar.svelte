<script>
  import FaUserCircle from "svelte-icons/fa/FaUserCircle.svelte";
  export let imageSrc = "";
</script>

{#if imageSrc}
  <img class="avatar" src={imageSrc} alt="" />
{:else}
  <div class="avatar"><FaUserCircle /></div>
{/if}

<style>
  .avatar {
    height: 48px;
    width: 48px;
    box-shadow: black 0px 0px 3px;

    border-radius: 100%;
    box-sizing: border-box;
  }
</style>
