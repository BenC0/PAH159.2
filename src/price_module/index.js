import "./index.css";
import {elementManagement, log} from "../norman"
import price_template from "./price_template.html"

export function insert(anchor_selector) {
    if (!elementManagement.exists(".price_module")) {
        elementManagement.add(price_template, "beforeBegin", anchor_selector)
    }
}

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
    let details = get_prices()
    log({details})
    let price_html = build_price(details)
    let el = elementManagement.get(`[test="pah159_2"].price_module`)
    if (el.length > 0) {
        el = el.pop()
        el.innerHTML = price_html
    } 
}

export function build_price(prices) {
    log({
        msg: "Building prices from object",
        prices
    })
    return `<div class="pricing" price_type="${prices.type}">
        <p class="saving">${prices.saving}</p>
        <div class="main_price">
            <p class="now">${prices.now}</p>
            <p class="was">${prices.was}</p>
        </div>
        <p class="normalised">${prices.normalised}</p>
    </div>`
}

export function check_and_get_price(selector) {
    log(`Checking and getting ${selector}`)
    if (elementManagement.exists(selector)) {
        let el = elementManagement.get(selector)[0]
        return el.textContent.replace(/\(|\)/g, "").trim()
    } else {
        return ""
    }
}

export function get_type() {
    log(`Getting product type`)
    let selected_payment_type = elementManagement.get(`.frequency.active`)
    if(!!selected_payment_type.length) {
        selected_payment_type = selected_payment_type.pop()
        if(selected_payment_type.classList.contains("er")) {
            return "easy-repeat"
        } else if (elementManagement.exists(`.pdp-offer-text__inner`)) {
            return "sale"
        } else {
            return "one-time-purchase"
        }
    }
}

export function get_prices() {
    log(`Getting product prices`)
    let type = get_type()
    let selectors = {
        now: "#otOfferPrice, #offerPrice",
        was: ".pdp-price__was",
        saving: ".pdp-offer-text__inner, .pdp-price__you-save",
        normalised: "#otOfferPrice + .pdp-price__weight, #offerPrice + .pdp-price__weight",
    } 
    if (type == "easy-repeat") {
        selectors = {
            now: "#erOfferPrice",
            was: "#otOfferPrice",
            saving: "#checkout-combo__offer-text-er",
            normalised: "#erOfferppu",
        } 
    } 
    let prices = {
        type,
        now: check_and_get_price(selectors.now),
        was: check_and_get_price(selectors.was).replace(/Was /g, ""),
        saving: check_and_get_price(selectors.saving),
        normalised: check_and_get_price(selectors.normalised),
    }
    return prices
}

export const price = {
    insert,
    update_price,
}

export default price