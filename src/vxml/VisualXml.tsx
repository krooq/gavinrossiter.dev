import React, { Fragment, useEffect, useState } from 'react';
import useWindowDimensions from '../common/WindowDimensions';
import { v4 as uuidv4 } from 'uuid';
import { parseXml, XmlNode } from './XmlParser';
import { sole } from '../common/Util';
import { Tree, Node } from './Tree';
import { ReactEventHandlers } from 'react-use-gesture/dist/types';
import { useGesture } from 'react-use-gesture';

// non typescript imports
const { getTreemap } = require('treemap-squarify');
const colormap = require('colormap')
const Color = require('color')

type TreeMapNode = {
  id: string
  xmlNode: XmlNode
  value: number,
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
  const toString = () => `<${xmlNode.name}${Object.entries(xmlNode.attributes).map(o => ` ${o[0]}="${o[1]}"`).join()}>`
  return { id, xmlNode, value, toString }
}

type TreeMapProps = {
  tree: Tree,
  root: Node,
  treeMapNodes: Map<string, TreeMapNode>,
  openedNodes: string[],
  collapsedNodes: string[],
  focusedNodes: string[],
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

  return children.length > 0 && getTreemap({
    data: children,
    width: props.width,
    height: props.height
  })
    .map(({ x, y, width, height, data }: TreeMapRect, i: number) => {
      // console.log({ x, y, width, height, data })
      const node = props.tree.nodes.get(data.id)
      const treeMapNode = props.treeMapNodes.get(data.id)
      return node && treeMapNode && <Fragment key={data.id}>
        <g fill={props.focusedNodes.includes(data.id) ? Color(colors[i]).lighten(0.5).hex() : colors[i]} >
          <rect id={data.id} x={x + props.dx} y={y + props.dy} width={width} height={height}
            stroke="black"
            pointerEvents="visibleFill"
            {...props.gestures(data.id)}
          />
          <foreignObject pointerEvents="none" x={x + props.dx + 4} y={y + props.dy} width={width} height={height}>
            <p style={{ fontSize: "10px", color: "white", margin: "0" }}>{treeMapNode.toString()}</p>
          </foreignObject>
          <foreignObject pointerEvents="none" x={x + props.dx + 4} y={y + props.dy + 16} width={width} height={height}>
            <p style={{ fontSize: "10px", color: "white", margin: "0" }}>{data.xmlNode.data}</p>
          </foreignObject>
        </g >
        {
          props.openedNodes.includes(treeMapNode.id) && <TreeMapSection
            {...props}
            root={node}
            width={width - 10}
            height={height - 30}
            dx={x + props.dx + 5}
            dy={y + props.dy + 20} />
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
  const [openedNodes, setOpenedNodes] = useState<string[]>([])
  const [collapsedNodes, setCollapsedNodes] = useState<string[]>([])
  const [focusedNodes, setFocusedNodes] = useState<string[]>([])
  const [tempFocusLocation, setTempFocusLocation] = useState<[number, number] | null>()

  // Post render updates
  useEffect(() => {
    if (tempFocusLocation) {
      const elementUnderPoint = document.elementFromPoint(...tempFocusLocation)
      elementUnderPoint?.id && setFocusedNodes([elementUnderPoint?.id])
      setTempFocusLocation(null)
    }
  }, [tree, treeMapNodes, focusedNodes, tempFocusLocation])

  const gestures: (id: string) => ReactEventHandlers = useGesture({
    onDragStart: state => {
      if (tree && treeMapNodes) {
        const [id]: [string] = state.args
        const [on, cn, tmn] = openNodes(tree, treeMapNodes, openedNodes, collapsedNodes, id, state.ctrlKey)
        setTreeMapNodes(tmn)
        setOpenedNodes(on)
        setCollapsedNodes(cn)
        setTempFocusLocation(state.xy)
      }

    },
    onHover: state => {
      const [id]: [string] = state.args
      if (tree && treeMapNodes) {
        setFocusedNodes([id])
      }
    }
  })


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
        openedNodes={openedNodes}
        collapsedNodes={collapsedNodes}
        focusedNodes={focusedNodes}
        width={windowWidth}
        height={windowHeight - 54}
        gestures={gestures}
      />

    }
  </div>
}
export default App

function openNodes(
  tree: Tree,
  treeMapNodes: Map<string, TreeMapNode>,
  openedNodes: string[],
  collapsedNodes: string[],
  id: string,
  collapseSiblings: boolean
): [string[], string[], Map<string, TreeMapNode>] {
  const treeMapNodesDraft = new Map(treeMapNodes)
  let openedNodesDraft = [...openedNodes]
  let collapsedNodesDraft = [...collapsedNodes]

  if (tree.children(id).length > 0) {
    console.log(id);
    // toggle open the node that was clicked
    sole(treeMapNodesDraft.get(id)).forEach(n => {
      if (!openedNodesDraft.includes(n.id) || !collapsedNodesDraft.includes(n.id)) {
        openedNodesDraft.push(n.id)
        collapsedNodesDraft = collapsedNodesDraft.filter(x => x !== n.id)
      }
      n.value = nodeSize(tree, tree.node(n.id))
    });
    // toggle closed the children of the node that was clicked, not essential
    for (const child of tree.children(id)) {
      // eslint-disable-next-line
      tree.recurse(child, n => sole(treeMapNodesDraft.get(n.id)).forEach(n => {
        openedNodesDraft = openedNodesDraft.filter(x => x !== n.id)
        collapsedNodesDraft = collapsedNodesDraft.filter(x => x !== n.id)

        n.value = nodeSize(tree, tree.node(n.id))
      }));
    }
    if (collapseSiblings) {
      collapseCousins(tree, id, treeMapNodesDraft, collapsedNodesDraft);
    }
  }
  return [openedNodesDraft, collapsedNodesDraft, treeMapNodesDraft]
}


function collapseCousins(tree: Tree, id: string, treeMapNodesDraft: Map<string, TreeMapNode>, collapsedNodesDraft: string[]) {
  let node: Node = tree.node(id);
  while (node !== tree.root) {
    // collapse the siblings of the node that was clicked
    for (const sibling of tree.siblings(node)) {
      // eslint-disable-next-line
      sole(treeMapNodesDraft.get(sibling.id)).forEach(s => {
        collapsedNodesDraft.push(s.id);
        s.value = 0;
      });
    }
    // step up to the parent and repeat sibling closure
    node = tree.parent(node);
  }
}

function nodeSize(tree: Tree, node: Node): number {
  return tree.children(node).flatMap(c => nodeSize(tree, c)).reduce((x, y) => x + y, 1)
}
