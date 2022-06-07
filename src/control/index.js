import { log, track, init, elementManagement } from "../norman/index"
import pdp_add_to_basket from "../pdp_add_to_basket/index"
import detect_page from "../detect_page"
import { is_in_list } from "../subscribe/init";
import { checkout_is_valid } from "../checkout_fulfillment_method_preselection"

function actions() {
    // Standard logging/tracking
    log({
        "Variation": this.name,
        "Page Type": this.page_type
    })

    // Evaluate page type and run relevant changes
    if(this.page_type == "pdp") {
        track(`${this.name} Loaded`, `Loaded`, true)
    } else if (this.page_type == "checkout") {
        // Select Click & Collect on checkout
        track(`${this.name} Checkout Loaded`, `Loaded`, false)
    }
}

// Declare Variant details for Norman.
const Variant = {
    name: "Control",
    css: "",
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
    fallback: null
}

// Initialise and run the variant with Norman
let nVariant = init(Variant)
nVariant.run()