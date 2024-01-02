<script lang="ts">
	import '../app.pcss';
	import { TabGroup, TabAnchor, Modal, AppBar } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';

	import { Dumbbell, Settings } from 'lucide-svelte';

	import { page } from '$app/stores';

	import CreateExerciseModal from '$lib/CreateExerciseModal.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		createExerciseModal: { ref: CreateExerciseModal }
	};

	initializeStores();
</script>

<Modal components={modalRegistry} regionBackdrop="bg-surface-backdrop-token" />

<div class="p-4">
	<slot />
</div>

<TabGroup
	justify="justify-center"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded=""
	border=""
	class="bg-surface-100-800-token w-full fixed bottom-0"
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
