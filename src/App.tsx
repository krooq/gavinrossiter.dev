import React, { useState, useLayoutEffect, useRef } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { useGesture } from 'react-use-gesture'
import { animated, Spring } from 'react-spring';
import { FullGestureState } from 'react-use-gesture/dist/types';
import useWindowDimensions from './useWindowDimensions';
import { enableAllPlugins, produce } from 'immer'
import _ from 'lodash'
import { has } from 'immer/dist/internal';
enableAllPlugins()


type vec2 = [number, number]
type vec3 = [number, number, number]
type vec4 = [number, number, number, number]

// Rect
// type Rect = { x: number, y: number, width: number, height: number }

// Insets
type Insets = { top: number, right: number, bottom: number, left: number }

// Transform
// type Transform = { translate: vec2, scale: vec2 }

type Axis = "vertical" | "horizontal"

// Panel
type Panel = { id: string, insets: vec4 }


// State - Snapshot view of the domain data state
type State = { panels: Map<string, Panel> }
// Eon - States past, present and future
type Eon = { past: Array<State>, present: State, future: Array<State> }
// Metadata - State that is not recorded in an Eon
type Metadata = { selectedPanels: Set<string>, selectedEdges: Map<string, string> }

// function coalesce<T, U>(t: T | null | undefined, fn: (t: T) => U) { return t != null ? fn(t) : null }


