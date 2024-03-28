type AllowedValueType<PropertyType> = PropertyType extends { id: any }
    ? PropertyType | PropertyType['id'] | undefined
    : PropertyType

export default function setProperty<
    Element extends HTMLElement,
    Property extends keyof Omit<
        Element,
        keyof HTMLElement | 'render' | 'content'
    >,
    Value extends AllowedValueType<Element[Property]>
>(element: Element, property: Property, value: Value) {
    /// @ts-expect-error
    element[property] = value
}
