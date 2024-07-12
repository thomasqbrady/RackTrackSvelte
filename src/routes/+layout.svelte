<script lang="ts">
	import '../app.pcss';
	import { TabGroup, TabAnchor, Modal, AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';

	import { CalendarDays, Dumbbell, LineChart, Settings } from 'lucide-svelte';

	import { page } from '$app/stores';

	import EditExerciseModal from '$lib/EditExerciseModal.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		editExerciseModal: { ref: EditExerciseModal }
	};

	initializeStores();
</script>

<Modal components={modalRegistry} regionBackdrop="bg-surface-backdrop-token" background="bg-slate-100" buttonNeutral="rounded-3xl" buttonPositive="text-white rounded-3xl variant-filled-primary"/>

<AppShell>
	<slot />
	<svelte:fragment slot="footer">
		<TabGroup
			justify="justify-center"
			active="variant-filled-primary text-white"
			hover="hover:variant-soft-primary"
			flex="flex-1 lg:flex-none"
			rounded=""
			border=""
			class="bg-primary-300 w-full"
		>
			<TabAnchor href="/" selected={$page.url.pathname === '/'}>
				<svelte:fragment slot="lead"><Dumbbell /></svelte:fragment>
				<span>Record workout</span>
			</TabAnchor>

			<TabAnchor href="/history" selected={$page.url.pathname === '/history'}>
				<svelte:fragment slot="lead"><CalendarDays /></svelte:fragment>
				<span>Past workouts</span>
			</TabAnchor>
			<TabAnchor href="/trends" selected={$page.url.pathname === '/trends'}>
				<svelte:fragment slot="lead"><LineChart/></svelte:fragment>
				<span>Trends</span>
			</TabAnchor>
		</TabGroup>
	</svelte:fragment>
</AppShell>
