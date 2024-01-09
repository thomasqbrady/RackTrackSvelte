<script lang="ts">
	import { DownloadCloud, UploadCloud } from 'lucide-svelte';
	import type { ExerciseType, Workout } from '$lib/types';
	import { AppBar, FileButton, localStorageStore } from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';

	const exercises: Writable<Array<ExerciseType>> = localStorageStore('exercises', []);
	const workouts: Writable<Array<Workout>> = localStorageStore('workouts', []);
	let files: FileList;

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
		console.log(files);
		if (files?.length <= 0) {
			return false;
		}

		let fr = new FileReader();

		fr.onload = function (e: ProgressEvent) {
			const fileContents: string = fr.result as string;
			console.log(fileContents);
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
</script>

<AppBar class="w-full text-neutral-100" background="bg-tertiary-500">
	<svelte:fragment slot="lead">
		<FileButton name="upload" bind:files on:change={importJSON}>
			<UploadCloud />
		</FileButton>
	</svelte:fragment>
	<h2 class="h2 w-full text-center" data-toc-ignore>History</h2>
	<svelte:fragment slot="trail">
		<button type="button" class="btn variant-ringed" on:click={exportJSON}>
			<DownloadCloud />
		</button>
	</svelte:fragment>
</AppBar>

<ul class="h-full bg-surface-100 pt-2">
	{#each $workouts as workout}
		<li class="w-full px-4 py-2 text-lg">
			<a href="/history/{workout.date.replaceAll('/', '-')}">{workout.date}</a>
		</li>
	{/each}
</ul>
