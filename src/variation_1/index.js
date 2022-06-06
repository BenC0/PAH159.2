import variationCSS from "./index.css";
import { log, track, init, config, elementManagement } from "../norman/index"
import pdp_add_to_basket from "../pdp_add_to_basket/index"
import detect_page from "../detect_page"
import frequency_module from "../frequency_module";
import { is_in_list } from "../subscribe/init";
import { checkout_is_valid, make_selection } from "../checkout_fulfillment_method_preselection"
import price from "../price_module/index"
import size_module from "../size_module/"

function refresh_pdp(event) {
    log({ "msg": "Refreshing pdp", event})
    // Update price
    price.update_price()
    // Update available frequencies
    frequency_module.update_frequency_availability()
    // Ensure check stock functionality remains
}

function pdp_actions() {
    // Get the PDP status and determine the anchor selector
    const status = pdp_add_to_basket.detect_status()
    let anchor_selector = status.isER && !status.isBoth ? "#checkout-combo" : !status.isER && !status.isBoth ? "#add-to-basket" : false
    if (status.isBoth) {
        anchor_selector = "#add-to-basket"
    }
    log({msg: "Running PDP Changes", status, anchor_selector})
    // Reset selected product frequency to One Time Purchase
    if (elementManagement.exists(`[for="one-time-purchase"]`)) {
        elementManagement.get(`[for="one-time-purchase"]`).pop().click()
    }
    price.insert(`[data-module="selector"]`)
    // Insert new frequency/Easy Repeat element before anchor selector
    frequency_module.insert(anchor_selector, status.isER, price.update_price, status.isBoth)
    // Update the price in the new price element.
    price.update_price()
    // Insert the new CTA
    pdp_add_to_basket.insert_cta_and_qty(anchor_selector)

    size_module.attach_listeners(refresh_pdp)
}

function actions() {
    // Standard logging/tracking
    log({
        "Variation": this.name,
        "Page Type": this.page_type
    })
    track(`${this.name} Loaded`, `Loaded`, true)
    // Additional non-impression event with page type
    track(this.name, `${this.name}: ${this.page_type} Loaded`, false)

    // Evaluate page type and run relevant changes
    if(this.page_type == "pdp") {
        pdp_actions()
    } else if (this.page_type == "checkout") {
        log("Running Checkout Changes")
        // Select Click & Collect on checkout
        make_selection("cnc")
    }
}

// Declare Variant details for Norman.
const Variant = {
    name: "Variation 1",
    css: variationCSS,
    page_type: detect_page(),
    conditions: () => {
        let conditions = []
        let page = detect_page()
        // Dynamic conditions based on page type.
        if(page == "pdp") {
            // Check PDP is valid based on status
            conditions.push(pdp_add_to_basket.isValid())
            // Check PDP is not eligible for the PDP Subscription Test (PAH152)
            conditions.push(!is_in_list())
        } else if (page == "checkout") {
            // Confirm both fullfillment methods are available
            conditions.push(checkout_is_valid())
        } else {
            // Poller will return false if page type isn't checkout or PDP
            conditions.push(false)
        }
        // Also confirm has not already ran.
        conditions.push(!elementManagement.exists('[test="pah159_2"]'))
        log({message: `Polling: Conditions`, conditions})
        let result = conditions.every(a => a)
        log({message: `Polling: Result`, result})
        return result
    },
    actions,
    fallback: _ => {
        // If polling fails and threshold is met, track "not loaded" event with pathname.
        log(`Firing not loaded event`)
        let page = window.location.pathname
        track(`${Variant.name} Not loaded`, `${Variant.name}: ${page} Not loaded`, false)
    }
}

// Initialise and run the variant with Norman
let nVariant = init(Variant)
nVariant.run()