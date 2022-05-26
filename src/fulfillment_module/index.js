import template_html from "./template.html"
import {elementManagement} from "../norman"

export function add_methods() {
    let el = elementManagement.add(template_html, "beforeBegin", "#checkout-combo")
}

export const fulfillment = {
    add_methods,
}

export default fulfillment
