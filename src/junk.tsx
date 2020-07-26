function bounds(insets: Insets, containerSize: vec2): Rect {
    let [cx, cy] = containerSize
    return {
        x: insets.left * cx,
        y: insets.top * cy,
        width: (1 - insets.right) * cx,
        height: (1 - insets.bottom) * cy
    }
}
function styleOfTransform(transform: Transform): CSSProperties {
    let [tx, ty, sx, sy] = [...transform.translate, ...transform.scale]
    return { transform: `translate(${tx}px,${ty}px) scale(${sx},${sy}) rotateX(0deg)` }
}