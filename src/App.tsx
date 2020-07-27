import React, { useState, CSSProperties } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { Map } from 'immutable';
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

// App
function App() {
  const { w: windowWidth, h: windowHeight } = useWindowDimensions();

  const defaultPanel = { id: uuidv4(), insets: { top: 0, right: 0, bottom: 0, left: 0 }, selected: false }
  const [panels, setPanels] = useState(Map<string, Panel>().set(defaultPanel.id, defaultPanel))
  // const [target, setGesture] = useTargetElement()

  const bind = useGesture({
    onDragStart: gesture => {
      let panel = panels.get(gestureTarget(gesture)?.id ?? '')
      if (panel?.id != null) {
        setPanels(panels.update(panel.id, p => ({ ...p, selected: !p.selected })))
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
        {panels.map(p => {
          return (
            <Spring
              to={{
                backgroundColor: p.selected ? style("--panel-highlight-color") : style("--panel-background-color")
              }}>
              {({ backgroundColor }) => <animated.div {...bind()} key={p.id} id={p.id} className='panel' style={{ backgroundColor, ...mapValues(p.insets, percent) }} />}
            </Spring>
          )
        }).valueSeq()}
      </div>
      <div id="toolbar">
        <button onClick={e => {
          let p = panels.find(p => p.selected)
          if (p != null) {
            let [p1, p2] = splitPanel(p, "vertical")
            setPanels(panels.remove(p.id).set(p1.id, p1).set(p2.id, p2))
          }
        }}>Split Vertically</button>
        <button onClick={e => {
          let p = panels.find(p => p.selected)
          if (p != null) {
            let [p1, p2] = splitPanel(p, "horizontal")
            setPanels(panels.remove(p.id).set(p1.id, p1).set(p2.id, p2))
          }
        }}>Split Horizontally</button>
      </div>
    </div >
  )
}

function style(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
  //     --main - background - color: #0f0f0f;
  // --panel - background - color: #1e1e1e;
  // --panel - highlight - color: #4f4f4f;
}

// Clamps a 1D interval within a 1D bound.
function clampInterval(interval: { left: number, width: number }, bound: { left: number, width: number }) {
  let intervalRadius = Math.ceil(interval.width / 2)
  return Math.max(Math.min(interval.left, bound.left + bound.width - intervalRadius), bound.left + intervalRadius)
}

function computedBounds(element: HTMLElement) {
  return [element.offsetTop, element.offsetLeft, element.offsetWidth, element.offsetHeight]
}

function gestureTarget(gesture: FullGestureState<any>) {
  return gesture?.event?.target instanceof HTMLElement ? gesture.event.target : null
}

function useTargetElement(): [HTMLElement | null, (gesture: FullGestureState<any>) => void] {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  return [target, (gesture: FullGestureState<any> | null) => {
    setTarget(gesture?.event?.target instanceof HTMLElement ? gesture.event.target : null)
  }];
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


export default App;
