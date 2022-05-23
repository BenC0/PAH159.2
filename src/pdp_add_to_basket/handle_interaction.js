import { elementManagement, log } from "../norman"

export function get_qty() {
    let selector = '[name="quantity"]'
    if(elementManagement.exists(selector)) {
        let el = elementManagement.get(selector).pop()
        let val = el.value
        log({el, val})
        return isNaN(parseInt(val)) ? 1 : parseInt(val)
    }
    return 1
}

export function get_single_price() {
    let selector = '#offerPrice'
    if(elementManagement.exists(selector)) {
        let el = elementManagement.get(selector).pop()
        let price = el.textContent.replace(/£/g, "")
        return isNaN(parseFloat(price)) ? 1 : parseFloat(price)
    }
    return 0
}

export function format_price(x) {
    return Number.parseFloat(x).toFixed(2);
}

export default function handle_interaction() {
    let cncProductPartNumber_el = elementManagement.get("#cncProductPartNumber").pop()
    let cncProductPartNumber = cncProductPartNumber_el.value

    let cncProductId_el = elementManagement.get("#cncProductId").pop()
    let cncProductId = cncProductId_el.value

    let price_el = elementManagement.get("#offerPrice").pop()
    let price = price_el.textContent
    
    QuickViewJS.addSkuToBasketFromMob(cncProductPartNumber, cncProductId, cncProductId, price)
    
    let qty_added_el = elementManagement.get(`input[name="quantity"]`).pop(0)
    let qty = parseInt(qty_added_el.value)
        
    GoogleTagShoppingCart.addToCart(cncProductPartNumber, qty);
    updateCartHeader(parseInt(qty));

    let qty_str = `Subtotal (${qty} item${qty > 1 ? "s": ""})`
    let single_price = get_single_price()
    let total = format_price(single_price * qty)
    log({
        qty,
        total,
        qty_str,
        single_price,
    })

    if(!!INC) {
        if(!!INC.methods) {
            if(typeof INC.methods.showSidebar == "function") {
                INC.methods.showSidebar();
            }
            if(typeof INC.methods.updateSidebarBlock == "function") {
                INC.methods.updateSidebarBlock();
                elementManagement.get(".sidebar_product_quantity_label").forEach(el => {
                    el.textContent = qty
                })
                elementManagement.get(".inc_header_item_count_title_text").forEach(el => {
                    el.textContent = qty_str
                })
                elementManagement.get(".inc_cart_added_product_desc_subtotal_price_active_text").forEach(el => {
                    el.textContent = `£${total}`
                })
            }
        }
    }
}