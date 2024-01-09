<script lang="ts">
	import type { ExerciseType } from '$lib/types.js';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { ArrowLeft } from 'lucide-svelte';
	import { onMount } from 'svelte';

	export let data;

	let exercises: Array<ExerciseType> = [];

	onMount(() => {});

	function selectExercise() {}
</script>

<AppBar class="w-full text-neutral-100" background="bg-tertiary-500">
	<svelte:fragment slot="lead">
		<a href="/history" class="btn variant-ringed">
			<ArrowLeft />
		</a>
	</svelte:fragment>
	<h2 class="h2" data-toc-ignore>{data.date}</h2>
</AppBar>

<ul
	on:click={selectExercise}
	class="h-full bg-gradient-to-b from-tertiary-100 via-secondary-100 to-primary-100 pt-2"
>
	<!-- {#each $exercises as exercise}
		<li><Exercise bind:exercise previousExercises={getLastWorkout(exercise)} /></li>
	{/each} -->
</ul>
