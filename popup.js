document.addEventListener(`DOMContentLoaded`, async () => {
	const response    = await getState(`wdio_test_current_state`);
	const play_pause  = document.getElementById(`play-pause`);
	const next_action = document.getElementById(`next-action`);
	const state       = response.wdio_test_current_state;

	if(state && state !== `playing`) {
		play_pause.textContent = `Play`;
	}

	play_pause.addEventListener(`click`, () => {
		chrome.tabs.query({ active : true, currentWindow : true }, async (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { play_pause : true }, async () => {
				const response      = await getState(`wdio_test_current_state`);
				const current_state = response.wdio_test_current_state;

				const new_state        = current_state === `playing` || !current_state ? `paused` : `playing`;
				play_pause.textContent = new_state === `playing` ? `Pause` : `Play`;

				await setState({ wdio_test_current_state : new_state });
			});
		});
	});

	next_action.addEventListener(`click`, () => {
		chrome.tabs.query({ active : true, currentWindow : true}, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { next_action : true }, () => {
				console.log(`from next_action click`)
			});
		});
	});
});

function getState(key) {
	return new Promise((resolve) => {
		chrome.storage.local.get([key], (response) => {
			resolve(response);
		});
	});
}

function setState(obj) {
	return new Promise((resolve) => {
		chrome.storage.local.set(obj, () => {
			resolve();
		});
	});
}
