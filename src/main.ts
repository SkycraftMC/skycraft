import "./style.css";

import { initCheerpj } from "./cheerpj";

// TODO: get rid of the IIFE
(async () => {
	console.log(
		"%cHi! Welcome to Skycraft!",
		"font-size: 2em; color: #00ff00;",
	);
	console.log(
		"%cHere to debug? Make sure all logging levels are enabled in your DevTools console (including Verbose)",
		"font-size: 1.5em;",
	);
	console.warn(
		"DevTools slows down execution. We recommend opening it -after- the game has loaded.",
	);
	await initCheerpj();
})();
