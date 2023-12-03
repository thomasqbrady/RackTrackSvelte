<script lang="ts">
	import type { ExerciseType } from './types';
	export let exercise: ExerciseType;
</script>

<div class="w-full flex">
	<input type="checkbox" class="checkbox flex-basis-1/6" bind:value={exercise.complete} />
	<div class="flex-basis-1/4">{exercise.name}</div>
	<div class="flex-basis-1/4">
		<p class="w-full text-center">{exercise.weight}</p>
		<p class="w-full text-center">{exercise.reps}</p>
	</div>
	<!-- <div class="flex-basis-1/4">
		<p class="w-full text-center">{exercise.lastWeight}</p>
		<p class="w-full text-center">{exercise.lastReps}</p>
	</div> -->
</div>
