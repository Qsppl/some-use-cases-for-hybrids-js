import { Model, StorageValues, store } from 'https://esm.sh/hybrids@8.2.14'
import { FirstStore, IFirst } from "./first.store.js"

const SecondStoreSource: { [key: number]: StorageValues<ISecond> } = {
    0: { id: "0", related: '1', creationDatetime: 1711120485090 },
    1: { id: "1", color: "green", related: '0', creationDatetime: 1711120562192 },
    2: { id: "2", color: "orange", creationDatetime: 1711120567576 },
}

export interface ISecond {
    id: string
    color: string
    related?: IFirst
    creationDatetime: number
    attached: IFirst[]
}

export const SecondStore: Model<ISecond> = {
    id: true,
    color: "default color of second model",
    related: FirstStore,
    attached: [FirstStore],
    creationDatetime: NaN,
    [store.connect]: {
        list: (id) => [...Object.values(SecondStoreSource)],
        get: (id) => SecondStoreSource[Number(id)] ?? undefined,
        set: (id, values) => {
            if (id === undefined && values) { // create
                const autoincrementedId = Object.values(SecondStoreSource).length
                SecondStoreSource[autoincrementedId] = {
                    ...values,
                    id: String(autoincrementedId),
                    creationDatetime: Number(new Date)
                }
                return SecondStoreSource[autoincrementedId]
            }

            if (!isNaN(Number(id)) && values) { // update
                SecondStoreSource[Number(id)] = { ...values }
                return SecondStoreSource[Number(id)]
            }

            throw new Error()
        },
        loose: true
    },
}