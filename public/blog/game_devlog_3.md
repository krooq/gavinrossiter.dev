# Game Devlog #3

#### Apr. 12, 2021 | Gavin Rossiter

Ok so it has been a while since the last one..
I've recently changed my day job (starting today actually) so I have been a bit preoccupied, but really that is no excuse.

Since last time I wrote I have actually done quite a lot of work on the game, although not a whole lot of it is visual. The main parts I want to talk this week about are the "ECS" design, the save/load system, the terrain solution and the character controller. 

So without further ado, the ECS design..
When I first started the game I really wanted to use Unity's DOTS both for performance and to just learn a new programming paradigm. However after some trial and error it seems that DOTS is nowhere near ready yet and probably wont be for at least a year or 2. So I settled on a design that would try to mirror the way ECS systems work without actually actually being a strict ECS system.
Essentially I just have one monobehaviour acting as the entity manager. It is responsible for the top level control flow and dependency injection.  All it does is call each of the systems (static classes) in its in the Unity engine callbacks i.e. Start, Update etc. passing in the required components (monobehaviour without behaviour).
I found this design is really easy to understand and debug as it's about as flat as you can get.
I have a couple of WIP rules like "systems cant call other systems" that help keep the structure flat.
This rule is easily managed by making one system (would be caller) change a piece of data in a component that acts as a message for the other system (would be callee).
Because the engine operates in a fixed loop it's really easy to narrow down bugs as you can just watch the trigger data change in the debugger.

The largest piece of functionality I worked on was the save/load or serialization system.  I needed it to work with this ECS design and I really wanted to know the ins and outs of it so I opted to write it myself than buy an asset.
It took 2 iterations but I got a design I'm quite happy with.  It has 2 parts, a component with custom editor that will provide a list of checkboxes to select which component to serialize and a system that does the serialization.  The system is just a list of serializers (function pairs) for each system.  The user extends this list for each component it wants to serialize implementing the functionality for each type. This aligns to the ECS design, the behaviour for serializing different objects is inside the SerializationSystem rather than implemented on each object (component) as would be the case in an OO design. To use the Serialization component the Entity needs another component called a PrefabAsset that identifies the object template that is instantiated when loading a saved game.  Without this there is no way to identify which non serialized data belongs with which serialized component data.
The solution is so simple and extensible I might create a free asset to see if people like it.

After the save/load was working I spent a lot of time learning the terrain assets I wanted to use.
I'm using Map Magic 2 to procedurally generate my terrain, Vegetation Studio Pro to render the vegetation performantly and unlock custom vegetation shaders and finally MicroSplat because awesome textures are awesome. I still have a lot of environment design to do but I feel that the base I have with these assets is really solid.  Mind you this setup is not cheap, I easily spent over $300 on these 3 and the required URP support, but it's worth every penny.

Finally I swapped out my custom character controller for an asset from Lightbug.
It has a very simple API and the demo really impressed me.  Character controllers are suprisingly difficult. 

Ok that's it, no video.
My goal right now is to create a banger scene and start posting to twitter.
Shouldn't be too long until I can do that, maybe a month or so.

Bye!