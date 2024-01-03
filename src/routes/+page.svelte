<script lang="ts">
	import type { ExerciseLog, ExerciseType, Workout } from '$lib/types';
	import Exercise from '$lib/Exercise.svelte';
	import { AppBar, getModalStore, localStorageStore } from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';
	import { onMount } from 'svelte';

	import { Dumbbell, File, Plus } from 'lucide-svelte';

	import moment from 'moment';

	let today = '';
	let lastSaved = '';
	const modalStore = getModalStore();
	const exercises: Writable<Array<ExerciseType>> = localStorageStore('exercises', []);
	const workouts: Writable<Array<Workout>> = localStorageStore('workouts', []);

	onMount(() => {
		today = moment().format('ddd, MMM D:YYYY');
		$workouts = $workouts.sort((a: Workout, b: Workout) => {
			let aDate: Date = new Date(a.date);
			let bDate: Date = new Date(b.date);
			return aDate < bDate ? -1 : 1;
		});
		$exercises = $exercises.sort((a: ExerciseType, b: ExerciseType) => {
			return a.index - b.index;
		});
	});

	function saveWorkout() {
		let found = false;
		$workouts.map((workout) => {
			if (workout.date === today) {
				workout.exercises = $exercises;
				found = true;
			}
		});
		if (!found) {
			$workouts.push({
				date: moment().format('M/D/YYYY'),
				exercises: $exercises
			});
		}
		workouts.set($workouts);
		console.log($workouts);
	}

	function getLastWorkout(exercise: ExerciseType): ExerciseLog {
		let workoutIndex = $workouts.length - 1;
		let count = 0;
		let lastTime: ExerciseType | undefined;
		while (workoutIndex > -1) {
			lastTime = $workouts[workoutIndex].exercises.find((workoutExercise: ExerciseType) => {
				return workoutExercise.id === exercise.id;
			});
			if (lastTime && lastTime.weight === exercise.weight && lastTime.reps === exercise.reps) {
				count++;
				workoutIndex--;
			} else {
				workoutIndex = -1;
			}
		}
		console.log(lastTime, count);
		return { exercise: lastTime, count: count };
	}

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

<AppBar class="w-full mb-4">
	<svelte:fragment slot="lead">
		<Dumbbell />
	</svelte:fragment>
	<h2 class="h2" data-toc-ignore>{today.split(':')[0]}</h2>
	<svelte:fragment slot="trail">
		<button class="btn btn-icon" on:click={saveWorkout}><File /></button>
	</svelte:fragment>
</AppBar>

<ul>
	{#each $exercises as exercise}
		<li><Exercise bind:exercise previousExercises={getLastWorkout(exercise)} /></li>
	{/each}
</ul>

<button
	type="button"
	class="btn-icon variant-filled-primary fixed bottom-20 right-4"
	on:click={addExercise}
>
	<Plus />
</button>
