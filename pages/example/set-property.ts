import { ModelIdentifier } from 'https://esm.sh/hybrids@8.2.14'

type AllowedValueType<PropertyType> = PropertyType extends { id: ModelIdentifier }
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
    /// @ts-expect-error Typescript doesn't support different property getter and setter types, so we just skip typing
    element[property] = value
}
