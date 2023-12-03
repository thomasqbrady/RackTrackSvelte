<script lang="ts">
	import type { ExerciseType } from '$lib/types';
	import Exercise from '$lib/Exercise.svelte';
	import Cloud from '$lib/icons/Cloud.svelte';
	import Icon from '$lib/icons/Icon.svelte';
	import Plus from '$lib/icons/Plus.svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import moment from 'moment';
	import { onMount } from 'svelte';

	let today = '';
	let lastSaved = '';
	let exercises = new Array<ExerciseType>();
	const modalStore = getModalStore();

	onMount(() => {
		today = moment().format('ddd, MMM D');
	});

	async function addExercise(event: Event) {
		// new Promise<Exercise>((resolve) => {
		modalStore.trigger({
			type: 'component',
			component: 'createExerciseModal',
			response: (e: ExerciseType) => {
				exercises = [...exercises, e];
			}
		});
		// });
	}
</script>

<ul>
	{#each exercises as exercise}
		<li><Exercise {exercise} /></li>
	{/each}
</ul>

<button type="button" class="btn-icon variant-filled fixed top-4 right-4" on:click={addExercise}>
	<Icon symbol={Plus} />
</button>
