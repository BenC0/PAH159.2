import template_html from "./template.html"
import {elementManagement, watchForChange} from "../norman"

export function add_new_fulfillment_methods(anchor_selector) {
    let el = elementManagement.add(template_html, "beforeBegin", anchor_selector)
}

export function update_fulfillment_methods() {
    let dp_msg_selector = ".checkout-combo__content--OTP .deliveryPromise"

    if(elementManagement.exists(dp_msg_selector)) {
        let new_el = elementManagement.get(`.pah195_2_deliveryPromise`).pop()
        let old_el = elementManagement.get(dp_msg_selector).pop()
        new_el.innerHTML = old_el.innerHTML
    }
}

export function move_existing_fulfillment_methods(anchor_selector) {
    elementManagement.add(`<div class="pah195_2_deliveryPromise"></div>`, "afterEnd", anchor_selector)
    update_fulfillment_methods()
    let selectors = "#DeliveryPromiseDisplayView, #DeliveryPromiseDisplayViewEROTP, #DeliveryPromiseERDisplayView"
    elementManagement.get(selectors).forEach(dp => watchForChange(dp, _ => update_fulfillment_methods))
}