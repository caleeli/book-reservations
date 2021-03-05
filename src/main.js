import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		api: `//${window.location.hostname}:3000`
	}
});

export default app;