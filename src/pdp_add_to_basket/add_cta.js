import { elementManagement, log } from "../norman/index"
import detect_status from "./detect_status"
import cta_html from "./cta.html"
import handle_interaction from "./handle_interaction"

export default function add_cta() {
    let status = detect_status()
    log({status})
    elementManagement.remove(".pdp_add_to_basket")

    let target_selectors = []
    if(status.isER) {
        target_selectors.push(status.elements.easyRepeat.deliverySelector)
        target_selectors.push(status.elements.oneTimePurchaseEasyRepeatModule.deliverySelector)
    }
    if(status.isBoth || (!status.isBoth && !status.isER)) {
        target_selectors.push(status.elements.oneTimePurchase.deliverySelector)
    }

    log({target_selectors})
    let targets = elementManagement.getAll(target_selectors.join(", "))
    log({targets, cta_html: cta_html})
    targets.forEach(target => {
        let el = elementManagement.add(cta_html, "beforeBegin", target)
        el.addEventListener("click", e => {
            log({"msg": "Add to Basket CTA clicked", el})
            handle_interaction()
        })
        log({target, el})
    })
}