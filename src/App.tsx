import React, { useState, useLayoutEffect, useRef } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { useGesture } from 'react-use-gesture'
import { animated, Spring } from 'react-spring';
import { FullGestureState } from 'react-use-gesture/dist/types';
import useWindowDimensions from './useWindowDimensions';
import { enableAllPlugins, produce } from 'immer'
import _ from 'lodash'
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
type Panel = { id: string, insets: vec4, selected: boolean }

// State
type Snapshot = { panels: Map<string, Panel> }

type State = { past: Array<Snapshot>, present: Snapshot, future: Array<Snapshot> }

// function coalesce<T, U>(t: T | null | undefined, fn: (t: T) => U) { return t != null ? fn(t) : null }


// App
function App() {
  const [windowWidth, windowHeight] = useWindowDimensions();


  const initialPanel: Panel = { id: uuidv4(), insets: [0, 0, 0, 0], selected: false }
  const initialState = {
    panels: new Map<string, Panel>().set(initialPanel.id, initialPanel)
  }

  // const savedState = loadState();
  const maxHistory = 50
  const maxPanels = 512
  const [state, setState] = useState<State>({ past: [], present: initialState, future: [] })
  // saveState(history, initialState, future)

  function undo() {
    setState(produce(state, draft => {
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
    setState(produce(state, draft => {
      const { present, future } = draft
      let next = future.pop()
      if (next != null) {
        draft.past.push(present)
        draft.present = next
        draft.future = future
      }
    }))
  }

  function pushState(update: (present: Snapshot) => void) {
    setState(produce(state, draft => {
      const { past, present } = draft
      past.push(present)
      draft.past = _.takeRight(past, maxHistory)
      draft.present = produce(present, update)
      draft.future = []
    }))
  }

  function updateState(update: (present: Snapshot) => void) {
    setState(produce(state, draft => {
      update(draft.present)
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

  function nbSelectedPanels() { return [...state.present.panels.values()].filter(p => p.selected).length }
  function noSelectedPanels() { return nbSelectedPanels() === 0 }
  function tooManyPanels() { return (state.present.panels.size + nbSelectedPanels() * 2) > maxPanels }


  const [gesture, setGesture] = useState<FullGestureState<any> | null>(null)
  const [dragEdges, setDragEdges] = useState<Map<string, string>>(new Map())

  const bind = useGesture({
    onMove: g => {
      setGesture(g)
      let [width, height] = [mainRef?.current?.clientWidth ?? 1, mainRef?.current?.clientHeight ?? 1]
      var [x, y] = g.xy

      let theseDragEdges: Map<string, string> = new Map()
      for (const panel of state.present.panels.values()) {
        const [t, r, b, l] = panel.insets
        const [w, h] = [(1 - r - l) * width, (1 - t - b) * height]
        const [px, py] = [l * width, t * height]
        const radius = 20
        let edges = circleIntersectsRect([x, y, radius], [px, py, w, h])
        theseDragEdges.set(panel.id, edges);
        // if (intersect.includes("t")) {
        //   if (mainRef.current != null) {
        //     mainRef.current.style.cursor = "move"
        //   }
        //   console.log("t")
        // }
      }
      setDragEdges(theseDragEdges)

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
      pushState(state => {
        const panel = state.panels.get(gestureTarget(g)?.id ?? '')
        if (panel != null) {
          panel.selected = !panel.selected
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
        {[...state.present.panels.values()].map(p => {
          var [top, right, bottom, left] = p.insets.map(percent)
          return (
            <Spring key={p.id}
              to={{
                background: p.selected ? style("--panel-highlight-color") : style("--panel-background-color"),
                // borderTop: p.selected ? "" : ""
                top,
                right,
                bottom,
                left,
              }}>
              {({ background, top, right, bottom, left }) =>
                <animated.div
                  {...bind()}
                  key={p.id}
                  id={p.id}
                  className='panel'
                  style={{
                    background,
                    top, right, bottom, left
                    // ,
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
        <button onClick={e => pushState(state => clearSelectedPanels(state.panels))} disabled={noSelectedPanels()}>Clear Selection</button>
        <button onClick={e => pushState(state => splitSelectedPanels(state.panels, "vertical"))} disabled={tooManyPanels() || noSelectedPanels()}>Split Vertically</button>
        <button onClick={e => pushState(state => splitSelectedPanels(state.panels, "horizontal"))} disabled={tooManyPanels() || noSelectedPanels()}>Split Horizontally</button>
        <button onClick={e => pushState(state => deleteSelectedPanels(state.panels))} disabled={noSelectedPanels()}>Delete</button>
        <button onClick={e => undo()} disabled={state.past.length === 0}>Undo</button>
        <button onClick={e => redo()} disabled={state.future.length === 0}>Redo</button>
      </div>
    </div>
  )
}

// Checks if a circle collides with a rect
function collisionCheck([cx, cy, cr]: vec3, [x, y, w, h]: vec4) {
  const dx = cx - Math.max(x, Math.min(cx, x + w));
  const dy = cy - Math.max(y, Math.min(cy, y + h));
  return (dx * dx + dy * dy) < (cr * cr)
}

// Checks if a circle intersects an axis aliged rectangle and returns a string with the edges that intersect
function circleIntersectsRect([cx, cy, cr]: vec3, [x, y, w, h]: vec4): string {
  let edges = ""
  const dt = Math.abs(cy - y)
  const dr = Math.abs(cx - (x + w))
  const db = Math.abs(cy - (y + h))
  const dl = Math.abs(cx - x)
  if (collisionCheck([cx, cy, cr], [x, y, w, h])) {
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

function deleteSelectedPanels(panels: Map<string, Panel>) {
  const selectedPanels = [...panels.values()].filter(p => p.selected)
  for (const panel of selectedPanels) { panels.delete(panel.id) }
}

function clearSelectedPanels(panels: Map<string, Panel>) {
  for (const [, panel] of panels) { panel.selected = false }
}

function splitSelectedPanels(panels: Map<string, Panel>, axis: Axis) {
  const selectedPanels = [...panels.values()].filter(p => p.selected)
  const splitPanels = selectedPanels.flatMap(p => splitPanel(p, axis))
  for (const panel of selectedPanels) { panels.delete(panel.id) }
  for (const panel of splitPanels) { panels.set(panel.id, panel) }
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
  return [{ id: id1, insets: insets1, selected: true }, { id: id2, insets: insets2, selected: true }]
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
