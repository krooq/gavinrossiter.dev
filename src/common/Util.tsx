export function textBlock(paragraphs: string[][], lSep: string=" ", pSep: string="\n\n"): string { 
    return paragraphs.map((lines: string[]) => lines.join(lSep)).join(pSep)
}