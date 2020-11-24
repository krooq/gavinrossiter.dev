import React, { Fragment, useState } from 'react';
import useWindowDimensions from '../common/WindowDimensions';
import { v4 as uuidv4 } from 'uuid';
import { parseXml, XmlNode } from './XmlParser';
import { sole } from '../common/Util';
import { Tree, Node } from './Tree';
import { ReactEventHandlers } from 'react-use-gesture/dist/types';
import { useGesture } from 'react-use-gesture';
import { GestureSharp } from '@material-ui/icons';

// non typescript imports
const { getTreemap } = require('treemap-squarify');
const colormap = require('colormap')
const Color = require('color')

type TreeMapNode = {
  id: string
  xmlNode: XmlNode
  value: number,
  opened: boolean,
  collapsed: boolean,
  highlighted: boolean
  toString: () => string
}
type TreeMapRect = {
  x: number,
  y: number,
  width: number,
  height: number,
  data: TreeMapNode
}

function TreeMapNode(node: Node, xmlNode: XmlNode): TreeMapNode {
  const id = node.id
  const value = node.children.length
  const opened = false
  const collapsed = false
  const highlighted = false
  const toString = () => `<${xmlNode.name}${Object.entries(xmlNode.attributes).map(o => ` ${o[0]}="${o[1]}"`).join()}>`
  return { id, xmlNode, value, opened, collapsed, highlighted, toString }
}

type TreeMapProps = {
  tree: Tree,
  root: Node,
  treeMapNodes: Map<string, TreeMapNode>,
  width: number,
  height: number,
  gestures: (id: string) => ReactEventHandlers
}
type TreeMapSectionProps = TreeMapProps & { dx: number, dy: number }

function TreeMap(props: TreeMapProps) {
  return <Fragment>
    {props.root.children.length > 0 &&
      <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height}>
        <TreeMapSection key={uuidv4()} {...props} dx={0} dy={0} />
        Sorry, your browser does not support inline SVG.
      </svg>
    }
  </Fragment>
}

function TreeMapSection(props: TreeMapSectionProps) {
  // console.log(props.root)
  // console.log(props.tree.children(props.root).map(n => n && props.treeMapNodes.get(n.id)))
  let colors: string[] = colormap({
    colormap: 'temperature',
    nshades: Math.max(props.root.children.length, 10),
    format: 'hex',
    alpha: 0.75
  })
  const children = props.tree.children(props.root)
    .map(n => props.treeMapNodes.get(n.id))
    // only render nodes with a value greater than 0, otherwise getTreemap algorithm will throw an error
    .filter(c => c && c?.value > 0)

  return getTreemap({
    data: children,
    width: props.width,
    height: props.height
  })
    .map(({ x, y, width, height, data }: TreeMapRect, i: number) => {
      // console.log({ x, y, width, height, data })
      const node = props.tree.nodes.get(data.id)
      const treeMapNode = props.treeMapNodes.get(data.id)
      return node && treeMapNode && <Fragment key={data.id}>
        <g fill={data.highlighted ? Color(colors[i]).lighten(0.5).hex() : colors[i]} >
          <rect x={x + props.dx} y={y + props.dy} width={width} height={height}
            stroke="black"
            pointerEvents="visibleFill"
            {...props.gestures(data.id)}
          />
          {/* <text x={x + props.dx + 4} y={y + props.dy + 12} fill="white" fontSize="10px">{nodeToString(treeMapNode)}</text> */}
          {/* <text x={x + props.dx + 4} y={y + props.dy + 12 + 16} fill="white" fontSize="10px">{data.xmlNode.data}</text> */}
          <foreignObject pointerEvents="none" x={x + props.dx + 4} y={y + props.dy} width={width} height={height}>
            <p style={{ fontSize: "10px", color: "white", margin: "0" }}>{treeMapNode.toString()}</p>
          </foreignObject>
          <foreignObject pointerEvents="none" x={x + props.dx + 4} y={y + props.dy + 16} width={width} height={height}>
            <p style={{ fontSize: "10px", color: "white", margin: "0" }}>{data.xmlNode.data}</p>
          </foreignObject>
        </g >
        {
          treeMapNode.opened && <TreeMapSection
            tree={props.tree}
            root={node}
            treeMapNodes={props.treeMapNodes}
            width={width - 10}
            height={height - 30}
            dx={x + props.dx + 5}
            dy={y + props.dy + 20}
            gestures={props.gestures} />
        }
      </Fragment >
    }
    )
}

