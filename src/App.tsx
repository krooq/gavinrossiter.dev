import React, { KeyboardEventHandler, MouseEventHandler } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { Set } from 'immutable';


type State = { keys: Set<any>, panels: Set<string> }

class App extends React.Component<{}, State> {
  state: State

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      keys: Set.of(),
      panels: Set.of(uuidv4())
    }
    this.keyUp = this.keyUp.bind(this)
    this.keyDown = this.keyDown.bind(this)
    this.splitPanel = this.splitPanel.bind(this)
    this.mergePanels = this.mergePanels.bind(this)
  }

  render() {
    return (
      <div id="app" onKeyDown={this.keyDown} onKeyUp={this.keyUp} >
        {this.state.panels.map((id) => <div key={id} id={id} onClick={(e) => { if (e.target instanceof Element) { this.splitPanel(e.target.id) } }} />)}
      </div>
    );
  }

  keyDown(key: any) {
    console.log("hello")
    this.setState(prevState => {
      return {
        keys: prevState.keys.add(key)
      }
    })
  }
  keyUp(key: any) {
    this.setState((prevState, props) => {
      console.log(key)
      return {
        keys: prevState.keys.add(key)
      }
    })
  }
  splitPanel(id: string) {
    console.log("hello there")
    this.setState(prevState => {
      return {
        panels: prevState.panels.add(uuidv4())
      };
    })
  }
  mergePanels(id1: string, id2: string) {
    // split: id1 = id, id2 = index + 1
    // merge: id = min(id1, id2)
    this.setState((state, props) => {
      state.panels.remove(id1).remove(id2);
      return {
        panels: state.panels
      };
    });
  }
}

export default App;
