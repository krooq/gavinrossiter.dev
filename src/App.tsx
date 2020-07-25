import React, { useState } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { Map } from 'immutable';
import { useDrag } from 'react-use-gesture'
import { FullGestureState, Vector2 } from 'react-use-gesture/dist/types';
import useWindowDimensions from './useWindowDimensions';
import { prettyDOM } from '@testing-library/react';
import { dir } from 'console';

// type State = { keys: Set<any>, panels: Set<string> }

// class App extends React.Component<{}, State> {
//   state: State

//   constructor(props: Readonly<{}>) {
//     super(props);
//     this.state = {
//       keys: Set.of(),
//       panels: Set.of(uuidv4())
//     }
//     this.Panel = this.Panel.bind(this);
//     this.splitPanel = this.splitPanel.bind(this)
//     this.mergePanels = this.mergePanels.bind(this)
//   }



//   Panel(id: string) {
//     const bind = useDrag(this.splitPanel)
//     return (
//       <div {...bind()} key={id} id={id} />
//     )
//   }

//   splitPanel(e: FullGestureState<StateKey<'drag'>>) {
//     console.log("hello there")
//     this.setState(prevState => {
//       return {
//         panels: prevState.panels.add(uuidv4())
//       };
//     })
//   }
//   mergePanels(id1: string, id2: string) {
//     // split: id1 = id, id2 = index + 1
//     // merge: id = min(id1, id2)
//     this.setState((state, props) => {
//       state.panels.remove(id1).remove(id2)
//       return {
//         panels: state.panels
//       }
//     })
//   }
// }
type vec2 = Vector2
type bounds = { t: number, r: number, b: number, l: number }
type Panel = { id: string, bounds: bounds }

function App() {
  const { w, h } = useWindowDimensions();
  const defaultPanel = { id: uuidv4(), bounds: { t: 0, r: 0, b: 0, l: 0 } }

  // console.log({ w, h })
  // console.log(defaultPanel.w)
  const [panels, setPanels] = useState(Map<string, Panel>().set(defaultPanel.id, defaultPanel))
  const bind = useDrag(e => onDragComplete(e, t => {
    var panel = panels.get(t.id)
    if (panel !== undefined) {
      var [p1, p2] = splitPanel(panel, e.initial, e.direction, [w, h])
      var rebuiltPanels = panels.remove(t.id).set(p1.id, p1).set(p2.id, p2)
      setPanels(rebuiltPanels)
    }
  }))
  return (
    <div id="app">
      {panels.map(p => {
        return <div {...bind()} key={p.id} id={p.id} style={style(p)} />
      }).valueSeq()}
    </div >
  )
}

function style(panel: Panel) {
  const { t, b, r, l } = panel.bounds
  return { top: t + '%', right: r + '%', bottom: b + '%', left: l + '%' }
}

// Creates 2 new panels from the given panel using direction to determine the axis of the split
function splitPanel(panel: Panel, initial: Vector2, direction: Vector2, windowSize: Vector2): [Panel, Panel] {
  var id1 = uuidv4()
  var id2 = uuidv4()
  const [w, h] = windowSize
  const { t, r, b, l } = panel.bounds
  const [dx, dy] = axis(direction)
  const [x, y] = [initial[0] / w, initial[1] / h]
  // horizontal slice, dy=0
  if (dy === 0) {
    var p1 = { id: id1, bounds: { t: t, r: r, b: 100 * (1 - y), l: l } }
    var p2 = { id: id2, bounds: { t: 100 * y, r: r, b: b, l: l } }
    return [p1, p2]
  }
  // vertical slice, dx=0
  var p1 = { id: id1, bounds: { t: t, r: 100 * (1 - x), b: b, l: l } }
  var p2 = { id: id2, bounds: { t: t, r: r, b: b, l: 100 * x } }
  return [p1, p2]
}

function axis(direction: vec2) {
  var [dx, dy] = [Math.abs(direction[0]), Math.abs(direction[1])]
  return dx === dy ? [0, 0] : (dx > dy ? [1, 0] : [0, 1])
}

function clampToUnit(initial: Vector2, direction: Vector2): Vector2 {
  var x = initial[0]
  var y = initial[1]
  var dx = direction[0]
  var dy = direction[1]
  if (Math.abs(dx) > Math.abs(dy)) {
    return [0, y]
  }
  return [x, 0]
}

// Performs an action when a drag completes
function onDragComplete(e: FullGestureState<"drag">, action: (t: EventTarget & Element) => any | void) {
  if (e.distance > 10 && e.last && !e.canceled) {
    if (e.cancel !== undefined) {
      e.cancel()
    }
    var target = e.event?.target
    if (target !== undefined && target !== null && target instanceof Element) {
      action(target)
    }
  }
}


export default App;
