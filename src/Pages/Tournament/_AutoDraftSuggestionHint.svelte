<script lang="ts">
  import { TournamentsRoundRobinSuggestions as suggestions } from "nttb-support";

  export var key: string;

  var suggestion = suggestions
    .filter((x) => x.key == key)
    .map((src) => {
      return {
        key: src.key,
        pools: src.pools,
        players: src.pools.reduce((pv, cv) => cv.slots + pv, 0),
        minDuration: min(src.pools, (x) => x.duration),
        maxDuration: max(src.pools, (x) => x.duration),
        tablesFixed: sum(src.pools, (x) => x.tablesExcl),
        tablesShared: sum(src.pools, (x) => x.tablesShared),
        tablesMax: max(src.pools, (x) => x.tablesExcl + x.tablesShared),
        distinctPoolSizes: distinct(src.pools, (x) => x.slots),
      };
    })[0];

  function distinct<T>(src: T[], func: (item: T) => number) {
    return src
      .reduce((pv: number[], cv) => {
        const v = func(cv);

        if (pv.includes(v)) return pv;
        return [...pv, v];
      }, [])
      .sort();
  }

  function min<T>(src: T[], func: (item: T) => number) {
    return src.reduce(
      (pv, cv) => (func(cv) > pv ? pv : func(cv)),
      Number.MAX_SAFE_INTEGER
    );
  }

  function sum<T>(src: T[], func: (item: T) => number) {
    return src.reduce((pv, cv) => func(cv) + pv, 0);
  }

  function max<T>(src: T[], func: (item: T) => number) {
    return src.reduce(
      (pv, cv) => (func(cv) < pv ? pv : func(cv)),
      Number.MIN_SAFE_INTEGER
    );
  }

  function readableList(items: number[]): string {
    var sb = "";
    items.forEach((v, i, a) => {
      let prefix = "";
      if (i != 0 && i < a.length - 1) {
        prefix = ", ";
      }
      if (i != 0 && i == a.length - 1) {
        prefix = " of ";
      }

      sb += prefix;
      sb += v;
    });

    return sb;
  }
</script>

<ul>
  <li>Vereist {suggestion.maxDuration} minuten bij 5 sets per game.</li>

  {#if suggestion.tablesShared == 0}
    <li>Vereist {suggestion.tablesFixed} vaste tafels.</li>
  {:else}
    <li>
      Vereist
      {suggestion.tablesFixed}
      vaste tafels en
      {suggestion.tablesShared}
      gedeelde tafels.
    </li>
  {/if}
  {#if suggestion.minDuration != suggestion.maxDuration}
    <li>Sommige pools hebben maar {suggestion.minDuration} minuten nodig.</li>
  {/if}
  {#if suggestion.tablesMax > 1}
    <li>Sommige pools spelen op meerdere tafels.</li>
  {/if}
  {#if suggestion.distinctPoolSizes.length == 1}
    <li>
      Spelers worden verdeeld over
      {suggestion.pools.length}
      pools met elk
      {suggestion.distinctPoolSizes[0]}
      spelers
    </li>
  {:else}
    <li>
      Spelers worden verdeeld over
      {suggestion.pools.length}
      pools met
      {readableList(suggestion.distinctPoolSizes)}
      spelers.
    </li>
  {/if}
</ul>
