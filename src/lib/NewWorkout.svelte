<script lang="ts">
	import { getModalStore, localStorageStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import type { ExerciseType } from './types';
	import { Trash, Trash2, X } from 'lucide-svelte';
	import moment from 'moment';
	import type { Writable } from 'svelte/store';

	export let parent: SvelteComponent;

	const exercises: Writable<Array<ExerciseType>> = localStorageStore('exercises', []);
	const modalStore = getModalStore();

	let newWorkoutDate: Date = new Date();

	function onSave(event: Event) {
		if ($modalStore[0].response)
			$modalStore[0].response({
				date: moment(newWorkoutDate).format('M/D/YYYY'),
				exercises: $exercises
			});
		modalStore.close();
	}
</script>

<div class="card text-xl p-4 bg-slate-100 rounded-lg relative pt-8">
	<label
		>Date of workout:
		<input class="input" title="Workout date" type="date" bind:value={newWorkoutDate} />
	</label>
	<button class="btn btn-icon bg-transparent absolute top-1 right-1" on:click={parent.onClose}
		><X /></button
	>
	<div class="mt-4 w-full text-right flex justify-end gap-2">
		<button class="btn rounded-3xl text-sm text-white variant-filled-primary" on:click={onSave}
			>Save</button
		>
	</div>
</div>
