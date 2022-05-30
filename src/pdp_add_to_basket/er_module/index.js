import { elementManagement } from "../../norman"
import template from "./template.html"
import price from "../../price_module"

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
        }))
    } else {
        el.querySelector(".frequency.er").remove()
    }
}

export const er_module = {
    insert,
    get_frequency_savings,
}

export default er_module