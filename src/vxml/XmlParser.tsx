import parseFile from './tiny_uploader'
// expat-wasm is the sax parser in use but anything can work
const XmlParser = require('expat-wasm');
const TAG_START = 'startElement'
const TAG_BODY = 'characterData'
const TAG_END = 'endElement'

// Node is a parsed element of the XML tree
export type Node = {
  parent: Node | null,
  children: Node[],
  name: string,
  attributes: object,
  data: string
}

export const parseXml = async (file: File, onParseComplete: (root: Node) => any) => {
  console.log(`parsing ${file.name}...`)
  let parser = await XmlParser.create()

  let root: Node;
  let current: Node;

  parser.on(TAG_START, (name: string, attributes: object) => {
    // set root node
    if (!root) {
      root = { parent: null, children: [], name: name, attributes: new Map(), data: "" }
      current = root
      return
    }
    // add child node
    if (current.name !== name) {
      const child = { parent: current, children: [], name: name, attributes: attributes, data: "" }
      current.children.push(child)
      current = child
      return
    }
    // add sibling node
    const sibling = { parent: current.parent, children: [], name: name, attributes: attributes, data: "" }
    current.parent?.children.push(sibling)
  })

  parser.on(TAG_BODY, (data: string) => {
    current.data = current.data + data
  })

  parser.on(TAG_END, (name: string) => {
    current = current.parent || root
  })

  const parseChunk = (xmlChunk: any) => { parser.parse(xmlChunk, 0) }
  const parseComplete = (xmlFile: any) => {
    console.log("parsing complete!")
    onParseComplete(root)
    parser.destroy()
  }
  parseFile(file, { 'chunk_read_callback': parseChunk, 'success': parseComplete })
}

// node printing utility, useful for checking the parse result
export function printNodes(node: Node, depth: number = 0, indentation: string = "  ") {
  const indent = indentation.repeat(depth)
  const dataIndent = indentation.repeat(depth + 1)
  console.log(`${indent}<${node.name}${Object.entries(node.attributes).map(o => ` ${o[0]}="${o[1]}"`).join()}>`)
  if (node.data.trim().length > 0) {
    console.log(`${dataIndent}${node.data.trim().replace("\n", `\n${dataIndent}`)}`)
  }
  for (let child of node.children) {
    printNodes(child, depth + 1)
  }
  console.log(`${indent}</${node.name}>`)
}
