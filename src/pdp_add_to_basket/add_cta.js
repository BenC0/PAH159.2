import { elementManagement, log } from "../norman/index"
import detect_status from "./detect_status"
import cta_html from "./cta.html"
import handle_interaction from "./handle_interaction"

export default function add_cta() {
    elementManagement.remove(".pdp_add_to_basket")
    let el = elementManagement.add(cta_html, "beforeBegin", "#checkout-combo")
    el.addEventListener("click", e => {
        log({"msg": "Add to Basket CTA clicked", el})
        handle_interaction()
    })
    log({el})
}