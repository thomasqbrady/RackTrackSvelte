<script lang="ts">
	import {
		ArrowRight,
		DownloadCloud,
		Plus,
		UploadCloud
	} from 'lucide-svelte';
	import type { ExerciseType, Workout } from '$lib/types';
	import { AppBar, FileButton, getModalStore, localStorageStore } from '@skeletonlabs/skeleton';
	import { get, type Writable } from 'svelte/store';
	import NewWorkout from '$lib/NewWorkout.svelte';
	import { onMount } from 'svelte';

	const exercises: Writable<Array<ExerciseType>> = localStorageStore('exercises', []);
	const workouts: Writable<Array<Workout>> = localStorageStore('workouts', []);

	const modalStore = getModalStore();
	let files: FileList;

	onMount(() => {});

	function sortWorkouts() {
		workouts.set(
			get(workouts).sort((a: Workout, b: Workout) => {
				let aDate: Date = new Date(a.date);
				let bDate: Date = new Date(b.date);
				return aDate < bDate ? -1 : 1;
			})
		);
	}

	function downloadObjectAsJson(exportObj: any, exportName: string) {
		let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
		let downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute('href', dataStr);
		downloadAnchorNode.setAttribute('download', exportName + '.json');
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}

	function exportJSON() {
		downloadObjectAsJson({ exercises: $exercises, workouts: $workouts }, 'export');
	}

	function importJSON(e: Event) {
		if (files?.length <= 0) {
			return false;
		}

		let fr = new FileReader();

		fr.onload = function (e: ProgressEvent) {
			const fileContents: string = fr.result as string;
			if (!fileContents) {
				return;
			}
			let result = JSON.parse(fileContents);
			if (result.hasOwnProperty('exercises')) {
				result.exercises.map((exercise: any) => {
					let newExercise: ExerciseType = {
						id: exercise.id,
						name: exercise.name,
						complete: false,
						weight: exercise.weight,
						reps: exercise.reps,
						index: exercise.index
					};
					exercises.set([...$exercises, newExercise]);
				});
			}
			if (result.hasOwnProperty('workouts')) {
				result.workouts.map((workout: any) => {
					let newWorkout: Workout = {
						date: workout.date,
						exercises: workout.exercises
					};
					workouts.set([...$workouts, newWorkout]);
				});
			}
		};
		fr.readAsText(files?.item(0) || new Blob());
	}

	function getHREF(workout: Workout): string {
		return `/history/${workout.date.replaceAll('/', '-')}`;
	}

	function addWorkout(e: Event) {
		modalStore.trigger({
			type: 'component',
			component: {
				ref: NewWorkout,
				props: {}
			},
			response: (newWorkout: Workout) => {
				if (newWorkout) {
					$workouts = [...$workouts, newWorkout];
					sortWorkouts();
				}
			}
		});
	}
</script>

<AppBar class="w-full z-10 text-neutral-100 sticky top-0" background="bg-tertiary-500">
	<svelte:fragment slot="lead">
		<FileButton button="btn" name="upload" bind:files on:change={importJSON}>
			<UploadCloud class="mx-2" />
		</FileButton>
	</svelte:fragment>
	<h2 class="h2 w-full text-center" data-toc-ignore>History</h2>
	<svelte:fragment slot="trail">
		<button type="button" class="btn" on:click={exportJSON}>
			<DownloadCloud class="mx-2" />
		</button>
	</svelte:fragment>
</AppBar>

<button
	class="btn w-16 h-16 z-20 variant-filled-primary rounded-full fixed bottom-20 right-4"
	on:click={addWorkout}
>
	<Plus />
</button>

<ul class="h-full bg-surface-100">
	{#each $workouts as workout}
		<a class="w-full" href={getHREF(workout)}>
			<li
				class="w-full px-4 py-4 text-lg border border-solid border-surface-300 bg-surface-50 relative"
			>
				{workout.date}
				<ArrowRight class="absolute right-4" />
			</li>
		</a>
	{/each}
</ul>
