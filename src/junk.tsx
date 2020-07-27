// export function bounds(insets: Insets, containerSize: vec2): Rect {
//     let [cx, cy] = containerSize
//     return {
//         x: insets.left * cx,
//         y: insets.top * cy,
//         width: (1 - insets.right) * cx,
//         height: (1 - insets.bottom) * cy
//     }
// }
// export function styleOfTransform(transform: Transform): CSSProperties {
//     let [tx, ty, sx, sy] = [...transform.translate, ...transform.scale]
//     return { transform: `translate(${tx}px,${ty}px) scale(${sx},${sy}) rotateX(0deg)` }
// }


// const [{ splitTranslate }, setSplitTranslate] = useSpring(() => ({ splitTranslate: [0, 0] }))
// const [{ splitScale }, setSplitScale] = useSpring(() => ({ splitScale: [1, 1] }))



// const splitGuide = useDrag(e => {
//     let panel = target
//     if (panel != null) {
//         const [x0, y0, w, h] = computedBounds(panel)
//         let [ex, ey] = e.xy
//         var sx = 2
//         var sy = h
//         var tx = clampInterval({ left: ex, width: sx }, { left: x0, width: w })
//         var ty = x0 + h / 2
//         setSplitTranslate({ splitTranslate: [tx, ty], immediate: true })
//         setSplitScale({ splitScale: [sx, sy] })
//     }
// })
// {...splitGuide()}
// <animated.div id="split-indicator" style={{
//   transform: to(
//     [splitTranslate, splitScale],
//     ([x, y], [sx, sy]) => `translate3d(${x}px,${y}px,0) scale(${sx},${sy})`,
//   )
// }} />
export { }