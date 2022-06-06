import detect_status from "./detect_status.js"
import { add_cta, update_price } from "./cta_and_qty.js"
import { elementManagement } from "../norman/index.js"

export const pdp_add_to_basket = {
	add_cta,
	detect_status,
	update_price,
	isValid: () => {
		let status = detect_status()
		return [
			status.easyRepeat.cnc,
			status.oneTimePurchase.cnc,
			status.oneTimePurchaseEasyRepeatModule.cnc,
			status.easyRepeat.delivery,
			status.oneTimePurchase.delivery,
			status.oneTimePurchaseEasyRepeatModule.delivery
		].some(a => a) && [
			!elementManagement.exists(".cc-not-available"),
			!elementManagement.exists(".pdp-stock__message--alert")
		].every(a => a)
	}
}

export default pdp_add_to_basket