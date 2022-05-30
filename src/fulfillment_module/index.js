import template_html from "./template.html"
import {elementManagement, watchForChange} from "../norman"

export function add_new_fulfillment_methods(anchor_selector) {
    let el = elementManagement.add(template_html, "beforeBegin", anchor_selector)
}

export function move_existing_fulfillment_methods(anchor_selector) {
    let dp_msg_selector = ".deliveryPromise"
    if(elementManagement.exists(dp_msg_selector)) {
        let el = elementManagement.get(dp_msg_selector).pop()
        let new_el = elementManagement.add(`<div class="pah195_2_deliveryPromise">${el.innerHTML}</div>`, "afterEnd", anchor_selector)
        elementManagement.get("#DeliveryPromiseDisplayView").forEach(dp => watchForChange(dp, _ => {
            console.warn("Fuck yeah! Changes! Woo!")
            new_el.innerHTML = elementManagement.get(dp_msg_selector).pop().innerHTML
        }, {childList: true, subtree: true}, "pah159_2_store_selection_observer"))
    }
}