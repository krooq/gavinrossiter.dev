import parseFile from './tiny_uploader'
import { Node, Tree } from './Tree'
// expat-wasm is the sax parser in use but anything can work
const XmlParser = require('expat-wasm')
const TAG_START = 'startElement'
const TAG_BODY = 'characterData'
const TAG_END = 'endElement'

/**
 * Parsed element of an XML tree.
 */
export type XmlNode = {
  name: string
  attributes: object,
  data: string
}

export async function parseXml(file: File): Promise<[Tree, Map<string, XmlNode>]> {
  console.log(`parsing ${file.name}...`)
  let parser = await XmlParser.create()

  const xmlNodes = new Map<string, XmlNode>()
  let tree: Tree
  let current: Node

  parser.on(TAG_START, (name: string, attributes: object) => {
    if (!tree) {
      tree = Tree()
      current = tree.root
    } else
      current = tree.addChild(current)

    xmlNodes.set(current.id, { name: name, attributes: attributes, data: "" })
  })

  parser.on(TAG_BODY, (data: string) => {
    const node = xmlNodes.get(current.id)
    if (node)
      node.data += data.trim()
    else
      console.log("Invalid node encountered in parsing!", current)
  })

  parser.on(TAG_END, (name: string) => {
    if (current === tree.root)
      return
    const parent = tree.parent(current)
    if (parent)
      current = parent
    else
      console.log("Invalid node encountered in parsing!", current)
  })
  const parseChunk = (xmlChunk: any) => { parser.parse(xmlChunk, 0) }

  return new Promise<[Tree, Map<string, XmlNode>]>((resolve, reject) => {
    parseFile(file, {
      'chunk_read_callback': parseChunk, 'success': (xmlFile: any) => {
        console.log("parsing complete!")
        parser.destroy()
        resolve([tree, xmlNodes])
      }
    })
  })
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

