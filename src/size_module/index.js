import { elementManagement } from "../norman"

export function fire_size_change_event(e) {
    const size_change_event = new Event("size_change")
    document.body.dispatchEvent(size_change_event, {
        size_selected: e.currentTarget.value
    })
}

export function attach_listeners(cb) {
    const inputs = elementManagement.getAll('[name="Size"], [name="Weight"]')
    inputs.forEach(input => {
        input.addEventListener("click", fire_size_change_event)
        input.addEventListener("change", fire_size_change_event)
    })
    document.body.addEventListener("size_change", cb)
}

export const size_module = {
    attach_listeners
}

export default size_module