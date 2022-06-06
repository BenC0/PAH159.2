import { elementManagement } from "../norman"
import template from "./template.html"

export function update_og_frequency() {
    let og_frequency = elementManagement.get("#frequency")
    if (og_frequency.length > 0) {
        let new_frequency = elementManagement.get("#purchase_frequency")
        new_frequency = new_frequency.pop()
        og_frequency = og_frequency.pop()
        og_frequency.value = new_frequency.value
    }
}

export function get_frequency_savings() {
    let er_saving_el = elementManagement.get("#checkout-combo__offer-text-er").pop()
    let er_saving_txt = er_saving_el.textContent || ""
    let er_saving_amount = `Save ${er_saving_txt.match(/[0-9]*%/g)}` || ""
    return {
        er: er_saving_amount
    }
}

export function active_toggle(e) {
    let ct = e.currentTarget
    elementManagement.getAll(`[test="pah159_2"] .frequency`).forEach(el => el.classList.remove("active"))
    ct.classList.add("active")
    if (ct.classList.contains("er")) {
        elementManagement.get(`#checkout-combo label[for="repeat-delivery"]`).pop().click()
    } else {
        elementManagement.get(`#checkout-combo label[for="one-time-purchase"]`).pop().click()
    }
}

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

export function insert(anchor_selector, er_is_available, update_cb) {
    let el = elementManagement.add(template, "beforeBegin", anchor_selector)
    if (er_is_available) {
        let savings = get_frequency_savings()
        el.querySelector(".frequency.er .saving").textContent = `${savings.er}`
        update_frequency_options()
        
        el.querySelectorAll(".frequency").forEach(el => el.addEventListener("click", e => {
            active_toggle(e)
            update_cb()
        }))
        
        el.querySelectorAll("#purchase_frequency").forEach(el => el.addEventListener("change", e => {
            update_og_frequency()
            validate_frequency_options(false)
        }))

        let er_check_stock_sel = ".stock-level-btn-easy"
        if(elementManagement.exists(er_check_stock_sel)) {
            let er_check_stock_el = elementManagement.get(er_check_stock_sel).pop()
            er_check_stock_el.addEventListener("click", e => {
                e.preventDefault()
                e.stopPropagation()
                validate_frequency_options(true)
            })
        }
    } else {
        el.querySelector(".frequency.er").remove()
    }
}

export const frequency_module = {
    insert,
    get_frequency_savings,
}

export default frequency_module