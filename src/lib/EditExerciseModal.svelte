<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';
	import type { ExerciseType } from './types';
	import { Trash } from 'lucide-svelte';

	export let parent: SvelteComponent;
	export let exercise: ExerciseType;
	export let editMode = false;

	const modalStore = getModalStore();

	function onDelete(event: Event) {
		if ($modalStore[0].response) $modalStore[0].response({ exercise: null, remove: true });
		modalStore.close();
	}

	function onSave(event: Event) {
		if ($modalStore[0].response) $modalStore[0].response({ exercise: exercise, remove: false });
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
		{#if editMode}
			<button class="btn variant-filled-error" on:click={onDelete}>Remove</button>
		{/if}
		<button class="btn variant-filled-primary" on:click={onSave}>Save</button>
	</div>
</div>
