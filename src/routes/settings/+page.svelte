<script lang="ts">
	import { DownloadCloud, UploadCloud } from 'lucide-svelte';
	import type { ExerciseType } from '$lib/types';
	import { FileButton, localStorageStore } from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';

	const exercises: Writable<Array<ExerciseType>> = localStorageStore('exercises', []);
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
		downloadObjectAsJson(exercises, 'exercises');
	}
	function importJSON(e: Event) {
		console.log(files, e);
		if (files.length <= 0) {
			return false;
		}

		var fr = new FileReader();

		fr.onload = function (e: ProgressEvent) {
			const fileContents: string = fr.result as string;
			var result = JSON.parse(fileContents);
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
