import React, { useState, CSSProperties } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { Stack, Map, OrderedMap } from 'immutable';
import { useGesture, useDrag } from 'react-use-gesture'
import { useSpring, animated, to, config, Spring } from 'react-spring';
import { FullGestureState, Vector2 } from 'react-use-gesture/dist/types';
import useWindowDimensions from './useWindowDimensions';
import { createGlobalStyle } from 'styled-components';

type vec2 = [number, number]

// Rect
type Rect = { x: number, y: number, width: number, height: number }

// Insets
type Insets = { top: number, right: number, bottom: number, left: number }

// Transform
type Transform = { translate: vec2, scale: vec2 }

type Axis = "vertical" | "horizontal"

// Panel
type Panel = { id: string, insets: Insets, selected: boolean }

const GlobalStyle = createGlobalStyle`
  html {
    --main-background-color: #0f0f0f;
    --panel-background-color: #1e1e1e;
    --panel-highlight-color: #4e4e4e
  }
`
const styles = {
  main_background_color: "#0f0f0f",
  panel_background_color: "#1e1e1e",
  panel_highlight_color: "#4f4f4f",
  toolbar_background_color: "#0f0f0f",
  toolbar_button_background_color: "#1e1e1e",
  toolbar_button_active_background_color: "#4f4f4f",
}
type State = { panels: Map<string, Panel> }

// App
function App() {
  const { w: windowWidth, h: windowHeight } = useWindowDimensions();

  const initialPanel = { id: uuidv4(), insets: { top: 0, right: 0, bottom: 0, left: 0 }, selected: false }
  const initialState = {
    panels: Map<string, Panel>().set(initialPanel.id, initialPanel)
  }

  const [future, setFuture] = useState(Stack<State>())
  const [state, setState] = useState(initialState)
  const [history, setHistory] = useState(Stack<State>())

  function undo() {
    if (history.isEmpty()) { return }
    setFuture(future.push(state))
    setState(history.first())
    setHistory(history.pop())
  }
  function redo() {
    if (future.isEmpty()) { return }
    setHistory(history.push(state))
    setState(future.first())
    setFuture(future.pop())
  }

  function pushState(panels: Map<string, Panel>) {
    setHistory(history.push(state))
    setState({ panels })
    setFuture(future.clear())
  }


  // const [target, setGesture] = useTargetElement()
  const bind = useGesture({
    onDragStart: gesture => {
      let panel = state.panels.get(gestureTarget(gesture)?.id ?? '')
      if (panel?.id != null) {
        pushState(state.panels.update(panel.id, p => ({ ...p, selected: !p.selected })))
      }
      // setGesture(null)
    },
    // onDragStart: setGesture,
    // onMoveStart: setGesture,
    // onDrag: e => {
    //   var [dx, dy] = e.direction.map(Math.abs)
    //   if (dx === 1 && dy === 0) {
    //     var x = e.xy[0]
    //     var y = e.xy[1]
    //     var height = 500//Math.max(2, (target?.clientHeight ?? 0))
    //     var width = 5
    //     setSplitIndicator({ translate: [x, y], scale: [width, height] })
    //   }
    // if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
    //   var height = Math.max(2, (target?.clientHeight ?? 0))
    //   var width = Math.max(2, (target?.clientWidth ?? 0))
    // setSplitIndicator(
    //   createTransform(
    //     (dx * e.xy[0]) + 10,
    //     (dy * e.xy[1]) + height / 2,
    //     20,
    //     height,
    //   )
    // )
    // }
  },
    // onDragEnd: e => {
    //   // if (target !== null) {
    //   //   var panel = panels.get(target.id)
    //   //   if (panel !== undefined) {
    //   //     var [p1, p2] = splitPanel(panel, e.initial, e.direction, [w, h])
    //   //     if (p1 !== undefined && p2 !== undefined) {
    //   //       var rebuiltPanels = panels.remove(target.id).set(p1.id, p1).set(p2.id, p2)
    //   //       setPanels(rebuiltPanels)
    //   //     }
    //   //   }
    //   // }
    //   setEvent(null)
    // },
    // },
    {
      // drag: { filterTaps: true }
    })

  return (
    <div id="app" style={{ width: windowWidth, height: windowHeight }} >
      <div id="main">
        {state.panels.map(p => {
          return (
            <Spring key={p.id}
              to={{
                background: p.selected ? style("--panel-highlight-color") : style("--panel-background-color")
              }}>
              {({ background }) =>
                <animated.div
                  {...bind()}
                  key={p.id}
                  id={p.id}
                  className='panel'
                  style={{ background, ...mapValues(p.insets, percent) }}
                />}
            </Spring>
          )
        }).valueSeq()}
      </div>
      <div id="toolbar">
        <button onClick={e => pushState(clearSelectedPanels(state.panels))}>Clear Selection</button>
        <button onClick={e => pushState(splitSelectedPanels(state.panels, "vertical"))}>Split Vertically</button>
        <button onClick={e => pushState(splitSelectedPanels(state.panels, "horizontal"))}>Split Horizontally</button>
        <button onClick={e => undo()}>Undo</button>
        <button onClick={e => redo()}>Redo</button>
      </div>
    </div >
  )
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

function clearSelectedPanels(panels: Map<string, Panel>): Map<string, Panel> {
  return panels.map(p => ({ ...p, selected: false }))
}

function splitSelectedPanels(panels: Map<string, Panel>, axis: Axis): Map<string, Panel> {
  let selectedPanels = panels.valueSeq().filter(p => p.selected)
  let splitPanels = selectedPanels
    .flatMap(p => splitPanel(p, axis))
    .groupBy(p => p.id)
    .map(ps => ps.first<Panel>() /* We know there will be at least one panel since we just did a groupBy */)
    .toMap()
  return panels
    .removeAll(selectedPanels.map(p => p.id))
    .concat(splitPanels)
}

function splitPanel(panel: Panel, axis: Axis): [Panel, Panel] {
  var id1 = uuidv4()
  var id2 = uuidv4()
  let insets = panel.insets;
  const { top: t, right: r, bottom: b, left: l } = insets;
  let w = 1 - r - l
  let h = 1 - t - b
  let [insets1, insets2] =
    axis === "vertical"
      ? [{ ...insets, right: r + w / 2 }, { ...insets, left: l + w / 2 }]
      : [{ ...insets, bottom: b + h / 2 }, { ...insets, top: t + h / 2 }]
  return [{ id: id1, selected: true, insets: insets1 }, { id: id2, selected: true, insets: insets2 }]
}

export default App;
