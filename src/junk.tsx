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
// function useTargetElement(): [HTMLElement | null, (gesture: FullGestureState<any>) => void] {
//     const [target, setTarget] = useState<HTMLElement | null>(null)
//     return [target, (gesture: FullGestureState<any> | null) => {
//       setTarget(gesture?.event?.target instanceof HTMLElement ? gesture.event.target : null)
//     }];
//   }


// Creates 2 new panels from the given panel using direction to determine the axis of the split
// function splitPanel(panel: Panel, initial: Vector2, direction: Vector2, windowSize: Vector2): [Panel?, Panel?] {
//   var id1 = uuidv4()
//   var id2 = uuidv4()
//   const [w, h] = windowSize
//   console.log(direction)
//   const [dx, dy] = direction
//   const [x, y] = [initial[0] / w, initial[1] / h]
//   // horizontal slice, dy=0
//   if (dx === 1 && dy === 0) {
//     var p1 = { id: id1, insets: { ...panel.insets, bottom: (1 - y) } }
//     var p2 = { id: id2, insets: { ...panel.insets, top: y } }
//     return [p1, p2]
//   } else if (dx === 0 && dy === 1) {
//     // vertical slice, dx=0
//     var p1 = { id: id1, insets: { ...panel.insets, right: (1 - x) } }
//     var p2 = { id: id2, insets: { ...panel.insets, left: x } }
//     return [p1, p2]
//   }
//   return [undefined, undefined]
// }


// // Clamps a 1D interval within a 1D bound.
// function clampInterval(interval: { left: number, width: number }, bound: { left: number, width: number }) {
//     let intervalRadius = Math.ceil(interval.width / 2)
//     return Math.max(Math.min(interval.left, bound.left + bound.width - intervalRadius), bound.left + intervalRadius)
// }


// function computedBounds(element: HTMLElement) {
//     return [element.offsetTop, element.offsetLeft, element.offsetWidth, element.offsetHeight]
//   }

export { }