// App
function App() {
  const [windowWidth, windowHeight] = useWindowDimensions();
  const initialPanel: Panel = { id: uuidv4(), insets: [0, 0, 0, 0] }
  const initialSnapshot = {
    panels: new Map<string, Panel>().set(initialPanel.id, initialPanel)
  }

  // const savedState = loadState();
  const maxHistory = 50
  const maxPanels = 512
  const [eon, setEon] = useState<Eon>({ past: [], present: initialSnapshot, future: [] })
  const [metadata, setMetadata] = useState<Metadata>({ selectedPanels: new Set(), selectedEdges: new Map() })
  // saveState(history, initialState, future)

  function undo() {
    setEon(produce(eon, draft => {
      const { past, present } = draft
      let next = past.pop()
      if (next != null) {
        draft.past = past
        draft.present = next
        draft.future.push(present)
      }
    }))
  }

  function redo() {
    setEon(produce(eon, draft => {
      const { present, future } = draft
      let next = future.pop()
      if (next != null) {
        draft.past.push(present)
        draft.present = next
        draft.future = future
      }
    }))
  }

  function pushState(update: (present: State) => void) {
    setEon(produce(eon, draft => {
      const { past, present } = draft
      past.push(present)
      draft.past = _.takeRight(past, maxHistory)
      draft.present = produce(present, update)
      draft.future = []
    }))
  }

  function updateState(update: (present: State) => void) {
    setEon(produce(eon, draft => {
      update(draft.present)
    }))
  }

  function interact(action: (data: Metadata) => void) {
    setMetadata(produce(metadata, action))
  }

  function deleteSelectedPanels() {
    pushState(state => interact(metadata => {
      for (const panel of metadata.selectedPanels) {
        state.panels.delete(panel)
      }
    }))
  }

  function clearSelectedPanels() {
    interact(metadata => { metadata.selectedPanels = new Set() })
  }

  function splitSelectedPanels(axis: Axis) {
    pushState(state => interact(metadata => {
      const selectedPanels = [...state.panels.values()].filter(p => metadata.selectedPanels.has(p.id))
      const splitPanels = selectedPanels.flatMap(p => splitPanel(p, axis))
      for (const panel of metadata.selectedPanels) { state.panels.delete(panel) }
      for (const panel of splitPanels) { state.panels.set(panel.id, panel) }
    }))
  }
  const mainRef = useRef<HTMLDivElement>(null);

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

  function nbSelectedPanels() { return metadata.selectedPanels.size }
  function noSelectedPanels() { return nbSelectedPanels() === 0 }
  function tooManyPanels() { return (eon.present.panels.size + nbSelectedPanels() * 2) > maxPanels }


  const [gesture, setGesture] = useState<FullGestureState<any> | null>(null)
  const [dragEdges, setDragEdges] = useState<Map<string, string>>(new Map())

  const bind = useGesture({
    onMove: g => {
      setGesture(g)
      let [width, height] = [mainRef?.current?.clientWidth ?? 1, mainRef?.current?.clientHeight ?? 1]
      var [x, y] = g.xy
      const edgeSize = 40

      let theseDragEdges: Map<string, string> = new Map()
      for (const panel of eon.present.panels.values()) {

        var [t, r, b, l] = insetsToBounds(panel.insets)
        var [t, r, b, l] = [t * height, r * width, b * height, l * width]
        let edges = ""
        if (pointInBounds([x, y], [t, r, t + edgeSize, l])) { edges = edges.concat("t") }
        if (pointInBounds([x, y], [t, r, b, r - edgeSize])) { edges = edges.concat("r") }
        if (pointInBounds([x, y], [b - edgeSize, r, b, l])) { edges = edges.concat("b") }
        if (pointInBounds([x, y], [t, l + edgeSize, b, l])) { edges = edges.concat("l") }
        if (edges.length > 0) {
          theseDragEdges.set(panel.id, edges);
        }
      }
      interact(metadata => {
        metadata.selectedEdges = theseDragEdges
      })
      setDragEdges(theseDragEdges)

      document.body.style.cursor = resizeCursor(dragEdges);

      // updateState(({ panels }) => {
      //   for (const panel of panels.values()) {
      //     if (dragEdges.get(panel.id)?.length ?? 0 > 0) {
      //       panel.selected = true
      //     } else {
      //       panel.selected = false
      //     }
      //   }
      // })
    },
    onDragStart: g => {
      interact(metadata => {
        const panel = eon.present.panels.get(gestureTarget(g)?.id ?? '')
        if (panel != null) {
          if (metadata.selectedPanels.has(panel.id) && !metadata.selectedEdges.has(panel.id)) {
            metadata.selectedPanels = new Set([])
            // metadata.selectedPanels.delete(panel.id)
          } else {
            metadata.selectedPanels = new Set([panel.id])
            // metadata.selectedPanels.add(panel.id)
          }
        }
      })


    },
    onDrag: ({ xy }) => {

      // if (target != null) {
      //   
      // }
    }
  }, {})


  return (
    <div id="app" style={{ width: windowWidth, height: windowHeight }} >
      <div id="main" ref={mainRef}>
        {[...eon.present.panels.values()].map(p => {
          var [top, right, bottom, left] = p.insets.map(percent)
          return (
            <Spring key={p.id}
              to={{
                backgroundImage: `
                  linear-gradient(${metadata.selectedPanels.has(p.id) ? "#ffffff09,#ffffff09" : "#00000000,#00000000"}),
                  linear-gradient(to bottom, ${metadata.selectedEdges.get(p.id)?.includes("t") ? "#ffffff22" : "#00000000"}, 20px, #00000000 30px),
                  linear-gradient(to left, ${metadata.selectedEdges.get(p.id)?.includes("r") ? "#ffffff22" : "#00000000"}, 20px, #00000000 30px),
                  linear-gradient(to top, ${metadata.selectedEdges.get(p.id)?.includes("b") ? "#ffffff22" : "#00000000"}, 20px, #00000000 30px),
                  linear-gradient(to right, ${metadata.selectedEdges.get(p.id)?.includes("l") ? "#ffffff22" : "#00000000"}, 20px, #00000000 30px)
                  `,
                // style("--panel-highlight-color") : style("--panel-background-color"),
                top,
                right,
                bottom,
                left,
              }}>
              {({ backgroundImage, top, right, bottom, left }) =>
                <animated.div
                  {...bind()}
                  key={p.id}
                  id={p.id}
                  className='panel'
                  style={{
                    backgroundImage,
                    top, right, bottom, left,
                    // borderWidth: "100px",
                    // borderStyle: "solid",
                    // backgroundImage: "linear-gradient(to left, #ffffffaa, 5px, #00000000 20px)"
                    // width: "1px",
                    // height: "1px",
                    // transform: styleOfTransform(transform(p.insets, [mainRef?.current?.clientWidth ?? 0, mainRef?.current?.clientHeight ?? 0])),
                  }}
                // [parseInt(mainStyle?.width ?? '0'), parseInt(mainStyle?.height ?? '0')]
                // [mainRef?.current?.scrollWidth ?? 0, mainRef?.current?.scrollHeight ?? 0]
                />}
            </Spring>
          )
        })}
      </div>
      <div id="toolbar">
        <button onClick={e => clearSelectedPanels()} disabled={noSelectedPanels()}>Clear Selection</button>
        <button onClick={e => splitSelectedPanels("vertical")} disabled={tooManyPanels() || noSelectedPanels()}>Split Vertically</button>
        <button onClick={e => splitSelectedPanels("horizontal")} disabled={tooManyPanels() || noSelectedPanels()}>Split Horizontally</button>
        <button onClick={e => deleteSelectedPanels()} disabled={noSelectedPanels()}>Delete</button>
        <button onClick={e => undo()} disabled={eon.past.length === 0}>Undo</button>
        <button onClick={e => redo()} disabled={eon.future.length === 0}>Redo</button>
      </div>
    </div>
  )
}

