<script lang="ts">
	import '../app.pcss';
	import { TabGroup, TabAnchor, Modal, AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';

	import { Dumbbell, Settings } from 'lucide-svelte';

	import { page } from '$app/stores';

	import EditExerciseModal from '$lib/EditExerciseModal.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		editExerciseModal: { ref: EditExerciseModal }
	};

	initializeStores();
</script>

<Modal components={modalRegistry} regionBackdrop="bg-surface-backdrop-token" />

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
				<span>Workouts</span>
			</TabAnchor>

			<TabAnchor href="/settings" selected={$page.url.pathname === '/settings'}>
				<svelte:fragment slot="lead"><Settings /></svelte:fragment>
				<span>Settings</span>
			</TabAnchor>
		</TabGroup>
	</svelte:fragment>
</AppShell>
