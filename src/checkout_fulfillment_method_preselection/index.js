import { elementManagement, log } from "../norman";

// resets and applies the active classes to the desired fullfillment option
export function make_selection(preference = "none") {
    let active_els = elementManagement.getAll(`.checkout-delivery__location-label.active, .checkout-delivery__location-label.active .active, .deliverySelectionView .show, #continueToPayment`)
    active_els.forEach(el => el.classList.remove("active", "show"))
    elementManagement.getAll('#continueToPayment').forEach(el => el.classList.add("hidden"))
    if(preference == "cnc") {
        let del_click_els = elementManagement.get(`.checkout-delivery__location-label--store input`)
        let active_els = elementManagement.getAll([
            `.checkout-delivery__location-label--store`, 
            `.checkout-delivery__location-label--store .checkout-delivery__radio-wrapper`,
            `.checkout-delivery__location-label--store .checkout-delivery__location-radio`,
        ].join(","))
        active_els.forEach(el => el.classList.add("active"))
        del_click_els.pop().click()
    } else if(preference == "delivery") {
        let del_click_els = elementManagement.get(`.checkout-delivery__location-label--home input`)
        let active_els = elementManagement.getAll([
            `.checkout-delivery__location-label--home`, 
            `.checkout-delivery__location-label--home .checkout-delivery__radio-wrapper`,
            `.checkout-delivery__location-label--home .checkout-delivery__location-radio`,
        ].join(","))
        active_els.forEach(el => el.classList.add("active"))
        del_click_els.pop().click()
    }
}

// evaluates if the checkout is valid for the test or not.
export function checkout_is_valid() {
    return !elementManagement.exists(`.checkout-delivery__location-label.disabled`) && elementManagement.exists(`#newOrderSummaryTotalHiddenForCnC`) && elementManagement.exists(`#orderSummaryTotal`)
}

export const checkout = {
    make_selection,
    is_valid: checkout_is_valid,
}

export default checkout