import { Tree } from './Tree';
import { XmlNode, parseXml } from './XmlParser'

const xml: string = `
<root>
    <ar_1>
        <b1_1>
            <c1_1>a</c1_1>
            <c1_2>b</c1_2>
        </b1_1>
        <b1_2>
            <c2_1>c</c2_1>
            <c2_2>d</c2_2>
        </b1_2>
    </ar_1>
    <ar_2>
        <b2_1>
            <c1_1>e</c1_1>
            <c1_2>f</c1_2>
        </b2_1>
        <b2_2>
            <c2_1>g</c2_1>
            <c2_2>h</c2_2>
        </b2_2>
    </ar_2>
</root>
`

test('parse tree', async () => {
    const file = new File([xml], 'text.xml')
    const [tree, xmlNodes] = await parseXml(file);
    expect([tree.root.id].map(n => xmlNodes.get(n))).toEqual([{ name: "root", attributes: {}, data: "" }]);
    expect(tree.root.children.map(n_1 => xmlNodes.get(n_1))).toEqual([
        { name: "ar_1", attributes: {}, data: "" },
        { name: "ar_2", attributes: {}, data: "" }
    ]);
});