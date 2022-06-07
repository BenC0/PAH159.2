import "./index.css";
import template from "./template.html"
import { elementManagement, watchForChange, track, log } from "../norman"

// Update the original Easy Repeat frequency select element value
export function update_og_frequency() {
    let og_frequency = elementManagement.get("#frequency")
    if (og_frequency.length > 0) {
        let new_frequency = elementManagement.get("#purchase_frequency")
        new_frequency = new_frequency.pop()
        og_frequency = og_frequency.pop()
        og_frequency.value = new_frequency.value
    }
}

// Get the Easy Repeat savings string
export function get_frequency_savings() {
    let er_saving_el = elementManagement.get("#checkout-combo__offer-text-er").pop()
    let er_saving_txt = er_saving_el.textContent || ""
    let txt = er_saving_txt.match(/[0-9]*%/g)
    let er_saving_amount = ""
    if (!!txt) {
        er_saving_amount = `Save ${txt}`
    }
    return {
        er: er_saving_amount
    }
}

// function to toggle the active frequency, also triggers a click on the original frequency element to toggle the C&C find stores functionality
export function active_toggle(e) {
    let ct = e.currentTarget
    elementManagement.getAll(`[test="pah159_2"] .frequency`).forEach(el => el.classList.remove("active"))
    ct.classList.add("active")
    if (ct.classList.contains("er")) {
        elementManagement.get(`#checkout-combo label[for="repeat-delivery"]`).pop().click()
        track(`Purchase Frequency Type Changed`, `Easy Repeat`, false)
    } else {
        elementManagement.get(`#checkout-combo label[for="one-time-purchase"]`).pop().click()
        track(`Purchase Frequency Type Changed`, `One Time Purchase`, false)
    }
}

// Update the available frequency options using the pre-existing values.
export function update_frequency_options() {
    let og_frequencies = elementManagement.get("#frequency option")
    if (og_frequencies.length > 0) {
        elementManagement.get("#purchase_frequency").forEach(el =>  el.innerHTML = "")
        let vals = og_frequencies.map(x => x.value)
        vals.forEach(v => {
            let str = parseInt(v) == -1 ? "Please select a frequency" : `Every ${v} weeks`
            elementManagement.add(`<option value="${v}">${str}</option>`, "beforeEnd", "#purchase_frequency")
        })
    }
}

// Validate the frequency option, this is needed for add to basket and check stock in local store for Easy Repeat.
export function validate_frequency_options(scroll = false) {
    let frequency_sel = "#purchase_frequency"
    if (elementManagement.exists(frequency_sel)) {
        let frequency_el = elementManagement.get(frequency_sel).pop()
        let frequency_val = frequency_el.value
        if (parseInt(frequency_val) == -1) {
            frequency_el.parentNode.classList.add("error")
            if (scroll) {
                window.scrollTo({
                    top: frequency_el.closest(".frequency_module").offsetTop,
                    left: 0,
                    behavior: 'smooth'
                })
            }
            return false
        } else {
            frequency_el.parentNode.classList.remove("error")
            return true
        }
    }
    return false
}

export function add_er_size_messaging(el, target) {
    while (el.textContent.match(/up to/g).length > 1) {
        el.textContent = el.textContent.replace(/up to up to/g, "up to")
    }
    elementManagement.add(`<p class="er_size_messaging">${el.textContent}</p>`, "beforeEnd", target.querySelector("label"))
}

export function update_frequency_availability() {
    let selector = "#add-to-basket, #checkout-combo"
    if (elementManagement.exists(selector)) {
        let options = elementManagement.getAll(selector)
        let visible_options = options.filter(el => el.style.display != "none")
        let hidden_options = options.filter(el => el.style.display == "none")
        log({
            options,
            visible_options,
            hidden_options
        }, false)
        if (visible_options.length == 0) {
            // show all frequencies with additional "ER available on X" messaging if needed
            if (elementManagement.exists("#pdpertag #erAvailTag") && !elementManagement.exists(".includes_er_size_messaging")) {
                elementManagement.getAll(".frequency.er").forEach( el => {
                    add_er_size_messaging(elementManagement.get("#pdpertag #erAvailTag").pop(), el)
                    el.classList.add("includes_er_size_messaging")
                })
            }
            elementManagement.getAll(".frequency").forEach( el => {
                el.classList.remove("inactive")
            })
        } else {
            // show all frequencies within visible option   
            let visible_option = visible_options[0]
            if (visible_option.classList.contains("checkout-combo")) {
                // all options available
                elementManagement.getAll(".frequency").forEach( el => {
                    el.classList.remove("inactive")
                })
                update_frequency_savings()
            } else {
                // only OTP avaialble
                elementManagement.get(".frequency.otp").pop().classList.remove("inactive")
                elementManagement.get(".frequency.er").pop().classList.add("inactive")
            }
        }
    }
}

export function update_frequency_savings() {
    let savings = get_frequency_savings()
    elementManagement.get(".frequency.er .saving").pop().textContent = `${savings.er}`
}

export function add_cnc_listener() {
    let er_check_stock_sel = ".stock-level-btn-easy, .stock-level-link-easy"
    if(elementManagement.exists(er_check_stock_sel)) {
        let er_check_stock_els = elementManagement.getAll(er_check_stock_sel)
        er_check_stock_els.forEach(er_check_stock_el => {
            er_check_stock_el.addEventListener("click", e => {
                e.preventDefault()
                e.stopPropagation()
                validate_frequency_options(true)
            })
        })
    }
}

// Insert the new frequency module and if Easy Repeat is available, update the relevant information and set the click and change event listeners.
export function insert(anchor_selector, er_is_available, update_cb, is_both) {
    let el = elementManagement.add(template, "beforeBegin", anchor_selector)
    
    if (er_is_available) {
        if (is_both) {
            update_frequency_availability()
        }

        update_frequency_savings()
        update_frequency_options()
        
        el.querySelectorAll(".frequency").forEach(el => {
            el.addEventListener("click", e => {
                if(!e.currentTarget.classList.contains("active")) {
                    active_toggle(e)
                    update_cb()
                }
            })
        })
        
        el.querySelectorAll("#purchase_frequency").forEach(el => el.addEventListener("change", e => {
            let v = e.currentTarget.value || "-1"
            track(`Easy Repeat Frequency Changed to ${v}`, v, false)
            update_og_frequency()
            validate_frequency_options(false)
        }))

        add_cnc_listener()
        watchForChange(elementManagement.get("#DeliveryPromiseERDisplayView").pop(), add_cnc_listener, {subtree: true, childList: true}, "er_promise_observer")
    } else {
        el.querySelector(".frequency.er").remove()
    }
}

export const frequency_module = {
    insert,
    get_frequency_savings,
    update_frequency_availability,
}

export default frequency_module