import { elementManagement } from "../norman";

export function basket_delivery_messaging() {
    let el = elementManagement.get(".basket-summary__delivery")
    if(el !== false) {
        el = el.pop()
        if(!!el.textContent.match(/Click & Collect or Delivery/g)) {
            let html_str = `<p class="basket-summary__delivery pah159_additional_messaging">Delivery options can be selected at checkout.</p>`
            elementManagement.add(html_str, "afterEnd", el)
        }
    }
}

export function basket_is_valid() {
    let text_el = elementManagement.get(".basket-message__text")
    if(text_el.length > 0) {
        let txt = text_el.pop().innerHTML || ""
        return !!txt.toLowerCase().match(/click (&|&amp;) collect/g) && !!txt.toLowerCase().match(/delivery/g)
    }
    return false
}

const basket = {
    is_valid: basket_is_valid,
    delivery_messaging: basket_delivery_messaging,
}

export default basket