<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let symbol: ComponentType;
</script>

<svg class="inline-block w-4 h-4 stroke-0 stroke-current fill-current" viewBox="0 0 24 24">
	<svelte:component this={symbol} />
</svg>
