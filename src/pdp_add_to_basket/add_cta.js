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
    let el = elementManagement.get(`[test="pah159_2"] .pdp_add_to_basket .price`)
    if (el.length > 0) {
        el = el.pop()
        el.textContent = selected_price
    } 
}

export function increment_qty() {
    let el = elementManagement.get(`#prod_qty_input`)
    if(el.length > 0) {
        el = el.pop()
            el.value = parseInt(el.value) + 1
    }
}

export function decrement_qty() {
    let el = elementManagement.get(`#prod_qty_input`)
    if(el.length > 0) {
        el = el.pop()
        if (parseInt(el.value) > 1) {
            el.value = parseInt(el.value) - 1
        }
    }
}

export function update_og_qty() {
    log("Updating OG Price")
    let otp_qty_sels = `.checkout-combo__content--OTP .add-to-basket__inner:not([style*="display: none"]) #oneTimeQty, #quantity_nonsqp, #quantity_easy-repeat`
    if (elementManagement.exists(otp_qty_sels)) {
        let qty_added_el = elementManagement.get(`[test="pah159_2"] #prod_qty_input`).pop(0)
        let qty = parseInt(qty_added_el.value)
        let qty_els = elementManagement.getAll(otp_qty_sels)
        qty_els.forEach(qty_el => qty_el.value = qty)
    }
}

export function handle_qty_operator(e) {
    let ct = e.target
    if (ct.classList.contains("number_input_decrease")) {
        decrement_qty()
    } else {
        increment_qty()
    }
    update_og_qty()
}

export function add_cta(anchor_selector, sticky=false, price=false) {
    elementManagement.remove(".pdp_add_to_basket")
    let el = elementManagement.add(cta_html, "beforeBegin", anchor_selector)
    if(price) {
        update_price()
    }
    el.querySelector(".pdp_add_to_basket").addEventListener("click", e => {
        log({"msg": "Add to Basket CTA clicked", el})
        update_og_qty()
        handle_interaction()
    })
    el.querySelector(`[href="#check_stock"]`).addEventListener("click", e => {
        let btn = elementManagement.get(".add-to-basket__add-btn.stock-level-btn")
        if (btn.length > 0) {
            btn.pop(0).click()
        }
    })
    
    el.querySelectorAll(".number_input_container .operator").forEach(el => el.addEventListener("click", e => {
        log({"msg": "Qty Increment clicked", el})
        handle_qty_operator(e)
    }))

    if(sticky) {
        el.classList.add("sticky")
        el.setAttribute("style", `z-index: ${norman.utils.getHighestZIndex() + 1}`)
    }
    log({status: detect_status()})
}