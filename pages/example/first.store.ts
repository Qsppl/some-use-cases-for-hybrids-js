import { Model, StorageValues, store } from 'https://esm.sh/hybrids@8.2.14'

const FirstStoreSource: { [key: number]: StorageValues<IFirst> } = {
    0: { id: '0', content: 'qweqwe', creationDatetime: 1711014498391 },
    1: { id: '1', creationDatetime: 1711014651455 },
    2: { id: '2', content: 'swswswsws', creationDatetime: 1711014682503 },
}

export interface IFirst {
    id: string
    content: string
    creationDatetime: number
}

export const FirstStore: Model<IFirst> = {
    id: true,
    content: 'default content of first model',
    creationDatetime: NaN,
    [store.connect]: {
        list: (id) => [...Object.values(FirstStoreSource)],
        get: (id) => FirstStoreSource[Number(id)] ?? null,
        set: (id, values) => {
            if (id === undefined && values) {
                // create
                const autoincrementedId = Object.values(FirstStoreSource).length
                FirstStoreSource[autoincrementedId] = {
                    ...values,
                    id: String(autoincrementedId),
                    creationDatetime: Number(new Date()),
                }
                return FirstStoreSource[autoincrementedId]
            }

            if (!isNaN(Number(id)) && values) {
                // update
                FirstStoreSource[Number(id)] = { ...values }
                return FirstStoreSource[Number(id)]
            }

            throw new Error()
        },
        loose: true,
    },
}
