import { elementManagement } from "../norman";

export default function detect_page() {
    let isPDP = elementManagement.exists(".pah.pdp")
    if(isPDP) {
        return "pdp"
    }
    let isBasket = elementManagement.exists(".basket-wrapper")
    if(isBasket) {
        return "basket"
    }
    let isCheckout = elementManagement.exists(".checkout-mobile-page")
    if(isCheckout) {
        return "checkout"
    }
    return ""
}