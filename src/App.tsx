import React, { useState, useEffect } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { Map } from 'immutable';
import { useGesture, useDrag } from 'react-use-gesture'
import { useSpring, animated } from 'react-spring';
import { FullGestureState, Vector2 } from 'react-use-gesture/dist/types';
import useWindowDimensions from './useWindowDimensions';
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

type bounds = { t: number, r: number, b: number, l: number }
type Panel = { id: string, bounds: bounds }

function App() {
  const { w, h } = useWindowDimensions();
  const defaultPanel = { id: uuidv4(), bounds: { t: 0, r: 0, b: 0, l: 0 } }

  // console.log({ w, h })
  // console.log(defaultPanel.w)
  const [panels, setPanels] = useState(Map<string, Panel>().set(defaultPanel.id, defaultPanel))
  const [target, setEvent] = useTargetElement()
  const [transform, setSplitIndicator] = useState(() => 'translate3d(0px,0,0) scale(1) rotateX(0deg)')
  const bind = useGesture({
    onDragStart: setEvent,
    onDrag: e => {
      var [dx, dy] = e.direction.map(Math.abs)
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        var height = Math.max(2, (target?.clientHeight ?? 0))
        var width = Math.max(2, (target?.clientWidth ?? 0))
        setSplitIndicator(
          createTransform(
            (dx * e.xy[0]) + 10,
            (dy * e.xy[1]) + height / 2,
            20,
            height,
          )
        )
      }
    },
    onDragEnd: e => {
      // if (target !== null) {
      //   var panel = panels.get(target.id)
      //   if (panel !== undefined) {
      //     var [p1, p2] = splitPanel(panel, e.initial, e.direction, [w, h])
      //     if (p1 !== undefined && p2 !== undefined) {
      //       var rebuiltPanels = panels.remove(target.id).set(p1.id, p1).set(p2.id, p2)
      //       setPanels(rebuiltPanels)
      //     }
      //   }
      // }
      setEvent(null)
    },
  },
    {
      drag: { filterTaps: true, lockDirection: true }
    })

  return (
    <div id="app">
      <animated.div id="split-indicator" {...bind()} style={{ transform }} />
      {panels.map(p => {
        return (
          <div {...bind()} key={p.id} id={p.id} className='panel' style={style(p)} />
        )
      }).valueSeq()}
    </div >
  )
}

function createTransform(x: number, y: number, sx: number, sy: number) {
  return `translate3d(${x}px,${y}px,0) scale(${sx},${sy}) rotateX(0deg)`
}

function useTargetElement(): [Element | null, (e: FullGestureState<any>) => void] {
  const [target, setTarget] = useState<Element | null>(null)

  // might be able to attach listener for when events are installed

  return [target, (e: FullGestureState<any> | null) => {
    setTarget(e?.event?.target instanceof Element ? e.event.target : null)
  }];
}

function style(panel: Panel) {
  const { t, b, r, l } = panel.bounds
  return { top: 100 * t + '%', right: 100 * r + '%', bottom: 100 * b + '%', left: 100 * l + '%' }
}

// Creates 2 new panels from the given panel using direction to determine the axis of the split
function splitPanel(panel: Panel, initial: Vector2, direction: Vector2, windowSize: Vector2): [Panel?, Panel?] {
  var id1 = uuidv4()
  var id2 = uuidv4()
  const [w, h] = windowSize
  const { t, r, b, l } = panel.bounds
  console.log(direction)
  const [dx, dy] = direction
  const [x, y] = [initial[0] / w, initial[1] / h]
  // horizontal slice, dy=0
  if (dx === 1 && dy === 0) {
    var p1 = { id: id1, bounds: { t: t, r: r, b: (1 - y), l: l } }
    var p2 = { id: id2, bounds: { t: y, r: r, b: b, l: l } }
    return [p1, p2]
  } else if (dx === 0 && dy === 1) {
    // vertical slice, dx=0
    var p1 = { id: id1, bounds: { t: t, r: (1 - x), b: b, l: l } }
    var p2 = { id: id2, bounds: { t: t, r: r, b: b, l: x } }
    return [p1, p2]
  }
  return [undefined, undefined]
}


// Performs an action when a drag completes
function onDragComplete(e: FullGestureState<"drag">, action: (t: EventTarget & Element) => any | void) {
  if (e.distance > 15 && e.last && !e.canceled) {
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
