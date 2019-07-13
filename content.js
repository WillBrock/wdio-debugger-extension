window.onload = async () => {
	const hidden_element = document.createElement(`div`);
	const response       = await getState(`wdio_test_current_state`);
	const playing        = !response.wdio_test_current_state || response.wdio_test_current_state === `playing`;

	hidden_element.classList.add(`wdio-hidden-element`);
	hidden_element.setAttribute(`data-state`, playing ? `playing` : `paused`);
	hidden_element.style.display = `none !important`;

	document.body.append(hidden_element);

	chrome.runtime.onMessage.addListener(async (request, sender, callback) => {
		if(request.play_pause) {
			const tmp       = await getState(`wdio_test_current_state`);
			console.log(tmp.wdio_test_current_state, `fron onMessag`)
			const state     = tmp.wdio_test_current_state;
			const new_state = state === `playing` ? `paused` : `playing`;

			hidden_element.setAttribute(`data-state`, new_state);
		}

		if(request.next_action) {
			hidden_element.setAttribute(`data-next`, true);
		}

		callback({ foo : `bar` });
	});
}

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
