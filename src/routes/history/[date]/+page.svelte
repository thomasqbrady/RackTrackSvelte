<script lang="ts">
	import Exercise from '$lib/Exercise.svelte';
	import type { ExerciseType, Workout, EditExerciseResponse } from '$lib/types.js';
	import {
		AppBar,
		localStorageStore,
		getModalStore,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { ArrowLeft, Trash } from 'lucide-svelte';
	import { onMount, createEventDispatcher } from 'svelte';
	import { type Writable, get } from 'svelte/store';
	import EditExerciseModal from '$lib/EditExerciseModal.svelte';

	export let data;

	let dispatch = createEventDispatcher();

	const modalStore = getModalStore();
	const workouts: Writable<Array<Workout>> = localStorageStore('workouts', []);
	let workout: Workout = { date: '', exercises: [] };

	onMount(() => {
		workout = $workouts.find((workout) => {
			return workout.date.replaceAll('/', '-') === data.date;
		}) ?? { date: '', exercises: [] };
	});

	function selectExercise(e: CustomEvent) {
		let target = e.target as HTMLElement;
		const selectedExerciseId = (target.closest('[data-exercise-id]') as HTMLElement).dataset
			?.exerciseId;
		if (selectedExerciseId) {
			let exe = workout.exercises.find((exercise) => {
				return exercise.id === selectedExerciseId;
			});
			if (target.closest('label') === null) {
				if (exe) {
					editExercise(exe);
				}
			}
		}
	}

	function editExercise(exercise: ExerciseType) {
		modalStore.trigger({
			type: 'component',
			component: {
				ref: EditExerciseModal,
				props: {
					exercise: exercise,
					editMode: true
				}
			},
			response: (response: EditExerciseResponse) => {
				if (response?.exercise) {
					const index =
						workout.exercises.findIndex((exe) => {
							return exe.id === exercise.id;
						}) ?? workout.exercises.length;
					workout.exercises[index] = response.exercise;
					workout.exercises = workout.exercises;
					workouts.set(get(workouts));
				}
			}
		});
	}

	function deleteWorkout() {
		dispatch('deleteWorkout', data.date);
	}
</script>

<AppBar class="w-full text-neutral-100 sticky top-0" background="bg-tertiary-500">
	<svelte:fragment slot="lead">
		<a href="/history" class="btn">
			<ArrowLeft />
		</a>
	</svelte:fragment>
	<h2 class="h2" data-toc-ignore>{data.date}</h2>
	<svelte:fragment slot="trail">
		<button class="btn" on:click={deleteWorkout}>
			<Trash />
		</button>
	</svelte:fragment>
</AppBar>

<ul
	on:click={selectExercise}
	class="h-full bg-gradient-to-b from-tertiary-100 via-secondary-100 to-primary-100 pt-2"
>
	{#each workout.exercises as exercise}
		<li><Exercise bind:exercise /></li>
	{/each}
</ul>
