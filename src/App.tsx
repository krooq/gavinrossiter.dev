import React, { useState, CSSProperties } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { Map } from 'immutable';
import { useGesture, useDrag } from 'react-use-gesture'
import { useSpring, animated, to, config } from 'react-spring';
import { FullGestureState, Vector2 } from 'react-use-gesture/dist/types';
import useWindowDimensions from './useWindowDimensions';

type vec2 = [number, number]

// Rect
type Rect = { x: number, y: number, width: number, height: number }

// Insets
type Insets = { top: number, right: number, bottom: number, left: number }

// Transform
type Transform = { translate: vec2, scale: vec2 }


// Panel
type Panel = { id: string, insets: Insets }

// App
function App() {
  const { w: windowWidth, h: windowHeight } = useWindowDimensions();
  const defaultPanel = { id: uuidv4(), insets: { top: 0, right: 0, bottom: 0, left: 0 } }
  const [panels, setPanels] = useState(Map<string, Panel>().set(defaultPanel.id, defaultPanel))
  const [target, setEvent] = useTargetElement()
  const [{ splitTranslate }, setSplitTranslate] = useSpring(() => ({ splitTranslate: [0, 0] }))
  const [{ splitScale }, setSplitScale] = useSpring(() => ({ splitScale: [1, 1] }))

  const splitGuide = useDrag(e => {
    let panel = target
    if (panel != null) {
      const [x0, y0, w, h] = computedBounds(panel)
      let [ex, ey] = e.xy
      var sx = 2
      var sy = h
      var tx = clampInterval({ left: ex, width: sx }, { left: x0, width: w })
      var ty = x0 + h / 2
      setSplitTranslate({ splitTranslate: [tx, ty], immediate: true })
      setSplitScale({ splitScale: [sx, sy] })
    }
  })

  const bind = useGesture({
    onDragStart: setEvent,
    // onMoveStart: setEvent,
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
    <div id="app" {...splitGuide()} style={{ width: windowWidth, height: windowHeight }} >
      <animated.div id="split-indicator" style={{
        transform: to(
          [splitTranslate, splitScale],
          ([x, y], [sx, sy]) => `translate3d(${x}px,${y}px,0) scale(${sx},${sy})`,
        )
      }} />
      {panels.map(p => {
        return (
          <div {...bind()} key={p.id} id={p.id} className='panel' style={mapValues(p.insets, percent)} />
        )
      }).valueSeq()}
    </div >
  )
}

// Clamps a 1D interval within a 1D bound.
function clampInterval(interval: { left: number, width: number }, bound: { left: number, width: number }) {
  let intervalRadius = Math.ceil(interval.width / 2)
  return Math.max(Math.min(interval.left, bound.left + bound.width - intervalRadius), bound.left + intervalRadius)
}

function computedBounds(element: HTMLElement) {
  return [element.offsetTop, element.offsetLeft, element.offsetWidth, element.offsetHeight]
}


function useTargetElement(): [HTMLElement | null, (e: FullGestureState<any>) => void] {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  return [target, (e: FullGestureState<any> | null) => {
    setTarget(e?.event?.target instanceof HTMLElement ? e.event.target : null)
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

// Creates 2 new panels from the given panel using direction to determine the axis of the split
function splitPanel(panel: Panel, initial: Vector2, direction: Vector2, windowSize: Vector2): [Panel?, Panel?] {
  var id1 = uuidv4()
  var id2 = uuidv4()
  const [w, h] = windowSize
  console.log(direction)
  const [dx, dy] = direction
  const [x, y] = [initial[0] / w, initial[1] / h]
  // horizontal slice, dy=0
  if (dx === 1 && dy === 0) {
    var p1 = { id: id1, insets: { ...panel.insets, bottom: (1 - y) } }
    var p2 = { id: id2, insets: { ...panel.insets, top: y } }
    return [p1, p2]
  } else if (dx === 0 && dy === 1) {
    // vertical slice, dx=0
    var p1 = { id: id1, insets: { ...panel.insets, right: (1 - x) } }
    var p2 = { id: id2, insets: { ...panel.insets, left: x } }
    return [p1, p2]
  }
  return [undefined, undefined]
}

export default App;
