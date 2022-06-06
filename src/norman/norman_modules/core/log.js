import config from "../../config.js"
/**
 * Logs a message to the specified test in the window.norman object
 * @param {*} msg The message to be logged, can be any type but strings and objects are most common.
 */
export default function log(msg, shout = false) {
	let testID = config.id
	let date = new Date
	window.norman[testID].logs.push({
		"msg": msg,
		"id": `${testID}:${window.norman[testID].logs.length}`,
		"time": date.toTimeString(),
		"date": date.toDateString()
	})
	if(shout) {
		console.warn(window.norman[testID].logs[window.norman[testID].logs.length - 1])
	}
}