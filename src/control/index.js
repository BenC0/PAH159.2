import { log, track, init, elementManagement, watchForChange } from "../norman/index"
import pdp_add_to_basket from "../pdp_add_to_basket/index"
import detect_page from "../detect_page"
import { is_in_list } from "../subscribe/init";
import { checkout_is_valid } from "../checkout_fulfillment_method_preselection"

function track_purchase_frequency_type_change() {
    if(elementManagement.exists("#checkout-combo")) {
        elementManagement.get(`#checkout-combo input[name="checkout"]`).forEach(el => {
            el.addEventListener("change", e => {
                if(e.currentTarget.id == "repeat-delivery") {
                    track(`Purchase Frequency Type Changed`, `Easy Repeat`, false)
                } else if(e.currentTarget.id == "one-time-purchase") {
                    track(`Purchase Frequency Type Changed`, `One Time Purchase`, false)
                }
            })
        })
    }
}

function track_er_frequency_change() {
    if(elementManagement.exists("#checkout-combo")) {
            elementManagement.get(`#checkout-combo [data-module="input_select"] ul li`).forEach(el => {
            watchForChange(el, _ => {
                if (el.classList.contains("active")){ 
                    let v = el.dataset.value || "-1"
                    track(`Easy Repeat Frequency Changed to ${v}`, v, false)
                }
            })
        })
    }
}

function track_er_pet_name_change() {
    if(elementManagement.exists("#checkout-combo")) {
        elementManagement.get(`#checkout-combo #whichPet`).forEach(el => {
            el.addEventListener("change", e => {
                track(`Pet name changed`, `Pet name changed`, false)
            })
        })
    }
}

function track_qty_change() {
    if(elementManagement.exists("#checkout-combo, #add-to-basket")) {
        elementManagement.get(`#checkout-combo [name="quantity"], #add-to-basket [name="quantity"]`).forEach(el => {
            el.setAttribute("last_val", el.value)
        })

        window.setInterval(_ => {
            elementManagement.get(`#checkout-combo [name="quantity"], #add-to-basket [name="quantity"]`).forEach(el => {
                let changed = el.value !== el.getAttribute("last_val")
                if (changed) {
                    track(`Quantity Changed`, `Quantity changed to ${el.value}`, false)
                    el.setAttribute("last_val", el.value)
                }
            })
        }, 10)

        elementManagement.getAll(`#checkout-combo .add-to-basket__change--add, #add-to-basket .add-to-basket__change--add`).forEach(el => {
            el.addEventListener("click", e => {
                let input = e.currentTarget.parentNode.querySelector("input")
                track(`Quantity Increased`, `Increase to ${input.value}`, false)
            })
        })

        elementManagement.getAll(`#checkout-combo .add-to-basket__change--minus, #add-to-basket .add-to-basket__change--minus`).forEach(el => {
            el.addEventListener("click", e => {
                let input = e.currentTarget.parentNode.querySelector("input")
                track(`Quantity Decreased`, `Decrease to ${input.value}`, false)
            })
        })
    }
}

function pdp_tracking() {
    track_purchase_frequency_type_change()
    track_er_frequency_change()
    track_er_pet_name_change()
    track_qty_change()
}

function actions() {
    // Standard logging/tracking
    log({
        "Variation": this.name,
        "Page Type": this.page_type
    })

    // Evaluate page type and run relevant changes
    if(this.page_type == "pdp") {
        track(`${this.name} Loaded`, `Loaded`, true)
        pdp_tracking()
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