import { elementManagement, log, norman } from "../norman/index"
import detect_status from "./detect_status"
import cta_html from "./cta.html"
import handle_interaction from "./handle_interaction"

export function get_er_price() {
    let el = elementManagement.get('#erOfferPrice').pop()
    return el.textContent
}

export function get_otp_price() {
    let el = elementManagement.get('#otOfferPrice').pop()
    return el.textContent
}

export function get_selected_price() {
    let selected_payment_type = elementManagement.get(`.frequency.active`)
    if(!!selected_payment_type.length) {
        selected_payment_type = selected_payment_type.pop()
        if(selected_payment_type.classList.contains("er")) {
            return get_er_price()
        } else {
            return get_otp_price()
        }
    }
}

export function update_price() {
    let selected_price = get_selected_price()
    console.warn(selected_price)
    let el = elementManagement.get(`[test="pah159_2"] .pdp_add_to_basket .price`)
    if (el.length > 0) {
        el = el.pop()
        el.textContent = selected_price
    } 
}

export function add_cta(sticky=false) {
    elementManagement.remove(".pdp_add_to_basket")
    let el = elementManagement.add(cta_html, "beforeBegin", "#checkout-combo")
    update_price()
    
    el.addEventListener("click", e => {
        log({"msg": "Add to Basket CTA clicked", el})
        // handle_interaction()
    })
    log({el})
    
    if(sticky) {
        el.classList.add("sticky")
        el.setAttribute("style", `z-index: ${norman.utils.getHighestZIndex() + 1}`)
    }
    log({status: detect_status()})
}