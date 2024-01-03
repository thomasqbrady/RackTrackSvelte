<script lang="ts">
	import { onMount } from 'svelte';
	import type { ExerciseLog, ExerciseType, Workout } from './types';
	import type { Writable } from 'svelte/store';
	import { localStorageStore } from '@skeletonlabs/skeleton';
	export let exercise: ExerciseType;
	export let previousExercises: ExerciseLog;

	const workouts: Writable<Array<Workout>> = localStorageStore('workouts', []);

	onMount(() => {
		console.log(previousExercises);
	});
</script>

<div class="flex flex-row items-center mb-2">
	<input type="checkbox" class="checkbox h-6 basis-2/12" bind:checked={exercise.complete} />
	<div class="basis-6/12 text-xl font-medium">{exercise.name}</div>
	<div class="basis-1/12 text-center"><span class="text-sm">last</span> <b>{previousExercises.count}</b>x</div>
	<div class="basis-3/12">
		<p class="w-full text-center"><span class="font-semibold text-lg">{exercise.weight}</span> <span class="text-sm">lbs</span></p>
		<p class="w-full text-center"><span class="font-semibold">{exercise.reps}</span>x</p>
	</div>
</div>
