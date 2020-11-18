import { v4 as uuidv4 } from 'uuid'

function notEmpty<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

export type Node = {
    id: string,
    parent: string,
    children: string[],
}
export type Tree = {
    sentinel: string
    root: Node
    nodes: Map<string, Node>
    parent: (node: Node) => Node | undefined
    children: (node: Node) => (Node | undefined)[]
    addChild: (node: Node) => Node
    addSibling: (node: Node) => Node | undefined
}
export function Node(parent: Node): Node {
    const id = uuidv4()
    const children: string[] = []
    return { id, parent: parent.id, children }
}

export function Tree(): Tree {
    const sentinel = uuidv4()
    const root = { id: uuidv4(), parent: sentinel, children: [] }
    const nodes = new Map<string, Node>()
    const parent = (n: Node) => n.parent ? nodes.get(n.parent) : undefined
    const children = (n: Node) => n.children.map(id => nodes.get(id))
    const addChild = (n: Node) => {
        const childNode = Node(n)
        n.children.push(childNode.id)
        nodes.set(childNode.id, childNode)
        return childNode
    }
    const addSibling = (node: Node) => {
        const parentNode: Node | undefined = parent(node)
        return parentNode ? addChild(parentNode) : undefined
    }
    nodes.set(root.id, root)
    return { sentinel, root, nodes, parent, children, addChild, addSibling }
}

/**
* Recurse depth first through a `Tree` starting at some `TreeNode` and descending through its children applying a function at each node.
* If the function returns a truthy value, the recursion short circuits and last result of the function is returned.
* @param node to start recursion from
* @param f function applied to each child, returns truthy value if the recursion should short circuit
*/
export function recurse<U>(tree: Tree, node: Node, onEnter: (node: Node) => U, onExit: (node: Node) => void): U {
    let result: U = onEnter(node)
    if (!result) {
        tree.children(node).forEach(child => {
            result = child ? recurse(tree, child, onEnter, onExit) : result
        })
    }
    onExit(node)
    return result
}

// XML vs JSON
{/* 
<root>
    <a x="" y="">
        <b z="">
            <c></c>
            <d></d>
        </b>
    </a>
</root>

{
    _name: "root"
    _children: [
        {
            _name: "a", x: "", y: "",
            _children: [
                {
                    _name: "b", z: "",
                    _children: [
                        { _name: "c", _children: [] },
                        { _name: "d", _children: [] },
                    ]
                }
            ]
        }
    ]
} 
*/}
export default {}
