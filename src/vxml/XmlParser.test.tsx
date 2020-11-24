import { Tree } from './Tree';
import { XmlNode, parseXml } from './XmlParser'

test('parse tree', async () => {
    const xml: string = `
    <root>
        <ar_1 x="x1">
            <b1_1 x="x2">
                <c1_1 x="x3">a</c1_1>
                <c1_2 x="x4">b</c1_2>
            </b1_1>
            <b1_2 y="y1">
                <c2_1 y="y2">c</c2_1>
                <c2_2 y="y3">d</c2_2>
            </b1_2>
        </ar_1>
        <ar_2 z1="abc1" z2="def2">
            <b2_1 z3="abc3" z4="def4">
                <c1_1>e</c1_1>
                <c1_2>f</c1_2>
            </b2_1>
            <b2_2>
                <c2_1 z5="abc5" z6="def6">g</c2_1>
                <c2_2></c2_2>
            </b2_2>
        </ar_2>
    </root>
    `
    const file = new File([xml], 'text.xml')
    const [tree, xmlNodes] = await parseXml(file);
    expect([tree.root.id].map(n => xmlNodes.get(n))).toEqual([{ name: "root", attributes: {}, data: "" }]);
    expect(tree.root.children.map(n => xmlNodes.get(n))).toEqual([
        { name: "ar_1", attributes: { x: "x1" }, data: "" },
        { name: "ar_2", attributes: { z1: "abc1", z2: "def2" }, data: "" }
    ]);
    expect(tree.root.children.flatMap(n => tree.children(n)).map(n => xmlNodes.get(n.id))).toEqual([
        { name: "b1_1", attributes: { x: "x2" }, data: "" },
        { name: "b1_2", attributes: { y: "y1" }, data: "" },
        { name: "b2_1", attributes: { z3: "abc3", z4: "def4" }, data: "" },
        { name: "b2_2", attributes: {}, data: "" }
    ]);
    expect(tree.root.children.flatMap(n => tree.children(n)).flatMap(n => tree.children(n)).map(n => xmlNodes.get(n.id))).toEqual([
        { name: "c1_1", attributes: { x: "x3" }, data: "a" },
        { name: "c1_2", attributes: { x: "x4" }, data: "b" },
        { name: "c2_1", attributes: { y: "y2" }, data: "c" },
        { name: "c2_2", attributes: { y: "y3" }, data: "d" },
        { name: "c1_1", attributes: {}, data: "e" },
        { name: "c1_2", attributes: {}, data: "f" },
        { name: "c2_1", attributes: { z5: "abc5", z6: "def6" }, data: "g" },
        { name: "c2_2", attributes: {}, data: "" }
    ]);
});

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