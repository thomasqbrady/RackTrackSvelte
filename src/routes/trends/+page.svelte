<script lang="ts">
	import { AppBar, localStorageStore } from '@skeletonlabs/skeleton';
	import { ArrowLeft } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import {
		Chart,
		Colors,
		Title,
		Tooltip,
		Legend,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale
	} from 'chart.js';

	import type { ExerciseType, Workout } from '$lib/types';

	Chart.register(
		Colors,
		Title,
		Tooltip,
		Legend,
		BarController,
		BarElement,
		CategoryScale,
		LinearScale
	);

	let chartCanvas: HTMLCanvasElement;
	let data: any;
	const labels: string[] = [];
	const chartConfig = {
		type: 'bar',
		data: {},
		options: {
			plugins: {
				title: {
					display: true,
					text: 'Weight/Reps History'
				}
			},
			responsive: false,
			interaction: {
				intersect: false
			},
			scales: {
				x: {
					stacked: true
				},
				y: {
					stacked: true
				}
			}
		}
	};

	const exerciseNames: string[] = [];
	const workouts: Writable<Array<Workout>> = localStorageStore('workouts', []);

	interface Datum {
		date: string;
		exercise: string;
		value: number;
	}

	onMount(() => {
		const config = prepData();
		const ctx = chartCanvas.getContext('2d');
		if (ctx) {
			const renderedChart = new Chart(ctx, config);
		}
	});

	function prepData(): any {
		let d: any = {};
		d.datasets = [];
		let maxExerciseCount = 0;
		let dataObject: any = {};
		$workouts.map((workout) => {
			maxExerciseCount =
				workout.exercises.length > maxExerciseCount ? workout.exercises.length : maxExerciseCount;
			labels.push(workout.date);
			workout.exercises.map((exe: ExerciseType) => {
				if (!exerciseNames.includes(exe.name)) {
					exerciseNames.push(exe.name);
					d.datasets.push({
						label: exe.name + ' w',
						data: [],
						stack: exe.name
					});
					d.datasets.push({
						label: exe.name + ' r',
						data: [],
						stack: exe.name
					});
				}
			});
		});
		$workouts.map((workout) => {
			let exerciseNameList = [...exerciseNames];
			// console.log(exerciseNameList);
			workout.exercises.map((exe: ExerciseType) => {
				if (!dataObject[exe.name + ' w']) {
					dataObject[exe.name + ' w'] = [];
				}
				if (!dataObject[exe.name + ' r']) {
					dataObject[exe.name + ' r'] = [];
				}
				if (exe.complete) {
					dataObject[exe.name + ' r'].push(exe.reps ?? 0);
					dataObject[exe.name + ' w'].push(exe.complete ? exe.weight : 0);
				} else {
					dataObject[exe.name + ' r'].push(0);
					dataObject[exe.name + ' w'].push(0);
				}
				let index = exerciseNameList.findIndex((exerciseName: string) => {
					return exerciseName === exe.name;
				});
				if (index > -1) {
					exerciseNameList.splice(index, 1);
				}
			});
			exerciseNameList.map((exerciseName) => {
				if (!dataObject[exerciseName + ' w']) {
					dataObject[exerciseName + ' w'] = [];
				}
				dataObject[exerciseName + ' w'].push(0);
				if (!dataObject[exerciseName + ' r']) {
					dataObject[exerciseName + ' r'] = [];
				}
				dataObject[exerciseName + ' r'].push(0);
			});
			// console.log(workout.date, exerciseNameList);
		});
		d.datasets.map((dataset: any) => {
			// console.log(dataset);
			dataset.data = dataObject[dataset.label];
		});
		d.labels = labels;
		chartConfig.data = d;
		console.log(chartConfig);
		return chartConfig;
	}
</script>

<AppBar class="w-full text-neutral-100 sticky top-0" background="bg-tertiary-500">
	<svelte:fragment slot="lead">
		<a href="/history" class="btn">
			<ArrowLeft />
		</a>
	</svelte:fragment>
	<h2 class="h2" data-toc-ignore>Trends</h2>
</AppBar>

<div class="w-full h-4/5 bg-surface-50 overflow-x-scroll">
	<div class="relative">
		<canvas bind:this={chartCanvas} width={7900} height="650" />
	</div>
</div>
