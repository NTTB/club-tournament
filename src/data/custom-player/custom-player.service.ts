import type { CustomPlayer } from "./custom-player";
import { writable, derived, get } from "svelte/store";
import type { Readable } from "svelte/store";

const STORAGE_KEY = "data.customPlayers";

interface CustomPlayerStorageTable {
  nextId: number;
  items: CustomPlayer[];
}

class CustomPlayerService {
  private readonly store$ = writable<CustomPlayerStorageTable>({
    nextId: 1,
    items: []
  });

  constructor() {
    this.loadFromLocalStorage();
    this.enableAutoSave();
  }

  private enableAutoSave() {
    this.store$.subscribe((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
  }

  private loadFromLocalStorage() {
    try {
      let data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!Array.isArray(data)) {
        this.store$.set(data as CustomPlayerStorageTable || { nextId: 1, items: [] });
      }
    } catch {
      console.info("No tournament players");
      // Load data
    }
  }

  create(player: CustomPlayer): Promise<CustomPlayer> {
    return new Promise((resolve) => {
      this.store$.update((src) => {
        const final = {
          ...player,
          id: src.nextId++,
        };
        src.items.push(final);
        resolve(final);
        return src;
      });
    });
  }

  getCount(): Readable<number> {
    return derived(this.store$, (x) => x.items.length);

  }

  getById(id: number) {
    return derived(this.store$, store => store.items.find(x => x.id === id));
  }

  update(player: CustomPlayer) {
    this.store$.update((src) => {
      const index = src.items.findIndex(x => x.id === player.id);
      if (index === -1) throw new Error("Custom player doesn't exist");
      src.items[index] = player;
      return src;
    });
  }

  destroy(player: CustomPlayer) {
    this.store$.update((src) => {
      const index = src.items.findIndex(x => x.id === player.id);
      if (index === -1) throw new Error("Custom player doesn't exist");
      src.items.splice(index, 1);
      return src;
    });
  }

  find(terms: string[]): Readable<CustomPlayer[]> {
    return derived(this.store$, store => {
      if (terms.length === 0)
        return store.items;

      return store.items.filter(player => terms.every(term =>
        player.name.toLowerCase().includes(term) ||
        player.club.toLowerCase().includes(term) ||
        false
      ));
    });

  }
}

export const customPlayerService = new CustomPlayerService();