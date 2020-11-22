export function textBlock(paragraphs: string[][], lSep: string = " ", pSep: string = "\n\n"): string {
    return paragraphs.map((lines: string[]) => lines.join(lSep)).join(pSep)
}

function clamp(actual: number, [lower, upper] = [0, 1]): number {
    return Math.max(lower, Math.min(upper, actual))
}


export function notEmpty<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

function iff<T, U>(value: T | null | undefined, mapper: (t: T) => U | void): U | null {
    if (value) {
        let result = mapper(value)
        if (result) {
            return result
        }
    }
    return null
}

export function sole<T>(value: T | null | undefined,): T[] {
    return value ? [value] : []
}

export function head<T>(arr: Array<T>, notPresentError: (() => Error) | null = null): T {
    if (arr.length > 0 && arr[0])
        return arr[0]
    else
        if (notPresentError)
            throw notPresentError()
        else
            throw Error('No element!')
}

export { clamp, iff }