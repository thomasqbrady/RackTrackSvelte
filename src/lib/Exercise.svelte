<script lang="ts">
	import type { ExerciseLog, ExerciseType, Workout } from './types';
	import type { Writable } from 'svelte/store';
	import { SlideToggle, localStorageStore } from '@skeletonlabs/skeleton';
	import { Check } from 'lucide-svelte';
	export let exercise: ExerciseType;
	export let previousExercises: ExerciseLog;

	const workouts: Writable<Array<Workout>> = localStorageStore('workouts', []);
</script>

<div class="flex flex-row items-center mb-2 text-primary-900" data-exercise-id={exercise.id}>
	{#if exercise.complete}
		<button class="btn btn-icon variant-filled-primary rounded text-white ml-2 h-8 w-8"
			><Check class="pointer-events-none" /></button
		>
	{:else}
		<button class="btn btn-icon variant-filled-primary rounded text-white ml-2 h-8 w-8"></button>
	{/if}
	<!-- <input type="checkbox" class="checkbox h-6 basis-1/12 ml-2" bind:checked={exercise.complete} /> -->
	<div class="basis-6/12 text-xl font-semibold ml-2">{exercise.name}</div>
	<div class="basis-2/12 text-right text-sm">
		last <span class="text-lg">{previousExercises.count}</span>x
	</div>
	<div class="basis-3/12">
		<p class="w-full text-center">
			<span class="font-semibold text-2xl">{exercise.weight}</span><span class="text-sm">lbs</span>
		</p>
		<p class="w-full text-center"><span class="font-semibold text-xl">{exercise.reps}</span>x</p>
	</div>
</div>
