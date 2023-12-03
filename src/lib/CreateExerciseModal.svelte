<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import type { ExerciseType } from './types';

	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	let exercise: ExerciseType = {
		name: '',
		weight: 0,
		reps: 0,
		complete: false
	};

	function onFormSubmit(event: Event) {
		if ($modalStore[0].response) $modalStore[0].response(exercise);
		modalStore.close();
	}
</script>

<div>
	<label
		>Name:
		<input
			type="text"
			class="input"
			title="Name"
			placeholder="Bench press"
			bind:value={exercise.name}
		/>
	</label>
	<label
		>Weight:
		<input
			type="number"
			class="input"
			title="Weight"
			placeholder="120"
			bind:value={exercise.weight}
		/>
	</label>
	<label
		>Reps:
		<input type="number" class="input" title="Reps" placeholder="30" bind:value={exercise.reps} />
	</label>
	<div class="mt-4 w-full text-right">
		<button class="btn variant-filled" on:click={parent.onClose}>Cancel</button>
		<button class="btn variant-filled" on:click={onFormSubmit}>Save</button>
	</div>
</div>
