import React, { Fragment, useState } from 'react';
import useWindowDimensions from '../common/WindowDimensions';
import { v4 as uuidv4 } from 'uuid';
import { parseXml, Node } from './XmlParser';
// non typescript imports
const { getTreemap } = require('treemap-squarify');
const colormap = require('colormap')

type TreeMapNode = { id: string, value: number, node: Node, children: TreeMapNode[], expand: boolean }
type TreeMapRect = { x: number, y: number, width: number, height: number, data: TreeMapNode }

function buildTreeMapNode(node: Node, expand: boolean = false): TreeMapNode {
  return {
    id: uuidv4(),
    value: node.children.length + 1,
    node: node,
    children: node.children.map(n => buildTreeMapNode({ ...n })),
    expand: expand
  }
}

function nodeToString(node: Node): string {
  return `<${node.name}${Object.entries(node.attributes).map(o => ` ${o[0]}="${o[1]}"`).join()}>`
}

function TreeMap(props: { data: TreeMapNode, width: number, height: number, onNodeClick: (node: TreeMapNode) => void }) {
  return <Fragment>
    {props.data.children.length > 0 &&
      <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height}>
        <TreeMapSection {...props} dx={0} dy={0} />
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
      console.log({ n: data.node.name, x: x, y: y })
      return data.expand
        ? <TreeMapSection key={data.id} data={data} width={width} height={height} dx={x + props.dx} dy={y + props.dy} onNodeClick={props.onNodeClick} />
        : <g key={data.id} fill={colors[i]}>
          <rect x={x + props.dx} y={y + props.dy} width={width} height={height}
            stroke="black"
            pointerEvents="visibleFill"
            onClick={e => props.onNodeClick(data)} />
          <text x={x + props.dx + 4} y={y + props.dy + 12} fill="white" fontSize="10px">{nodeToString(data.node)}</text>
          <text x={x + props.dx + 4} y={y + props.dy + 12 + 16} fill="white" fontSize="10px">{data.node.data}</text>
        </g >
    }
    )
}

function App() {
  const [windowWidth, windowHeight] = useWindowDimensions();
  const [upload, setUpload] = useState<File>()
  const [treeMapNode, setTreeMapNode] = useState<TreeMapNode>()

  const onNodeClick = (data: TreeMapNode) => {
    const recursiveExpand = (node: TreeMapNode) => {
      if (node.id === data.id) {
        node.expand = true
        return
      } else {
        node.children.forEach(recursiveExpand)
      }
    }
    if (treeMapNode && data.children.length > 0) {
      recursiveExpand(treeMapNode)
      setTreeMapNode({ ...treeMapNode })
    }
  }
  return <div>
    <div style={{ height: "50px" }}>
      <div style={{ padding: "8px" }}>
        <input type="file" onChange={(e) => setUpload(e?.target?.files?.[0])} />
        <button onClick={(e) => upload && parseXml(upload, root => {
          setTreeMapNode(buildTreeMapNode(root))
        })}>Parse</button>
      </div>
    </div>
    {treeMapNode && <TreeMap
      data={treeMapNode}
      width={windowWidth}
      height={windowHeight - 54}
      onNodeClick={onNodeClick} />}
  </div>
}


export default App
