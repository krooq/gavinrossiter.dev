import React, { useState, useRef } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { useGesture } from 'react-use-gesture'
import { animated, Spring } from 'react-spring';
import { FullGestureState } from 'react-use-gesture/dist/types';
import useWindowDimensions from './useWindowDimensions';
import { enableAllPlugins, produce } from 'immer'
import _ from 'lodash'
enableAllPlugins()

// Vectors
type vec2 = [number, number]
// type vec3 = [number, number, number]
type vec4 = [number, number, number, number]

// Axis
type Axis = "vertical" | "horizontal"
// Panel
type Panel = {
  id: string,
  insets: vec4
}
// State - Snapshot view of the domain data state
type State = {
  panels: Map<string, Panel>
}
// Metadata - State that is not recorded in an Eon
type Metadata = {
  selectedPanels: Set<string>,
  selectedEdges: Map<string, string>,
  resizingPanel: string,
}


//TODO: Replace with immer patches
function useUndoRedo<T>(initialState: T, maxHistory = 50): [T[], T, T[], () => void, (update: (present: T) => void) => void, () => void] {
  type Eon = { past: T[], present: T, future: T[] }
  const [eon, setEon] = useState<Eon>({ past: [], present: initialState, future: [] })

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

  function set(update: (present: T) => void) {
    setEon(produce(eon, draft => {
      const { past, present } = draft
      past.push(present)
      draft.past = _.takeRight(past, maxHistory)
      draft.present = produce(present, update)
      draft.future = []
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
  return [eon.past, eon.present, eon.future, undo, set, redo]
}

// App
function App() {
  const [windowWidth, windowHeight] = useWindowDimensions();
  const initialPanel: Panel = { id: uuidv4(), insets: [0, 0, 0, 0] }
  const initialSnapshot = {
    panels: new Map<string, Panel>().set(initialPanel.id, initialPanel)
  }

  // const savedState = loadState();
  const maxPanels = 512
  const panelEdgeSize = 40
  const [minPanelWidth, minPanelHeight] = [60, 60]
  const [metadata, setMetadata] = useState<Metadata>({ selectedPanels: new Set(), selectedEdges: new Map(), resizingPanel: "" })
  const [past, present, future, undo, set, redo] = useUndoRedo<State>(initialSnapshot)
  const { selectedPanels, selectedEdges, resizingPanel } = Object.freeze(metadata)
  const { panels } = Object.freeze(present)
  const mainRef = useRef<HTMLDivElement>(null);

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

  function interact(action: (data: Metadata) => void) {
    setMetadata(produce(metadata, action))
  }

  function deleteSelectedPanels() {
    set(state => interact(metadata => {
      for (const panel of metadata.selectedPanels) {
        state.panels.delete(panel)
      }
    }))
  }

  function clearSelectedPanels() {
    interact(metadata => { metadata.selectedPanels = new Set() })
  }

  function splitSelectedPanels(axis: Axis) {
    set(state => interact(metadata => {
      const selectedPanels = [...state.panels.values()].filter(p => metadata.selectedPanels.has(p.id))
      const splitPanels = selectedPanels.flatMap(p => splitPanel(p, axis))
      for (const panel of metadata.selectedPanels) { state.panels.delete(panel) }
      for (const panel of splitPanels) { state.panels.set(panel.id, panel) }
      metadata.selectedPanels.clear()
    }))
  }

  function nbSelectedPanels() { return selectedPanels.size }
  function noSelectedPanels() { return nbSelectedPanels() === 0 }
  function tooManyPanels() { return (panels.size + nbSelectedPanels() * 2) > maxPanels }

  const bind = useGesture({
    onMove: g => {
      let resizingEdges = selectedEdges.get(resizingPanel) ?? ""
      interact(mut => {
        mut.selectedEdges.clear()
        let [width, height] = [mainRef?.current?.clientWidth ?? 1, mainRef?.current?.clientHeight ?? 1]
        var [x, y] = g.xy
        for (const panel of panels.values()) {
          var [t, r, b, l] = insetsToBounds(panel.insets)
          var [t, r, b, l] = [t * height, r * width, b * height, l * width]
          let edges = ""
          if (pointInBounds([x, y], [t, r, t + panelEdgeSize, l])) { edges = edges.concat("t") }
          if (pointInBounds([x, y], [t, r, b, r - panelEdgeSize])) { edges = edges.concat("r") }
          if (pointInBounds([x, y], [b - panelEdgeSize, r, b, l])) { edges = edges.concat("b") }
          if (pointInBounds([x, y], [t, l + panelEdgeSize, b, l])) { edges = edges.concat("l") }
          if (edges.length > 0) {
            mut.selectedEdges.set(panel.id, edges)
          } else {
            mut.selectedEdges.delete(panel.id)
          }
        }
        mut.selectedEdges.set(mut.resizingPanel, resizingEdges)
        document.body.style.cursor = resizeCursor(mut.selectedEdges.values());
      })

    },
    onDragStart: g => {
      interact(mut => {
        const panel = panels.get(gestureTarget(g)?.id ?? '')
        mut.resizingPanel = gestureTarget(g)?.id
        if (panel != null) {
          if (mut.selectedPanels.has(panel.id) && !mut.selectedEdges.has(panel.id)) {
            mut.selectedPanels = new Set([])
          } else {
            mut.selectedPanels = new Set([panel.id])
          }
        }
      })
    },
    onDrag: g => {
      let [width, height] = [mainRef?.current?.clientWidth ?? 1, mainRef?.current?.clientHeight ?? 1]
      var [x, y] = g.xy
      var memo = g.memo
      set(mut => {
        const panel = mut.panels.get(resizingPanel ?? '')
        if (panel != null) {
          const edges = selectedEdges.get(panel.id)
          const [t0, r0, b0, l0] = panel.insets
          let [t, r, b, l] = panel.insets
          const [x0, y0] = g.initial
          if (memo == null) {
            memo = [t0 - y0 / height, r0 - (1 - x0 / width), b0 - (1 - y0 / height), l0 - x0 / width]
          }
          let [dt0, dr0, db0, dl0] = memo
          if (edges?.includes("t")) { t = dt0 + y / height }
          if (edges?.includes("r")) { r = dr0 + 1 - x / width }
          if (edges?.includes("b")) { b = db0 + 1 - y / height }
          if (edges?.includes("l")) { l = dl0 + x / width }
          // Prevent the resize escaping the main bounds or the panel bounds
          // We must use the original insets to calculate the bounds to prevent the resize becomming a move
          const tBounds: vec2 = [0, 1 - (clamp(b0) + (minPanelHeight / height))]
          const rBounds: vec2 = [0, 1 - (clamp(l0) + (minPanelWidth / width))]
          const bBounds: vec2 = [0, 1 - (clamp(t0) + (minPanelHeight / height))]
          const lBounds: vec2 = [0, 1 - (clamp(r0) + (minPanelWidth / width))]
          panel.insets = [clamp(t, tBounds), clamp(r, rBounds), clamp(b, bBounds), clamp(l, lBounds)]
        }
      })
      return memo
    },
    onDragEnd: g => {
      interact(mut => { mut.selectedEdges.delete(resizingPanel); mut.resizingPanel = ""; })
    }
  }, {
    // initial: 
  })
  // linear-gradient(to bottom, ${selectedEdges.get(p.id)?.includes("t") ? edgeHighlight : "#00000000"}, 20px, #00000000 30px),
  // linear-gradient(to left, ${selectedEdges.get(p.id)?.includes("r") ? edgeHighlight : "#00000000"}, 20px, #00000000 30px),
  // linear-gradient(to top, ${selectedEdges.get(p.id)?.includes("b") ? edgeHighlight : "#00000000"}, 20px, #00000000 30px),
  // linear-gradient(to right, ${selectedEdges.get(p.id)?.includes("l") ? edgeHighlight : "#00000000"}, 20px, #00000000 30px),
  // linear-gradient(${selectedPanels.has(p.id) ? "" : "#00000000,#00000000"})

  return (
    <div id="app" style={{ width: windowWidth, height: windowHeight }} >
      <div id="main" {...bind()} ref={mainRef}>
        {[...panels.values()].map(p => {
          var [top, right, bottom, left] = p.insets.map(percent)
          const highlight = `${style("--panel-highlight-color")},${style("--panel-highlight-color")}`
          const edgeHighlight = `#e5e5fd10`
          return (
            <Spring key={p.id}
              to={{
                backgroundImage: `
                linear-gradient(${selectedPanels.has(p.id) ? "#ffffff10,#ffffff10" : "#00000000,#00000000"}),
                linear-gradient(to bottom, ${selectedEdges.get(p.id)?.includes("t") ? "#ffffff20" : "#00000000"}, 20px, #00000000 30px),
                linear-gradient(to left, ${selectedEdges.get(p.id)?.includes("r") ? "#ffffff20" : "#00000000"}, 20px, #00000000 30px),
                linear-gradient(to top, ${selectedEdges.get(p.id)?.includes("b") ? "#ffffff20" : "#00000000"}, 20px, #00000000 30px),
                linear-gradient(to right, ${selectedEdges.get(p.id)?.includes("l") ? "#ffffff20" : "#00000000"}, 20px, #00000000 30px)
                  `,
              }}>
              {({ backgroundImage, }) =>
                <animated.div
                  key={p.id}
                  id={p.id}
                  className='panel'
                  style={{
                    backgroundImage,
                    top, right, bottom, left,
                  }}
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
        <button onClick={e => undo()} disabled={past.length === 0}>Undo</button>
        <button onClick={e => redo()} disabled={future.length === 0}>Redo</button>
      </div>
    </div>
  )
}

function clamp(actual: number, [lower, upper] = [0, 1]): number {
  return Math.max(lower, Math.min(upper, actual))
}

function resizeCursor(edges: IterableIterator<string>): string {
  for (var e of edges) {
    if (e.includes("t") && e.includes("l") && e.includes("b") && e.includes("r")) {
      return "move"
    } else if ((e.includes("t") && e.includes("l")) || (e.includes("b") && e.includes("r"))) {
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

function style(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
}

function gestureTarget(gesture: FullGestureState<any>) {
  return gesture?.event?.target instanceof HTMLElement ? gesture.event.target : null
}

function percent(n: number): string {
  return (100 * n) + '%'
}

function splitPanel(panel: Panel, axis: Axis): [Panel, Panel] {
  const id1 = uuidv4()
  const id2 = uuidv4()
  const [t, r, b, l] = panel.insets
  const [w, h] = [1 - r - l, 1 - t - b]
  const [insets1, insets2]: [vec4, vec4] =
    axis === "vertical"
      ? [[t, r + w / 2, b, l], [t, r, b, l + w / 2]]
      : [[t, r, b + h / 2, l], [t + h / 2, r, b, l]]
  return [{ id: id1, insets: insets1 }, { id: id2, insets: insets2 }]
}

export default App;
