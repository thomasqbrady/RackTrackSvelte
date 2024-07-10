<script lang="ts">
	import type { EditExerciseResponse, ExerciseLog, ExerciseType, Workout } from '$lib/types';
	import Exercise from '$lib/Exercise.svelte';
	import {
		AppBar,
		getModalStore,
		localStorageStore,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { writable, get } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { onMount } from 'svelte';

	import { Eraser, Save, SaveOff, Plus } from 'lucide-svelte';

	import moment from 'moment';
	import EditExerciseModal from '$lib/EditExerciseModal.svelte';

	let today = moment().format('M/D/YYYY');
	const modalStore = getModalStore();

	const workouts: Writable<Array<Workout>> = writable([]);
	const exercises: Writable<Array<ExerciseType>> = localStorageStore('exercises', []);
	const storedWorkouts: Writable<Array<Workout>> = localStorageStore('workouts', []);

	let saved = false;

	workouts.subscribe((workouts) => {
		checkSaved();
	});

	exercises.subscribe((exercises) => {
		checkSaved();
	});

	onMount(() => {
		workouts.set(
			get(storedWorkouts).sort((a: Workout, b: Workout) => {
				let aDate: Date = new Date(a.date);
				let bDate: Date = new Date(b.date);
				return aDate < bDate ? -1 : 1;
			})
		);
	});

	function checkSaved() {
		if (
			JSON.stringify(
				get(storedWorkouts).find((workout: Workout) => {
					return workout.date === today;
				})?.exercises
			) === JSON.stringify($exercises)
		) {
			saved = true;
		} else {
			saved = false;
		}
	}

	function saveWorkout() {
		let found = false;
		let saved = get(storedWorkouts);
		saved.map((workout) => {
			if (workout.date === today) {
				workout.exercises = $exercises;
				found = true;
			}
		});
		if (!found) {
			saved.push({
				date: moment().format('M/D/YYYY'),
				exercises: $exercises
			});
		}
		storedWorkouts.set(saved);
		checkSaved();
	}

	function getLastWorkout(exercise: ExerciseType): ExerciseLog {
		let workoutIndex = $workouts.length - 1;
		let count = 0;
		let lastTime: ExerciseType | undefined;
		while (workoutIndex > -1) {
			lastTime = $workouts[workoutIndex].exercises?.find((workoutExercise: ExerciseType) => {
				return workoutExercise.id === exercise.id;
			});
			if (lastTime && lastTime.weight === exercise.weight && lastTime.reps === exercise.reps) {
				count++;
				workoutIndex--;
			} else {
				workoutIndex = -1;
			}
		}
		return { exercise: lastTime, count: count };
	}

	function selectExercise(e: MouseEvent) {
		let target = e.target as HTMLElement;
		const selectedExerciseId = (target.closest('[data-exercise-id]') as HTMLElement).dataset
			?.exerciseId;
		if (selectedExerciseId) {
			let exe = $exercises.find((exercise) => {
				return exercise.id === selectedExerciseId;
			});
			if (target.closest('label') === null) {
				if (exe) {
					editExercise(exe);
				}
			}
		}
	}

	async function editExercise(exercise: ExerciseType) {
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
				let shouldRemove = false;
				if (response?.remove) {
					new Promise<boolean>((resolve) => {
						const modal: ModalSettings = {
							type: 'confirm',
							title: 'Are you sure?',
							body: 'Are you sure you want to remove this exercise?',
							response: (r: boolean) => {
								resolve(r);
							},
							meta: {
								props: {
									buttonNeutral: 'rounded-2xl'
								}
							}
						};
						modalStore.trigger(modal);
					}).then((r: any) => {
						if (r) {
							const index = $exercises.findIndex((exe) => {
								return exe.id === exercise.id;
							});
							$exercises.splice(index, 1);
							$exercises = $exercises;
						}
					});
				} else {
					if (response?.exercise) {
						const index =
							$exercises.findIndex((exe) => {
								return exe.id === exercise.id;
							}) ?? $exercises.length;
						$exercises[index] = response.exercise;
						$exercises = $exercises;
					}
				}
			}
		});
	}

	async function addExercise(event: Event) {
		modalStore.trigger({
			type: 'component',
			component: {
				ref: EditExerciseModal,
				props: {
					exercise: {
						id: crypto.randomUUID(),
						name: '',
						weight: 0,
						reps: 0,
						complete: false,
						index: $exercises.length + 1
					}
				}
			},
			response: (response: EditExerciseResponse) => {
				if (response?.exercise) {
					exercises.update((originalExercises): Array<ExerciseType> => {
						return [...originalExercises, response.exercise!];
					});
				}
			}
		});
	}

	function clearAll() {
		exercises.update((originalExercises) => {
			return originalExercises.map((exercise) => {
				exercise.complete = false;
				return exercise;
			});
		});
	}
</script>

<AppBar class="w-full text-neutral-100 sticky top-0" background="bg-tertiary-500">
	<svelte:fragment slot="lead">
		<button class="btn btn-icon" on:click={saveWorkout}>
			{#if saved}
				<Save />
			{:else}
				<SaveOff />
			{/if}
		</button>
		<button class="btn btn-icon" on:click={clearAll}>
			<Eraser />
		</button>
		<h2 class="ml-4 h2">RackTracker</h2>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<button class="btn btn-icon variant-filled-primary text-white" on:click={addExercise}
			><Plus /></button
		>
	</svelte:fragment>
</AppBar>

<ul
	on:click={selectExercise}
	class="h-full bg-gradient-to-b from-tertiary-100 via-secondary-100 to-primary-100 pt-2"
>
	{#each $exercises as exercise}
		<li><Exercise bind:exercise previousExercises={getLastWorkout(exercise)} /></li>
	{/each}
</ul>
