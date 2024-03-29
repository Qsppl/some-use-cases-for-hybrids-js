export default function setProperty(element, property, value) {
    /// @ts-expect-error Typescript doesn't support different property getter and setter types, so we just skip typing
    element[property] = value;
}
