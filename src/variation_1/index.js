import variationCSS from "./index.css";
import { log, track, init, config, elementManagement } from "../norman/index"
import pdp_add_to_basket from "../pdp_add_to_basket/index"
import detect_page from "../detect_page"
import er_module from "../pdp_add_to_basket/er_module";
import { is_in_list } from "../subscribe/init";
import { checkout_is_valid, make_selection } from "../checkout_delivery_preselection"
import price from "../price_module/index"

function actions() {
    log({
        "Variation": this.name,
        "Page Type": this.page_type
    })
    track(`${this.name} Loaded`, `Loaded`, true)
    track(this.name, `${this.name}: ${this.page_type} Loaded`, false)

    const status = pdp_add_to_basket.detect_status()
    const anchor_selector = status.isER && !status.isBoth ? "#checkout-combo" : !status.isER && !status.isBoth ? "#add-to-basket" : false
    log({status, anchor_selector})
    if(this.page_type == "pdp") {
        // Reset page to OTP
        if (elementManagement.exists(`[for="one-time-purchase"]`)) {
            elementManagement.get(`[for="one-time-purchase"]`).pop().click()
        }
        log("Running PDP Changes")
        price.insert(anchor_selector)
        er_module.insert(anchor_selector, status.isER, price.update_price)
        price.update_price()
        pdp_add_to_basket.add_cta(anchor_selector)
    } else if (this.page_type == "checkout") {
        log("Running Checkout Changes")
        make_selection("cnc")
    }
}

const Variant = {
    name: "Variation 1",
    css: variationCSS,
    page_type: detect_page(),
    conditions: () => {
        let conditions = []
        let page = detect_page()
        if(page == "pdp") {
            conditions.push(pdp_add_to_basket.isValid())
            conditions.push(!is_in_list())
        } else if (page == "checkout") {
            conditions.push(checkout_is_valid())
        } else {
            conditions.push(false)
        }
        conditions.push(!elementManagement.exists('[test="pah159_2"]'))
        log({message: `Polling: Conditions`, conditions})
        let result = conditions.every(a => a)
        log({message: `Polling: Result`, result})
        return result
    },
    actions,
    fallback: _ => {
        log(`Firing not loaded event`)
        let page = window.location.pathname
        track(`${Variant.name} Not loaded`, `${Variant.name}: ${page} Not loaded`, false)
    }
}

let nVariant = init(Variant)
nVariant.run()