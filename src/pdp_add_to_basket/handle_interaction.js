import { elementManagement, log } from "../norman"

export function get_qty() {
    let selector = '[name="quantity"]'
    if(elementManagement.exists(selector)) {
        let el = elementManagement.get(selector).pop()
        let val = el.value
        log({el, val})
        return isNaN(parseInt(val)) ? 1 : parseInt(val)
    }
    return 1
}

export function get_single_price() {
    let selector = '#offerPrice'
    if(elementManagement.exists(selector)) {
        let el = elementManagement.get(selector).pop()
        let price = el.textContent.replace(/£/g, "")
        return isNaN(parseFloat(price)) ? 1 : parseFloat(price)
    }
    return 0
}

export function format_price(x) {
    return Number.parseFloat(x).toFixed(2);
}

export function handle_otp_interaction() {
    let cncProductPartNumber_el = elementManagement.get("#cncProductPartNumber").pop()
    let cncProductPartNumber = cncProductPartNumber_el.value

    let cncProductId_el = elementManagement.get("#cncProductId").pop()
    let cncProductId = cncProductId_el.value

    let price_el = elementManagement.get("#offerPrice, #otOfferPrice").pop()
    let price = price_el.textContent
    
    QuickViewJS.addSkuToBasketFromMob(cncProductPartNumber, cncProductId, cncProductId, price)
    
    let qty_added_el = elementManagement.get(`[test="pah159_2"] #prod_qty_input`).pop(0)
    let qty = parseInt(qty_added_el.value)
        
    GoogleTagShoppingCart.addToCart(cncProductPartNumber, qty);
    console.warn(qty)

    let qty_str = `Subtotal (${qty} item${qty > 1 ? "s": ""})`
    let single_price = get_single_price()
    let total = format_price(single_price * qty)
    log({
        qty,
        total,
        qty_str,
        single_price,
    })
}

export function click_original_otp_cta() {
    let otp_cta_sel = `[for="one-time-purchase"] + .checkout-combo__content #add_to_cart`
    if (elementManagement.exists(otp_cta_sel)) {
        let el = elementManagement.get(otp_cta_sel).pop()
        log("Clicking original otp CTA")
        el.click()
    }
}

export function click_original_er_cta() {
    let otp_cta_sel = `[for="repeat-delivery"] + .checkout-combo__content #add-to-basket__inner_cc .add-to-basket__btn-row_er #add_to_cart`
    if (elementManagement.exists(otp_cta_sel)) {
        let el = elementManagement.get(otp_cta_sel).pop(0)
        el.click()
    }
}

export default function handle_interaction() {
    let selected_payment_type = elementManagement.get(`.frequency.active`)
    if(!!selected_payment_type.length) {
        selected_payment_type = selected_payment_type.pop()
        if(selected_payment_type.classList.contains("er")) {
            // Do the ER thing
            click_original_er_cta()
        } else {
            // Do the OTP thing
            click_original_otp_cta()
        }
    }
}