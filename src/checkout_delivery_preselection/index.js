import { elementManagement, log } from "../norman";

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

export function checkout_is_valid() {
    return !elementManagement.exists(`.checkout-delivery__location-label.disabled`) && elementManagement.exists(`#newOrderSummaryTotalHiddenForCnC`) && elementManagement.exists(`#orderSummaryTotal`)
}

export function update_summary() {
    let summary_el = elementManagement.get("#orderSummaryTotal")
    summary_el = summary_el.pop()

    let cnc_summary_el = elementManagement.get("#newOrderSummaryTotalHiddenForCnC")
    log({cnc_summary_el})
    cnc_summary_el = cnc_summary_el[0]
    log({cnc_summary_el})
    log(cnc_summary_el.value)
    let new_str = cnc_summary_el.value
    log({new_str})
    new_str = new_str.replace(/Click (&|&amp;) Collect/g, "").replace(/,\s,/g, ",")
    log({new_str})
    summary_el.innerHTML = new_str

    let els_to_hide = elementManagement.getAll("#isShowDeliverySection, #ordSummaryDeliveryOptionSelected")
    els_to_hide.forEach(e => e.parentNode.style.display = "none")

    elementManagement.getAll(".checkout-delivery__location-label").forEach(el => {
        el.addEventListener("click", _ => {
            els_to_hide.forEach(e => e.parentNode.style.display = "")
        })
    })
}

export const checkout = {
    make_selection,
    is_valid: checkout_is_valid,
}

export default checkout