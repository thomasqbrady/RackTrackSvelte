<script lang="ts">
	import { AppBar, localStorageStore } from '@skeletonlabs/skeleton';
	import { ArrowLeft } from 'lucide-svelte';
	import { onMount } from 'svelte';

	import type { Writable } from 'svelte/store';
	import type { ExerciseType, Workout } from '$lib/types';

	let chartsDiv: HTMLElement;
	let chartConfigMap: Map<string, any> = new Map();

	const exerciseNames: string[] = [];
	const workouts: Writable<Array<Workout>> = localStorageStore('workouts', []);

	interface Datum {
		date: string;
		exercise: string;
		value: number;
	}

	onMount(() => {
		chart();
	});

	async function chart() {
		let colors = [
			'#ea5545',
			'#f46a9b',
			'#ef9b20',
			'#edbf33',
			'#ede15b',
			'#bdcf32',
			'#87bc45',
			'#27aeef',
			'#b33dc6'
		];
		const ApexCharts = (await import('apexcharts')).default;
		let options: any = {};
		options.chart = {
			type: 'bar',
			height: 350,
			stacked: true,
			zoom: {
				enabled: true,
				type: 'x'
			},
			toolbar: {
				show: true,
				tools: {
					zoom: true,
					zoomin: true,
					zoomout: true,
					pan: true,
					reset: true
				}
			}
		};
		options.dataLabels = {
			enabled: false
		};
		options.stroke = {
			curve: 'monotonCubic'
		};
		options.fill = {
			type: 'gradient',
			gradient: {
				opacityFrom: 0.6,
				opacityTo: 0.8
			}
		};
		options.legend = {
			position: 'top',
			horizontalAlign: 'left'
		};
		options.xaxis = {
			type: 'date',
			tickPlacement: 'on'
		};
		options.series = [];
		$workouts.map((workout) => {
			workout.exercises.map((exe: ExerciseType) => {
				if (!exerciseNames.includes(exe.name)) {
					exerciseNames.push(exe.name);
				}
			});
		});
		options.chart.width = exerciseNames.length * 150;
		exerciseNames.map((exercise) => {
			let div = document.createElement('div');
			let exerciseOptions = structuredClone(options);
			exerciseOptions.colors = [colors[0], colors[1]];
			colors = [...colors.slice(2), colors[0], colors[1]];
			let weightArray: any = [];
			let repArray: any = [];
			$workouts.map((workout: Workout) => {
				let workoutStats = [0, 0];
				workout.exercises.map((exe: ExerciseType) => {
					if (exe.name === exercise) {
						workoutStats[0] = exe.weight;
						workoutStats[1] = exe.reps;
					}
				});
				weightArray.push({
					x: workout.date,
					y: workoutStats[0],
					category: exercise
				});
				repArray.push({
					x: workout.date,
					y: workoutStats[1],
					category: exercise
				});
			});
			exerciseOptions.series.push({
				label: exercise + ' weight',
				name: exercise + ' weight',
				data: weightArray
			});
			exerciseOptions.series.push({
				label: exercise + ' reps',
				name: exercise + ' reps',
				data: repArray
			});
			chartConfigMap.set(exercise, exerciseOptions);
		});
		console.log(chartConfigMap);
		exerciseNames.map((exerciseName) => {
			let chartDiv = document.createElement('div');
			chartDiv.classList.add('overflow-x-scroll', 'overflow-y-hidden', 'relative');
			let heading = document.createElement('h3');
			heading.classList.add('h3', 'w-full', 'text-center', 'mt-4', 'pt-8', 'sticky', 'left-0');
			heading.textContent = exerciseName;
			chartDiv.appendChild(heading);
			chartsDiv.appendChild(chartDiv);
			let chart = new ApexCharts(chartDiv, chartConfigMap.get(exerciseName));
			chart.render();
		});
	}
</script>

<AppBar class="w-full z-10 text-neutral-100 sticky top-0" background="bg-tertiary-500">
	<svelte:fragment slot="lead"><span></span></svelte:fragment>
	<h2 class="h2 w-full text-center" data-toc-ignore>Trends</h2>
	<svelte:fragment slot="trail"><span></span></svelte:fragment>
</AppBar>

<div bind:this={chartsDiv} class="bg-surface-50"></div>
