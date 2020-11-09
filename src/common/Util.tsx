export function textBlock(paragraphs: string[][], lSep: string = " ", pSep: string = "\n\n"): string {
    return paragraphs.map((lines: string[]) => lines.join(lSep)).join(pSep)
}

function clamp(actual: number, [lower, upper] = [0, 1]): number {
    return Math.max(lower, Math.min(upper, actual))
}

export { clamp }