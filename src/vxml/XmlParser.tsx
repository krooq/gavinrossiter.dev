import { exception } from 'console';
import parseFile from './tiny_uploader'
import { TreeNode, Tree } from './Tree'
// expat-wasm is the sax parser in use but anything can work
const XmlParser = require('expat-wasm');
const TAG_START = 'startElement'
const TAG_BODY = 'characterData'
const TAG_END = 'endElement'

/**
 * Parsed element of an XML tree.
 */
export type XmlNodeData = {
  name: string
  attributes: object,
  data: string | null
}

export const parseXml = async (file: File, onParseComplete: (tree: Tree<XmlNodeData>) => any) => {
  console.log(`parsing ${file.name}...`)
  let parser = await XmlParser.create()

  let tree: Tree<XmlNodeData>
  let current: TreeNode<XmlNodeData>

  parser.on(TAG_START, (name: string, attributes: object) => {
    // set root node
    if (!tree) {
      tree = Tree<XmlNodeData>({ name: name, attributes: {}, data: null })
      current = tree.root
      return
    }
    // add child node
    if (current.name !== name) {
      const child: XmlNodeData = { name: name, attributes: attributes, data: null }
      current = tree.addChild(current, child)
      return
    }
    // add sibling node
    const sibling = { parent: current.parent, children: [], name: name, attributes: attributes, data: "" }
    tree.addSibling(current, sibling)
  })

  parser.on(TAG_BODY, (data: string) => {
    current.data = current.data + data
  })

  parser.on(TAG_END, (name: string) => {
    const parent = tree.parent(current)
    if (parent) {
      current = parent
    } else {
      throw exception(`Invalid node encountered in parsing! node: ${current}`)
    }
  })

  const parseChunk = (xmlChunk: any) => { parser.parse(xmlChunk, 0) }
  const parseComplete = (xmlFile: any) => {
    console.log("parsing complete!")
    onParseComplete(tree)
    parser.destroy()
  }
  parseFile(file, { 'chunk_read_callback': parseChunk, 'success': parseComplete })
}

// node printing utility, useful for checking the parse result
// export function printNodes(node: Node, depth: number = 0, indentation: string = "  ") {
//   const indent = indentation.repeat(depth)
//   const dataIndent = indentation.repeat(depth + 1)
//   console.log(`${indent}<${node.name}${Object.entries(node.attributes).map(o => ` ${o[0]}="${o[1]}"`).join()}>`)
//   if (node.data.trim().length > 0) {
//     console.log(`${dataIndent}${node.data.trim().replace("\n", `\n${dataIndent}`)}`)
//   }
//   for (let child of node.children) {
//     printNodes(child, depth + 1)
//   }
//   console.log(`${indent}</${node.name}>`)
// }
