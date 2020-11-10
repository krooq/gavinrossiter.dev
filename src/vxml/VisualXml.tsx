import React, { Fragment, useState } from 'react';
import useWindowDimensions from '../common/WindowDimensions';
import { v4 as uuidv4 } from 'uuid';
import { parseXml, Node } from './XmlParser';
// non typescript imports
const { getTreemap } = require('treemap-squarify');
const colormap = require('colormap')

type TreeMapNode = { id: string, value: number, node: Node, children: TreeMapNode[], opened: boolean }
type TreeMapRect = { x: number, y: number, width: number, height: number, data: TreeMapNode }

function buildTreeMapNode(node: Node, opened: boolean = false): TreeMapNode {
  return {
    id: uuidv4(),
    value: node.children.length + 1,
    node: node,
    children: node.children.map(n => buildTreeMapNode({ ...n })),
    opened: opened
  }
}

function nodeToString(node: Node): string {
  return `<${node.name}${Object.entries(node.attributes).map(o => ` ${o[0]}="${o[1]}"`).join()}>`
}

function TreeMap(props: { data: TreeMapNode, width: number, height: number, onNodeClick: (node: TreeMapNode) => void }) {
  return <Fragment>
    {props.data.children.length > 0 &&
      <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height}>
        <TreeMapSection key={uuidv4()} {...props} dx={0} dy={0} />
        Sorry, your browser does not support inline SVG.
      </svg>
    }
  </Fragment>
}

function TreeMapSection(props: { data: TreeMapNode, width: number, height: number, dx: number, dy: number, onNodeClick: (node: TreeMapNode) => void }) {
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
            onClick={e => props.onNodeClick(data)} />
          <text x={x + props.dx + 4} y={y + props.dy + 12} fill="white" fontSize="10px">{nodeToString(data.node)}</text>
          <text x={x + props.dx + 4} y={y + props.dy + 12 + 16} fill="white" fontSize="10px">{data.node.data}</text>
        </g >
        {data.opened && <TreeMapSection
          data={data}
          width={width - 10}
          height={height - 30}
          dx={x + props.dx + 5}
          dy={y + props.dy + 25}
          onNodeClick={props.onNodeClick} />}
      </Fragment>
    }
    )
}

function App() {
  const [windowWidth, windowHeight] = useWindowDimensions();
  const [upload, setUpload] = useState<File>()
  const [rootTreeMapNode, setRootTreeMapNode] = useState<TreeMapNode>()

  const onNodeClick = (data: TreeMapNode) => {
    if (rootTreeMapNode && data.children.length > 0) {
      const openNode = (node: TreeMapNode) => {
        if (node.id === data.id) {
          node.opened = !node.opened
          return true
        }
        return false
      }
      const closeChildren = (node: TreeMapNode) => {
        node.opened = false
        return false
      }
      recurse(rootTreeMapNode, openNode)
      // closes all children, sorta like collapse all
      // remove this to remember what children were open
      data.children.forEach(child => recurse(child, closeChildren))
      setRootTreeMapNode({ ...rootTreeMapNode })
    }
  }
  return <div>
    <div style={{ height: "50px" }}>
      <div style={{ padding: "8px" }}>
        <input type="file" onChange={(e) => setUpload(e?.target?.files?.[0])} />
        <button onClick={(e) => upload && parseXml(upload, root => {
          setRootTreeMapNode(buildTreeMapNode(root))
        })}>Parse</button>
      </div>
    </div>
    {rootTreeMapNode && <TreeMap
      data={rootTreeMapNode}
      width={windowWidth}
      height={windowHeight - 54}
      onNodeClick={onNodeClick} />}
  </div>
}


/**
 * Recursive a recursive element starting at some node and descending through its children.
 * If the recursion short circuits, the last node that was visited is returned.
 * @param node to start recursion from
 * @param f function applied to each child, returns true if the recursion should short circuit
 */
function recurse<N extends { children: N[] }>(node: N, f: (node: N) => boolean): N {
  const shouldContinue: boolean = !f(node)
  let terminatingNode: N = node
  if (shouldContinue) {
    node.children.forEach(child => { terminatingNode = recurse(child, f) })
  }
  return terminatingNode
}

export default App
