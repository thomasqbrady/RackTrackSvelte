<script lang="ts">
	import type { ExerciseType } from '$lib/types';
	import Exercise from '$lib/Exercise.svelte';
	import { getModalStore, localStorageStore } from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';
	import { onMount } from 'svelte';

	import { Plus } from 'lucide-svelte';

	import moment from 'moment';

	let today = '';
	let lastSaved = '';
	const modalStore = getModalStore();
	const exercises: Writable<Array<ExerciseType>> = localStorageStore('exercises', []);

	onMount(() => {
		today = moment().format('ddd, MMM D');
		exercises.subscribe((workouts) => {
			console.log(`workoutStore event`, workouts, $exercises);
		});
	});

	async function addExercise(event: Event) {
		modalStore.trigger({
			type: 'component',
			component: 'createExerciseModal',
			response: (e: ExerciseType) => {
				if (e) {
					exercises.update((workouts): Array<ExerciseType> => {
						return [...workouts, e];
					});
				}
			}
		});
	}
</script>

<h1 class="h1">{today}</h1>

<ul>
	{#each $exercises as exercise}
		<li><Exercise bind:exercise /></li>
	{/each}
</ul>

<button
	type="button"
	class="btn-icon variant-filled-primary fixed bottom-20 right-4"
	on:click={addExercise}
>
	<Plus />
</button>
