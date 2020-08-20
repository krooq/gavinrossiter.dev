function clamp(actual: number, [lower, upper] = [0, 1]): number {
    return Math.max(lower, Math.min(upper, actual))
}

export { clamp }