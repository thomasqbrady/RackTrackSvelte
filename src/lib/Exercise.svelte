<script lang="ts">
	import type { ExerciseLog, ExerciseType, Workout } from './types';
	export let exercise: ExerciseType;
	export let previousExercises: ExerciseLog;
</script>

<div class="flex flex-row items-center mb-2 text-primary-900" data-exercise-id={exercise.id}>
	<label class="basis-7/12 flex justify-start place-items-center">
		<input
			type="checkbox"
			class="checkbox h-6 ml-2 accent-primary-400"
			bind:checked={exercise.complete}
		/>
		<div class="text-xl font-semibold ml-2 text-primary-800">{exercise.name}</div>
	</label>
	<div class="basis-2/12 text-right text-sm">
		last <span class="text-lg font-semibold text-primary-800">{previousExercises.count}</span>x
	</div>
	<div class="basis-3/12">
		<p class="w-full text-center">
			<span class="font-semibold text-2xl text-primary-800">{exercise.weight}</span><span
				class="text-sm">lbs</span
			>
		</p>
		<p class="w-full text-center">
			<span class="font-semibold text-xl text-primary-800">{exercise.reps}</span>x
		</p>
	</div>
</div>
