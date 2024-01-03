<script lang="ts">
	import { DownloadCloud, UploadCloud } from 'lucide-svelte';
	import type { ExerciseType, Workout } from '$lib/types';
	import { FileButton, localStorageStore } from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';

	const exercises: Writable<Array<ExerciseType>> = localStorageStore('exercises', []);
	const workouts: Writable<Array<Workout>> = localStorageStore('workouts', []);
	let files: FileList;

	function downloadObjectAsJson(exportObj: any, exportName: string) {
		var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
		var downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute('href', dataStr);
		downloadAnchorNode.setAttribute('download', exportName + '.json');
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}
	function download() {
		downloadObjectAsJson({ exercises: $exercises, workouts: $workouts }, 'export');
	}
	function importJSON(e: Event) {
		if (files.length <= 0) {
			return false;
		}

		var fr = new FileReader();

		fr.onload = function (e: ProgressEvent) {
			const fileContents: string = fr.result as string;
			var result = JSON.parse(fileContents);
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
		fr.readAsText(files.item(0) || new Blob());
	}
</script>

<h1 class="h1 pb-4">Save/Restore workouts</h1>
<button type="button" class="btn variant-ringed" on:click={download}>
	<span>Download</span>
	<span><DownloadCloud /></span>
</button>

<FileButton name="upload" bind:files on:change={importJSON} button="btn variant-ringed mt-4">
	<span>Import</span>
	<span><UploadCloud /></span>
</FileButton>
