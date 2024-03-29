import "./index.css";
import {elementManagement, log} from "../norman"
import price_template from "./price_template.html"

// If element doesn't exist, add it before the anchor selector
export function insert(anchor_selector) {
    if (!elementManagement.exists(".price_module")) {
        elementManagement.add(price_template, "beforeBegin", anchor_selector)
    }
}

// Get the easy repeat price
export function get_er_price() {
    let el = elementManagement.get('#erOfferPrice').pop()
    return el.textContent
}

// Get the one time purchase price
export function get_otp_price() {
    let el = elementManagement.get('#otOfferPrice').pop()
    return el.textContent
}

// Get the currently selected price
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

// Update the visible price HTML
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

// Rebuild the price element using the price details
export function build_price(prices) {
    log({
        msg: "Building prices from object",
        prices
    })
    return `<div class="pricing" price_type="${prices.type}" saving="${prices.saving.length !== 0}">
        <p class="saving">${prices.saving}</p>
        <div class="main_price">
            <p class="now">${prices.now}</p>
            <p class="was">${prices.was.indexOf(" - ") == -1 ? prices.was : ""}</p>
        </div>
        <p class="normalised">${prices.normalised}</p>
    </div>`
}

// Check if an element exists and get the first match's textContent, else return empty string
export function check_and_get_price(selector) {
    if (selector === "") {
        return ""
    }
    log(`Checking and getting ${selector}`)
    if (elementManagement.exists(selector)) {
        let el = elementManagement.get(selector)[0]
        return el.textContent.replace(/\(|\)/g, "").trim()
    } else {
        return ""
    }
}

// Get the current product type
export function get_type() {
    log(`Getting product type`)
    let selected_payment_type = elementManagement.get(`.frequency.active`)
    if(!!selected_payment_type.length) {
        selected_payment_type = selected_payment_type.pop()
        if(selected_payment_type.classList.contains("er") && !elementManagement.exists(`#pdpertag`)) {
            return "easy-repeat"
        } else if (elementManagement.exists(`.pdp-offer-text__inner`)) {
            return "sale"
        } else if (elementManagement.exists(`#pdpertag`)) {
            if(selected_payment_type.classList.contains("er")) {
                return "multi-size-easy-repeat"
            } else {
                return "multi-size-one-time-purchase"
            }
        } else {
            return "one-time-purchase"
        }
    }
}

// Get the prices for the current product
export function get_prices() {
    log(`Getting product prices`)
    let type = get_type()
    log(`Product type is ${type}`, true)
    let selectors = {
        now: "#otOfferPrice, #offerPrice",
        was: ".pdp-price__was",
        saving: ".pdp-offer-text__inner, .pdp-price__you-save, #checkout-combo__offer-text-er",
        normalised: "#otOfferPrice + .pdp-price__weight, #offerPrice + .pdp-price__weight",
    } 
    if (type == "easy-repeat") {
        selectors = {
            now: "#erOfferPrice",
            was: "#otOfferPrice",
            saving: "#checkout-combo__offer-text-er",
            normalised: "#erOfferppu",
        } 
    } else if (type == "multi-size-easy-repeat") {
        selectors = {
            now: "#erOfferPrice",
            was: ".pdp-price__was",
            saving: ".pdp-offer-text__inner, .pdp-price__you-save, #checkout-combo__offer-text-er",
            saving: "#checkout-combo__offer-text-er",
        } 
    } else if (type == "multi-size-one-time-purchase") {
        selectors = {
            now: "#otOfferPrice, #offerPrice",
            was: ".pdp-price__was",
            saving: ".pdp-offer-text__inner, .pdp-price__you-save, #checkout-combo__offer-text-er",
            normalised: "#otOfferPrice + .pdp-price__weight, #offerPrice + .pdp-price__weight",
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