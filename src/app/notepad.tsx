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


// // Checks if a circle intersects an axis aliged rectangle and returns a string with the edges that intersect
// function circleIntersectsRectEdges([cx, cy, cr]: vec3, [l, t, w, h]: vec4): string {
//     let edges = ""
//     const dt = Math.abs(cy - t)
//     const dr = Math.abs(cx - (l + w))
//     const db = Math.abs(cy - (t + h))
//     const dl = Math.abs(cx - l)
//     if (circleIntersectsRect([cx, cy, cr], [l, t, w, h])) {
//         if (dt < cr) { edges = edges.concat("t") }
//         if (dr < cr) { edges = edges.concat("r") }
//         if (db < cr) { edges = edges.concat("b") }
//         if (dl < cr) { edges = edges.concat("l") }
//     }
//     return edges
// }

// // Maps object values using the provide mapping function
// function mapValues<V, U>(obj: { [s: string]: V }, fn: (v: V) => U) {
//     return Object.fromEntries(
//       Object.entries(obj).map(
//         ([k, v], i) => [k, fn(v)]
//       )
//     )
//   }

// Rect
// type Rect = { x: number, y: number, width: number, height: number }

// Insets
// type Insets = { top: number, right: number, bottom: number, left: number }

// Transform
// type Transform = { translate: vec2, scale: vec2 }


// const [{ splitTranslate }, setSplitTranslate] = useSpring(() => ({ splitTranslate: [0, 0] }))
// const [{ splitScale }, setSplitScale] = useSpring(() => ({ splitScale: [1, 1] }))

// Collision for edges
// const [t, r, b, l] = panel.insets
// const [w, h] = [(1 - r - l) * width, (1 - t - b) * height]
// const [px, py] = [l * width, t * height]
// const radius = 40
// let edges = circleIntersectsRectEdges([x, y, radius], [px, py, w, h])
// theseDragEdges.set(panel.id, edges);

// Converts Insets to a set of screen coordinates
// function toScreen(insets: Insets) {
//     const { top: t, right: r, bottom: b, left: l } = insets;
//     // const [w, h] = [1 - r - l, 1 - t - b]
//     // return [[l, t], [l + w, t], [l + w, t + h], [l, t + h]]
//     return [t, 1 - r, 1 - b, l]
//   }

// bounding box check
// if (t < y && y < b && y > t && l < x && x < r) {

// }

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

// // Checks if a circle collides with a rect
// function circleIntersectsRect([cx, cy, cr]: vec3, [x, y, w, h]: vec4): boolean {
//   const dx = cx - Math.max(x, Math.min(cx, x + w));
//   const dy = cy - Math.max(y, Math.min(cy, y + h));
//   return (dx * dx + dy * dy) < (cr * cr)
// }



// function transform(insets: Insets, containerSize: vec2): Transform {
//   let [cx, cy] = containerSize
//   let { top: t, right: r, bottom: b, left: l } = insets;
//   let [w, h] = [1 - r - l, 1 - t - b]
//   console.log(cx)
//   return {
//     translate: [Math.floor((l + w / 2) * cx), Math.floor((t + h / 2) * cy)],
//     scale: [Math.floor(w * cx), Math.floor(h * cy)]
//   }
// }

// function styleOfTransform(transform: Transform): string {
//   let [tx, ty, sx, sy] = [...transform.translate, ...transform.scale]
//   return `translate(${tx}px,${ty}px) scale(${sx},${sy}) rotateX(0deg)`
// }


// function useStyle<T extends Element>(): [CSSStyleDeclaration | null, React.RefObject<T>] {
//   const ref = useRef<T>(null);
//   const [style, setStyle] = useState<CSSStyleDeclaration | null>(null);
//   useLayoutEffect(() => {
//     // I don't think it can be null at this point, but better safe than sorry
//     if (ref.current != null) {
//       setStyle(window.getComputedStyle(ref.current));
//     }
//   }, []);
//   return [style, ref]
// }


// function coalesce<T, U>(t: T | null | undefined, fn: (t: T) => U) { return t != null ? fn(t) : null }


// function style(variable: string): string {
//     return getComputedStyle(document.documentElement).getPropertyValue(variable);
//   }

// saveState(history, initialState, future)
// function saveState(history: Stack<State>, state: State, future: Stack<State>) {
//   localStorage.setItem("auto-saved-state", JSON.stringify(state.toJS()))
// }

// function loadState() {
//   return {
//     history: null,
//     state: coalesce(localStorage.getItem("auto-saved-state"), json => fromJS(JSON.parse(json)) as State),
//     future: null
//   }
// }
// const savedState = loadState();

// function Canvas(): JSX.Element {
    //     const canvasRef = useRef<HTMLCanvasElement>(null)
    
    //     const draw = (ctx: CanvasRenderingContext2D) => {
        //         ctx.fillStyle = "#FF0000"
        //         ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        //     }
        //     useEffect(() => {
            //         const canvas = canvasRef.current 
            //         const ctx = canvasRef.current?.getContext("2d")
            //         ctx && draw(ctx)
            //     },[draw])
            
            //     return <canvas ref={canvasRef} id="background"/>
            // }


// required to please the create-react-app gods
export { }