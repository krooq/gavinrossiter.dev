import { exception } from 'console'
import { v4 as uuidv4 } from 'uuid'

export type TreeNode<T> = T & {
    id: string,
    parent: string | null,
    children: string[],
}
export type Tree<T> = {
    root: TreeNode<T>
    nodes: Map<string, TreeNode<T>>
    addChild: (node: TreeNode<T>, child: T) => TreeNode<T>
    addSibling: (node: TreeNode<T>, sibling: T) => TreeNode<T> | undefined
    parent: (node: TreeNode<T>) => TreeNode<T> | undefined
    children: (node: TreeNode<T>) => (TreeNode<T> | undefined)[]
}
export function TreeNode<T>(node: T, parent?: TreeNode<T>): TreeNode<T> {
    const id = uuidv4()
    const children = new Array<string>()
    return { ...node, id, parent: parent?.id ?? null, children }
}

export function Tree<T>(rootNode: T): Tree<T> {
    const root = TreeNode(rootNode)
    const nodes = new Map<string, TreeNode<T>>()
    const parent = (node: TreeNode<T>) => node.parent ? nodes.get(node.parent) : root
    const children = (node: TreeNode<T>) => node.children.map(nodes.get)
    const addChild = (node: TreeNode<T>, child: T) => {
        const childNode = TreeNode(child, node)
        node.children.push(childNode.id)
        nodes.set(node.id, node)
        return childNode
    }
    const addSibling = (node: TreeNode<T>, sibling: T) => {
        const parentNode: TreeNode<T> | undefined = parent(node)
        return parentNode ? addChild(parentNode, sibling) : undefined
    }
    return { root, nodes, parent, children, addChild, addSibling }
}

/**
* Recurse depth first through a `Tree` starting at some `TreeNode<T>` and descending through its children apply a function at each node.
* If the function returns a truthy value, the recursion short circuits and last result of the function is returned.
* @param node to start recursion from
* @param f function applied to each child, returns truthy value if the recursion should short circuit
*/
export function recurse<T, U>(tree: Tree<T>, node: TreeNode<T>, f: (node: TreeNode<T>) => U): U {
    let result: U = f(node)
    if (!result) {
        tree.children(node).forEach(child => { result = child ? recurse(tree, child, f) : result })
    }
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
