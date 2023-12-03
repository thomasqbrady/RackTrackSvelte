<script lang="ts">
	import '../app.pcss';
	import { TabGroup, TabAnchor, Modal } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';

	import { page } from '$app/stores';

	import Icon from '$lib/icons/Icon.svelte';
	import Pulse from '$lib/icons/Pulse.svelte';
	import Gear from '$lib/icons/Gear.svelte';
	import CreateExerciseModal from '$lib/CreateExerciseModal.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		createExerciseModal: { ref: CreateExerciseModal }
	};

	initializeStores();
</script>

<Modal components={modalRegistry} />

<div class="p-4">
	<h1 class="h1 w-full text-center font-bold">RackTrack</h1>

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
		<svelte:fragment slot="lead"><Icon symbol={Pulse} /></svelte:fragment>
		<span>Workout</span>
	</TabAnchor>

	<TabAnchor href="/settings" selected={$page.url.pathname === '/settings'}>
		<svelte:fragment slot="lead"><Icon symbol={Gear} /></svelte:fragment>
		<span>Settings</span>
	</TabAnchor>
</TabGroup>
