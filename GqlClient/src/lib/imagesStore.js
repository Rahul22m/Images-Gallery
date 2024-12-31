import { readable, writable } from "svelte/store";


export let users = writable([]);

export let imagesData = writable([]);
export let totalImages = writable(0);

export let totalUsers = writable(0);

export let page= writable(1);
export let limit = writable(24);
export let sortBy = writable('createdAt');
export let orderBy = writable('DESC');
export let search = writable('');

