import { elementManagement } from "../norman"

export function fire_size_change_event(e) {
    const size_change_event = new Event("size_change")
    document.body.dispatchEvent(size_change_event, {
        size_selected: e.currentTarget.value
    })
}

export function attach_listeners(cb) {
    const inputs = elementManagement.getAll('[name="Size"]')

    inputs.forEach(input => input.addEventListener("change", e => {
        console.warn("size changed")
        fire_size_change_event(e)
    }))

    document.body.addEventListener("size_change", cb)
}

export const size_module = {
    attach_listeners
}

export default size_module