function App() {
  const [windowWidth, windowHeight] = useWindowDimensions();
  const [upload, setUpload] = useState<File>()
  const [treeMapNodes, setTreeMapNodes] = useState<Map<string, TreeMapNode>>()
  const [tree, setTree] = useState<Tree>()
  const gestures: (id: string) => ReactEventHandlers = useGesture({
    onDragStart: state => {
      if (tree && treeMapNodes) {
        console.log(state.args)
        const [id]: [string] = state.args
        openNodes(tree, treeMapNodes, id, setTreeMapNodes);
      }
    }
  })

  const onDoubleClick = (id: string) => {
  }
  const onClick = (id: string) => {
    if (tree && treeMapNodes) {
      openNodes(tree, treeMapNodes, id, setTreeMapNodes);
    }
  }
  const onMouseEnter = (id: string) => {
    // if (tree && treeMapNodes) {
    //   for (let [k, _] of tree.nodes) {
    //     if (k === id) {
    //       sole(treeMapNodes.get(id)).filter(n => n.value > 0).forEach(n => {
    //         console.log(n)
    //         n.highlighted = true
    //       })
    //     } else {
    //       sole(treeMapNodes.get(k)).forEach(n => n.highlighted = false)
    //     }
    //   }
    //   setTreeMapNodes(new Map(treeMapNodes))
    // }
  }
  const onMouseLeave = (id: string) => {
    // if (tree && treeMapNodes) {
    //   for (let [k, _] of tree.nodes) {
    //     if (k === id) {
    //       // sole(treeMapNodes.get(id)).forEach(n => n.highlighted = false)
    //     }
    //   }
    //   setTreeMapNodes(new Map(treeMapNodes))
    // }
  }

  return <div>
    <div style={{ height: "50px" }}>
      <div style={{ padding: "8px" }}>
        <input type="file" onChange={(e) => setUpload(e?.target?.files?.[0])} />
        <button onClick={(e) => {
          upload && parseXml(upload).then(([xmlTree, xmlNodes]) => {
            setTree(xmlTree)
            // console.log(xmlNodes)
            const treeMapNodesDraft = new Map<string, TreeMapNode>()
            for (const [id, node] of xmlTree.nodes) {
              const xmlNode = xmlNodes.get(id)
              xmlNode && treeMapNodesDraft.set(id, TreeMapNode(node, xmlNode))
            }
            setTreeMapNodes(treeMapNodesDraft)
          })
        }
        }>Parse</button>
      </div>
    </div>
    {
      tree && treeMapNodes &&
      <TreeMap
        tree={tree}
        root={tree.sentinel}
        treeMapNodes={treeMapNodes}
        width={windowWidth}
        height={windowHeight - 54}
        gestures={gestures}
      />

    }
  </div>
}


export default App


function openNodes(tree: Tree, treeMapNodes: Map<string, TreeMapNode>, id: string, setTreeMapNodes: React.Dispatch<React.SetStateAction<Map<string, TreeMapNode> | undefined>>) {
  if (tree.children(id).length > 0) {
    console.log(id);
    for (let [k] of tree.nodes) {
      // toggle open the node that was clicked
      if (k === id) {
        sole(treeMapNodes.get(k)).forEach(n => {
          n.opened = !n.opened || !n.collapsed
          n.collapsed = false
          n.value = tree.node(k).children.length
        });
        // toggle closed the children of the node that was clicked, not essential
        for (const child of tree.children(k)) {
          tree.recurse(child, n => sole(treeMapNodes.get(n.id)).forEach(n => {
            n.opened = false
            n.collapsed = false
            n.value = tree.node(k).children.length
          }));
        }
        for (const sibling of tree.siblings(k)) {
          sole(treeMapNodes.get(sibling.id)).forEach(s => {
            s.collapsed = true
            s.value = 0
          });
        }
      }
    }
    setTreeMapNodes(new Map(treeMapNodes));
  }
}

