export default function setProperty(element, property, value) {
    /// @ts-expect-error
    element[property] = value;
}
