import React, { Fragment, useState } from 'react';
import useWindowDimensions from '../common/WindowDimensions';
import { v4 as uuidv4 } from 'uuid';
import { parseXml, XmlNodeData } from './XmlParser';
import { Tree, TreeNode } from './Tree';
// non typescript imports
const { getTreemap } = require('treemap-squarify');
const colormap = require('colormap')

type TreeMapNode = {
  children: TreeMapNode[],
  id: string,
  value: number,
  node: TreeNode<XmlNodeData>,
  opened: boolean,
  collapsed: boolean
}
type TreeMapNodeData<T> = {
  value: number,
  opened: boolean,
  collapsed: boolean
}
type TreeMapRect = {
  x: number,
  y: number,
  width: number,
  height: number,
  data: TreeMapNode
}

function buildTreeMapNode(node: TreeNode<XmlNodeData>, opened: boolean = false, collapsed = false): TreeMapNode {
  return {
    children: node.children.map(n => buildTreeMapNode({ ...n })),
    id: uuidv4(),
    value: node.children.length + 1,
    node: node,
    opened: opened,
    collapsed: collapsed
  }
}

function nodeToString(node: TreeNode<XmlNodeData>): string {
  return `<${node.name}${Object.entries(node.attributes).map(o => ` ${o[0]}="${o[1]}"`).join()}>`
}

function TreeMap(props: {
  data: TreeMapNode,
  width: number,
  height: number,
  onClick: (node: TreeMapNode) => void,
  onDoubleClick: (node: TreeMapNode) => void
}) {
  return <Fragment>
    {props.data.children.length > 0 &&
      <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height}>
        <TreeMapSection key={uuidv4()} {...props} dx={0} dy={0} />
        Sorry, your browser does not support inline SVG.
      </svg>
    }
  </Fragment>
}

function TreeMapSection(props: {
  data: TreeMapNode,
  width: number,
  height: number,
  dx: number,
  dy: number,
  onClick: (node: TreeMapNode) => void,
  onDoubleClick: (node: TreeMapNode) => void
}) {
  // console.log(props.data)
  let colors: string[] = colormap({
    colormap: 'temperature',
    nshades: Math.max(props.data.children.length, 10),
    format: 'hex',
    alpha: 0.75
  })
  return getTreemap({ data: props.data.children, width: props.width, height: props.height })
    .map(({ x, y, width, height, data }: TreeMapRect, i: number) => {
      // console.log({ n: data.node.name, x: x, y: y })
      return <Fragment key={data.id}>
        <g fill={colors[i]}>
          <rect x={x + props.dx} y={y + props.dy} width={width} height={height}
            stroke="black"
            pointerEvents="visibleFill"
            onClick={e => props.onClick(data)}
            onDoubleClick={e => props.onDoubleClick(data)} />
          <text x={x + props.dx + 4} y={y + props.dy + 12} fill="white" fontSize="10px">{nodeToString(data.node)}</text>
          <text x={x + props.dx + 4} y={y + props.dy + 12 + 16} fill="white" fontSize="10px">{data.node.data}</text>
        </g >
        {data.opened && <TreeMapSection
          data={data}
          width={width - 10}
          height={height - 30}
          dx={x + props.dx + 5}
          dy={y + props.dy + 25}
          onClick={props.onClick}
          onDoubleClick={props.onDoubleClick} />}
      </Fragment>
    }
    )
}

function App() {
  const [windowWidth, windowHeight] = useWindowDimensions();
  const [upload, setUpload] = useState<File>()
  const [rootTreeMapNode, setRootTreeMapNode] = useState<TreeMapNode>()
  const [tree, setTree] = useState<Tree<TreeMapNode>>()

  const onDoubleClick = (data: TreeMapNode) => {
    if (rootTreeMapNode && data.children.length > 0) {
      const openNode = (node: TreeMapNode) => {
        if (node.id === data.id) {
          node.opened = !node.opened
          return node
        }
        return null
      }
      const closeChildren = (node: TreeMapNode) => {
        node.opened = false
        return null
      }
      recurse(rootTreeMapNode, openNode)
      // closes all children, sorta like collapse all
      // remove this to remember what children were open
      data.children.forEach(child => recurse(child, closeChildren))
      setRootTreeMapNode({ ...rootTreeMapNode })
    }
  }
  const onClick = (data: TreeMapNode) => {
    if (rootTreeMapNode && data.children.length > 0) {
      const collapseNodes = (node: TreeMapNode) => {
        if (node.id !== data.id) {
          node.collapsed = true
        }
        return null
      }
      const resetAll = (node: TreeMapNode) => {
        node.collapsed = false
        return false
      }
      recurse(rootTreeMapNode, resetAll)
      recurse(rootTreeMapNode, collapseNodes)
      setRootTreeMapNode({ ...rootTreeMapNode })
    }
  }
  return <div>
    <div style={{ height: "50px" }}>
      <div style={{ padding: "8px" }}>
        <input type="file" onChange={(e) => setUpload(e?.target?.files?.[0])} />
        <button onClick={(e) => upload && parseXml(upload, tree => {
          setRootTreeMapNode(buildTreeMapNode(tree.root))
        })}>Parse</button>
      </div>
    </div>
    {rootTreeMapNode && <TreeMap
      data={rootTreeMapNode}
      width={windowWidth}
      height={windowHeight - 54}
      onClick={onClick}
      onDoubleClick={onDoubleClick} />}
  </div>
}


/**
 * Recurse depth first through a recursive element.
 * Starting at some node and descending through its children applying a function at each node.
 * If the function returns a truthy value, the recursion short circuits and last result of the function is returned.
 * @param node to start recursion from
 * @param f function applied to each child, returns truthy value if the recursion should short circuit
 */
function recurse<N extends { children: N[] }, U>(node: N, f: (node: N) => U): U {
  let result: U = f(node)
  if (!result) {
    node.children.forEach(child => { result = recurse(child, f) })
  }
  return result
}

export default App
