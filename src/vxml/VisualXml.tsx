import React, { Fragment, useState } from 'react';
import useWindowDimensions from '../common/WindowDimensions';
import { v4 as uuidv4 } from 'uuid';
import { parseXml, XmlNode } from './XmlParser';
import { Tree, Node, recurse } from './Tree';
// non typescript imports
const { getTreemap } = require('treemap-squarify');
const colormap = require('colormap')


type TreeMapNode = {
  id: string
  xmlNode: XmlNode
  value: number,
  opened: boolean,
  collapsed: boolean
}
type TreeMapRect = {
  x: number,
  y: number,
  width: number,
  height: number,
  data: Node
}

function TreeMapNode(node: Node, xmlNode: XmlNode): TreeMapNode {
  return { id: node.id, xmlNode: xmlNode, value: node.children.length + 1, opened: false, collapsed: true }
}

// function buildTreeMapNode(node: TreeNode<TreeMapNodeData<XmlNode>>, opened: boolean = false, collapsed = false): TreeMapNode {
//   return {
//     children: node.children.map(n => buildTreeMapNode({ ...n })),
//     id: uuidv4(),
//     value: node.children.length + 1,
//     node: node,
//     opened: opened,
//     collapsed: collapsed
//   }
// }

function nodeToString(node: TreeMapNode): string {
  return `<${node.xmlNode.name}${Object.entries(node.xmlNode.attributes).map(o => ` ${o[0]}="${o[1]}"`).join()}>`
}

function TreeMap(props: {
  tree: Tree,
  root: Node,
  treeMapNodes: Map<string, TreeMapNode>,
  width: number,
  height: number,
  onClick: (node: string) => void,
  onDoubleClick: (node: string) => void
}) {
  return <Fragment>
    {props.root.children.length > 0 &&
      <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height}>
        <TreeMapSection key={uuidv4()} {...props} dx={0} dy={0} />
        Sorry, your browser does not support inline SVG.
      </svg>
    }
  </Fragment>
}

function TreeMapSection(props: {
  tree: Tree,
  root: Node,
  treeMapNodes: Map<string, TreeMapNode>,
  width: number,
  height: number,
  dx: number,
  dy: number,
  onClick: (node: string) => void,
  onDoubleClick: (node: string) => void
}) {
  // console.log(props.tree.children(props.root).map(n => n && props.treeMapNodes.get(n.id)))
  let colors: string[] = colormap({
    colormap: 'temperature',
    nshades: Math.max(props.root.children.length, 10),
    format: 'hex',
    alpha: 0.75
  })

  return getTreemap({ data: props.tree.children(props.root).map(n => n && props.treeMapNodes.get(n.id)), width: props.width, height: props.height })
    .map(({ x, y, width, height, data }: TreeMapRect, i: number) => {
      console.log({ x, y, width, height, data })
      const treeMapNode = props.treeMapNodes.get(data.id)
      return treeMapNode && <Fragment key={data.id}>
        <g fill={colors[i]}>
          <rect x={x + props.dx} y={y + props.dy} width={width} height={height}
            stroke="black"
            pointerEvents="visibleFill"
            onClick={e => props.onClick(data.id)}
          // onDoubleClick={e => props.onDoubleClick(data)}
          />
          <text x={x + props.dx + 4} y={y + props.dy + 12} fill="white" fontSize="10px">{nodeToString(treeMapNode)}</text>
          {/* <text x={x + props.dx + 4} y={y + props.dy + 12 + 16} fill="white" fontSize="10px">{data.node.data}</text> */}
        </g >
        {treeMapNode.opened && <TreeMapSection
          tree={props.tree}
          root={data}
          treeMapNodes={props.treeMapNodes}
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
  const [treeMapNodes, setTreeMapNodes] = useState<Map<string, TreeMapNode>>()
  const [tree, setTree] = useState<Tree>()

  const onDoubleClick = (id: string) => {
    // if (tree && data.children.length > 0) {
    //   const openNode = (node: TreeMapNode) => {
    //     if (node.id === data.id) {
    //       node.opened = !node.opened
    //       return node
    //     }
    //     return null
    //   }
    //   const closeChildren = (node: TreeMapNode) => {
    //     node.opened = false
    //     return null
    //   }
    // recurse(rootTreeMapNode, openNode)
    // // closes all children, sorta like collapse all
    // // remove this to remember what children were open
    // data.children.forEach(child => recurse(child, closeChildren))
    // setRootTreeMapNode({ ...rootTreeMapNode })
    // }
  }
  const onClick = (id: string) => {
    // console.log(n)
    // console.log(tree?.children)
    // console.log(tree?.children(n))
    if (tree && treeMapNodes) {
      const node = tree.nodes.get(id)
      if (node && tree.children(node).length > 0) {
        const collapseNodes = (tn: TreeMapNode) => {
          if (tn.id !== id) {
            tn.collapsed = true
          }
          return null
        }
        const resetAll = (node: TreeMapNode) => {
          node.collapsed = false
          return false
        }
      }
      tree.nodes.entries().map(k => treeMapNodes.get(k)).forEach(n => n.collapsed = false)
      // recurse(rootTreeMapNode, resetAll)
      // recurse(rootTreeMapNode, collapseNodes)
      // setRootTreeMapNode({ ...rootTreeMapNode })
      // }
    }
  }
  return <div>
    <div style={{ height: "50px" }}>
      <div style={{ padding: "8px" }}>
        <input type="file" onChange={(e) => setUpload(e?.target?.files?.[0])} />
        <button onClick={(e) => upload && parseXml(upload, (xmlTree, xmlNodes) => {
          setTree(xmlTree)
          // console.log(xmlNodes)
          const treeMapNodesDraft = new Map<string, TreeMapNode>()
          for (const [id, node] of xmlTree.nodes) {
            const xmlNode = xmlNodes.get(id)
            xmlNode && treeMapNodesDraft.set(id, TreeMapNode(node, xmlNode))
          }
          setTreeMapNodes(treeMapNodesDraft)
        })}>Parse</button>
      </div>
    </div>
    {tree && treeMapNodes && <TreeMap
      tree={tree}
      root={tree.root}
      treeMapNodes={treeMapNodes}
      width={windowWidth}
      height={windowHeight - 54}
      onClick={onClick}
      onDoubleClick={onDoubleClick} />}
  </div>
}


// /**
//  * Recurse depth first through a recursive element.
//  * Starting at some node and descending through its children applying a function at each node.
//  * If the function returns a truthy value, the recursion short circuits and last result of the function is returned.
//  * @param node to start recursion from
//  * @param f function applied to each child, returns truthy value if the recursion should short circuit
//  */
// function recurse<N extends { children: N[] }, U>(node: N, f: (node: N) => U): U {
//   let result: U = f(node)
//   if (!result) {
//     node.children.forEach(child => { result = recurse(child, f) })
//   }
//   return result
// }

export default App
