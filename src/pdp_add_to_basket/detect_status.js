export default function detect_status() {
	let falseObj = {
		cnc: false,
		delivery: false,
	}
	let status = {
		easyRepeat: falseObj,
		oneTimePurchase: falseObj,
		oneTimePurchaseEasyRepeatModule: falseObj,
		isER: !!document.querySelector('#checkout-combo') && !!document.querySelector('#checkout-combo').style.display !== "none",
		isBoth: !!document.querySelector('#checkout-combo') && !!document.querySelector('#add-to-basket'),
		elements: {
			easyRepeat: {
				parentSelector: "#checkout-combo .checkout-combo__item:nth-child(2) #add-to-basket__inner_cc",
				deliverySelector: ".add-to-basket__btn-row_er .btn--repeat.add-to-basket__add-btn",
				clickAndCollectSelector: ".click-collect-atb .add-to-basket__cc-btn",
			},
			oneTimePurchaseEasyRepeatModule: {
				parentSelector: "#checkout-combo .checkout-combo__item:nth-child(1) #add-to-basket__inner_cc",
				deliverySelector: ".add-to-basket__btn-row_otp",
				clickAndCollectSelector: ".add-to-basket__cc-btn",
			},
			oneTimePurchase: {
				parentSelector: "#add-to-basket #add-to-basket__inner_cc",
				clickAndCollectSelector: ".click-collect-atb .add-to-basket__add-btn",
				deliverySelector: ".add-to-basket__btn-row_otp .add-to-basket__add-btn",
			},
		}
	}

	let check_ctas = obj => {
		let parent = document.querySelector(obj.parentSelector)
		if (!!parent) {
			let cnc_cta = parent.querySelector(obj.clickAndCollectSelector)
			let delivery_cta = parent.querySelector(obj.deliverySelector)
			return {
				cnc: !!cnc_cta && !cnc_cta.classList.contains("disabled"),
				delivery: !!delivery_cta && !delivery_cta.classList.contains("disabled"),
			}
		} else {
			return falseObj
		}
	}

	status.oneTimePurchase = check_ctas(status.elements.oneTimePurchase)

	return status
}