import { elementManagement } from "../../norman"
import template from "./template.html"
import price from "../../price_module"

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

export function insert(update_cb) {
    let savings = get_frequency_savings()
    let el = elementManagement.add(template, "beforeBegin", "#checkout-combo")
    el.querySelector(".frequency.er .saving").textContent = `${savings.er}`

    el.querySelectorAll(".frequency").forEach(el => el.addEventListener("click", e => {
        active_toggle(e)
        update_cb()
    }))
}

export const er_module = {
    insert,
    get_frequency_savings,
}

export default er_module