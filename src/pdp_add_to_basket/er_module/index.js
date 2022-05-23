import { elementManagement } from "../../norman"
import template from "./template.html"

export function get_frequency_savings() {
    let er_saving_el = elementManagement.get("#checkout-combo__offer-text-er").pop()
    let er_saving_txt = er_saving_el.textContent || ""
    let er_saving_amount = `Save ${er_saving_txt.match(/[0-9]*%/g)}` || ""
    return {
        er: er_saving_amount
    }
}

export function insert() {
    let savings = get_frequency_savings()
    let el = elementManagement.add(template, "beforeBegin", "#checkout-combo")
    console.log({el})
    el.querySelector(".frequency.er .saving").textContent = `${savings.er}`
}

export const er_module = {
    insert,
    get_frequency_savings,
}

export default er_module