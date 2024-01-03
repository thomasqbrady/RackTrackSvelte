<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount, type SvelteComponent } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { ExerciseType } from './types';
	import { localStorageStore } from '@skeletonlabs/skeleton';

	const exercises: Writable<Array<ExerciseType>> = localStorageStore('exercises', []);

	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	onMount(() => {
		exercise.id = crypto.randomUUID();
		exercise.index = $exercises.length + 1;
	});

	let exercise: ExerciseType = {
		id: '',
		name: '',
		weight: 0,
		reps: 0,
		complete: false,
		index: 0
	};

	function onFormSubmit(event: Event) {
		if ($modalStore[0].response) $modalStore[0].response(exercise);
		modalStore.close();
	}
</script>

<div class="card text-xl p-4">
	<label
		>Exercise name:
		<input
			type="text"
			class="input p-2"
			title="Name"
			placeholder="Bench press"
			bind:value={exercise.name}
		/>
	</label>
	<label class="mt-4"
		>Weight:
		<input
			type="number"
			class="input p-2"
			title="Weight"
			placeholder="120"
			bind:value={exercise.weight}
		/>
	</label>
	<label class="mt-4"
		>Reps:
		<input
			type="number"
			class="input p-2"
			title="Reps"
			placeholder="30"
			bind:value={exercise.reps}
		/>
	</label>
	<div class="mt-4 w-full text-right">
		<button class="btn variant-filled" on:click={parent.onClose}>Cancel</button>
		<button class="btn variant-filled-primary" on:click={onFormSubmit}>Save</button>
	</div>
</div>
