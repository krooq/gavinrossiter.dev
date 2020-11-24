import { v4 as uuidv4 } from 'uuid'
import { head, notEmpty } from '../common/Util'

export type Node = {
    id: string,
    parent: string,
    children: string[],
}
export type Tree = {
    sentinel: Node
    root: Node
    nodes: Map<string, Node>
    node: (node: Node | string) => Node
    id: (node: Node | string) => string
    parent: (node: Node | string) => Node
    children: (node: Node | string) => Node[]
    siblings: (node: Node | string) => Node[]
    addChild: (node: Node | string) => Node
    addSibling: (node: Node | string) => Node
    recurse: (node: Node | string, f: (node: Node) => void) => void
}
export function Node(parent: Node): Node {
    const id = uuidv4()
    const children: string[] = []
    return { id, parent: parent.id, children }
}

export function Tree(): Tree {
    const sentinel = { id: uuidv4(), parent: uuidv4(), children: Array<string>() }
    const nodes = new Map<string, Node>()
    const node = (n: Node | string) => head([nodes.get(typeof n === 'string' ? n : n.id)].filter(notEmpty), () => Error('Node not found in tree!'))
    const id = (n: Node | string) => node(n).id
    const parent = (n: Node | string) => node(node(n).parent)
    const children = (n: Node | string) => node(n).children.map(c => node(c))
    const siblings = (n: Node | string) => children(parent(n)).filter(s => id(s) !== id(n))
    const addChild = (n: Node | string) => {
        const parentNode = node(n)
        const childNode = Node(parentNode)
        parentNode.children.push(childNode.id)
        nodes.set(childNode.id, childNode)
        return childNode
    }
    const addSibling = (n: Node | string) => addChild(parent(n))
    const recurse = (n: Node | string, f: (n: Node) => void) => {
        f(node(n))
        children(n).forEach(c => recurse(c, f))
    }
    nodes.set(sentinel.id, sentinel)
    const root = addChild(sentinel)
    return { sentinel, root, nodes, node, id, parent, children, siblings, addChild, addSibling, recurse }
}

/**
* Recurse depth first through a `Tree` starting at some `TreeNode` and descending through its children applying a function at each node.
* If the function returns a truthy value, the recursion short circuits and last result of the function is returned.
* @param node to start recursion from
* @param f function applied to each child, returns truthy value if the recursion should short circuit
*/
export function recurse<U>(tree: Tree, node: Node, onEnter: (node: Node) => U, onExit: ((node: Node) => void) | null = null): U {
    let result: U = onEnter(node)
    if (!result) {
        tree.children(node).forEach(child => {
            result = child ? recurse(tree, child, onEnter, onExit) : result
        })
    }
    if (onExit)
        onExit(node)
    return result
}

export default {}
