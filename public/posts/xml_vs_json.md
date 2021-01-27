# XML vs JSON, what you need to know
#### Nov. 11, 2020 | Gavin Rossiter

XML and JSON are very 2 popular human readable serialization formats.
In this post I want to quickly talk about the similarities and differences between these 2 formats.
I hope to give you an understanding of the components of each to show how to create or parse either format equivalently.

**JSON** stands for **J**ava**S**cript **O**bject **N**otation.
This means that JavaScript objects are already in a serialized form, no extra translation overhead or complexity, pretty useful for a web based scripting language.

**XML** stands for e**X**tensible **M**arkup **L**anguage.
This means XML can be extended to create domain specific languages via a schema (XSD).

It would be inaccurate to say that JSON is less powerful than XML (or vice versa), without extra tools their representation power is equivalent.
So lets talk about how they represent data.
Both utilize a **tree** structure to encode relationships between objects.
Both contain elements with a recursive structure but their element types differ slightly:

<br>**JSON**

```
type Element = Map<String, Element | String | Array<Element | String>>

// Basic JSON elements:
// Map<String, Element>                 {a: {} }
// Map<String, Array<Element>>          {a: [{},{}]}
// Map<String, Map<String, String>>     {a: {b: "text", c: "text"}}
// Map<String, String>                  {a: "text" }
// Map<String, Array<String>>           {a: ["text", "text"]}
```
<br>**XML**

```
type Element = Map<String, Map<String, String> & (Array<Element> | String)>

// Basic XML elements:
// Map<String, Element>                 <a><b/></a>
// Map<String, Array<Element>>          <a><b/><c/></a>
// Map<String, Map<String, String>>     <a b="text" c="text></a>
// Map<String, String>                  <a>text</a>
// Map<String, Array<String>>           // not allowed
```

So no matter how long you stare at this I think it will always be tricky to grok, but I believe the intuition is really simple.  
If you have some type V that has some identifying attribute of type K then you can group V's by their K's, this is just a map.
But doing this is a bit redundant since each V already contains the its K.
XML forces you to include the name information inside the object, instead of placing it on the parent as a map key as you could in JSON.

```
type K = { ... /* whatever*/ }
type V = { k: K, ... /* whatever */ }

// JSON is to Map<K, V>
// as
// XML is to Array<V>
```

But there is of course no reason you cannot do this in JSON.


## Equivalence
Without further ado, here is an equivalence mapping between XML and JSON.
It shows how JSON can become XML if it wants to, the reverse is not true.

<br>**JSON**

```
{
    _name: "root",
    _children: [
        {
            _name: "a", x: "", y: "",
            _children: [
                {
                    _name: "b", z: "",
                    _children: [
                        { _name: "c", _children: [] },
                        { _name: "d", _children: [] }
                    ]
                }
            ]
        }
    ]
}
```

<br>**XML**

```
<root>
    <a x="" y="">
        <b z="">
            <c></c>
            <d></d>
        </b>
    </a>
</root>
```