function resizeCursor(dragEdges: Map<string, string>): string {
  for (var e of dragEdges.values()) {
    if ((e.includes("t") && e.includes("l")) || (e.includes("b") && e.includes("r"))) {
      return "nw-resize"
    } else if ((e.includes("t") && e.includes("r")) || (e.includes("b") && e.includes("l"))) {
      return "ne-resize"
    } else if (e.includes("t") || e.includes("b")) {
      return "ns-resize"
    } else if (e.includes("r") || e.includes("l")) {
      return "ew-resize"
    }
  }
  return "auto"
}

// Converts layout relative insets to inverted cartesian relative coordinate bounds
// Insets and Bounds are the most efficient choice of basis for 2D rectangle computations
// Insets are used frequently during rendering of the DOM
// Bounds allow for the the most efficent bounds checks for events
// These coordinates are preferred over normal rect coordinates contianing width and height
function insetsToBounds([t, r, b, l]: vec4) {
  return [t, 1 - r, 1 - b, l]
}

function pointInBounds([x, y]: vec2, [t, r, b, l]: vec4): boolean {
  return t < y && y < b && l < x && x < r
}

// Checks if a circle collides with a rect
function circleIntersectsRect([cx, cy, cr]: vec3, [x, y, w, h]: vec4): boolean {
  const dx = cx - Math.max(x, Math.min(cx, x + w));
  const dy = cy - Math.max(y, Math.min(cy, y + h));
  return (dx * dx + dy * dy) < (cr * cr)
}

// Checks if a circle intersects an axis aliged rectangle and returns a string with the edges that intersect
function circleIntersectsRectEdges([cx, cy, cr]: vec3, [l, t, w, h]: vec4): string {
  let edges = ""
  const dt = Math.abs(cy - t)
  const dr = Math.abs(cx - (l + w))
  const db = Math.abs(cy - (t + h))
  const dl = Math.abs(cx - l)
  if (circleIntersectsRect([cx, cy, cr], [l, t, w, h])) {
    if (dt < cr) { edges = edges.concat("t") }
    if (dr < cr) { edges = edges.concat("r") }
    if (db < cr) { edges = edges.concat("b") }
    if (dl < cr) { edges = edges.concat("l") }
  }
  return edges
}



function style(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
}

function gestureTarget(gesture: FullGestureState<any>) {
  return gesture?.event?.target instanceof HTMLElement ? gesture.event.target : null
}

function percent(n: number): string {
  return (100 * n) + '%'
}

// Maps object values using the provide mapping function
function mapValues<V, U>(obj: { [s: string]: V }, fn: (v: V) => U) {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v)]
    )
  )
}


function splitPanel(panel: Panel, axis: Axis): [Panel, Panel] {
  const id1 = uuidv4()
  const id2 = uuidv4()
  const insets = panel.insets
  const [t, r, b, l] = panel.insets
  const [w, h] = [1 - r - l, 1 - t - b]
  const [insets1, insets2]: [vec4, vec4] =
    axis === "vertical"
      ? [[t, r + w / 2, b, l], [t, r, b, l + w / 2]]
      : [[t, r, b + h / 2, l], [t + h / 2, r, b, l]]
  return [{ id: id1, insets: insets1 }, { id: id2, insets: insets2 }]
}


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

export default App;
