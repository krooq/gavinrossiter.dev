import React, { Fragment, useState } from 'react';
import useWindowDimensions from '../common/WindowDimensions';
import { v4 as uuidv4 } from 'uuid';
import { parseXml, XmlNode } from './XmlParser';
import { iff, sole, notEmpty } from '../common/Util';
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
  data: TreeMapNode
}

function TreeMapNode(node: Node, xmlNode: XmlNode): TreeMapNode {
  return { id: node.id, xmlNode: xmlNode, value: node.children.length, opened: false, collapsed: false }
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
  maxWidth: number,
  maxHeight: number,
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
  maxWidth: number,
  maxHeight: number,
  width: number,
  height: number,
  dx: number,
  dy: number,
  onClick: (node: string) => void,
  onDoubleClick: (node: string) => void
}) {
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
    // only render nodes with a value greater than 0
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
          root={node}
          treeMapNodes={props.treeMapNodes}
          maxWidth={props.maxWidth}
          maxHeight={props.maxHeight}
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
  }
  const onClick = (id: string) => {
    if (tree && treeMapNodes)
      openNodes(tree, treeMapNodes, id, setTreeMapNodes);
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
      root={tree.sentinel}
      treeMapNodes={treeMapNodes}
      maxWidth={windowWidth}
      maxHeight={windowHeight - 54}
      width={windowWidth}
      height={windowHeight - 54}
      onClick={onClick}
      onDoubleClick={onDoubleClick} />}
  </div>
}


export default App


function openNodes(tree: Tree, treeMapNodes: Map<string, TreeMapNode>, id: string, setTreeMapNodes: React.Dispatch<React.SetStateAction<Map<string, TreeMapNode> | undefined>>) {
  if (tree.children(id).length > 0) {
    console.log(id);
    for (let [k, _] of tree.nodes) {
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

