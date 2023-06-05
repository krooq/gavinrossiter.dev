# Sins of Object Oriented Programming

#### May. 15, 2021 | Gavin Rossiter

I have explored many different programming languages and paradigms.
The most popular of these is paradigms is object oriented programming and yet the more I use OO the more I hate it.

I think it's pretty clear that a the goal of a programming paradigm is to make it easier for the programmer to understanding how the code works.
Not really a controversial statement there.
In object oriented programming everything is modelled as an object "just like the real world".
So starting out it seems ok, a car is a car, an engine is an engine, and I don't have to worry about how each works, their behaviour is encapsulated.
Seems good, but now what if I want the car to be powered by electricity.
I would need to change the engine of the car to an electric engine, put electric motors on the wheels, install batteries and all kinds of things.
I need to understand how the engine and the car work to be able to make these changes.
Suddenly this object-oriented model works against me as a programmer.

The TLDR; here is that object oriented programming commits a lot of sins that can be remedied by not over engineering the solution.

## Implementation Hiding
TLDR; Don't hide implementation through abstraction.
The programmer is going to need to understand it at some point so why make it harder.
Most of the time, abstraction is just a way to make something way more complicated than it needs to be.


## Side Effects
TLDR; Don't use getters/setters and have side effects when setting data.
This is sort of the same as implementation hiding.
As soon as you add side effects to setters/getters your object does unexpected stuff when its data is changed.
Don't get me wrong, you need to do things differently when data changes, thats what a program is, just don't do it immediately.
Data is data, leave it be just data.
If you want your object to leave the memory realm and enter the disk or network realm it need to have "just data" representation.
So don't make it "do things" that don't make sense in these contexts.
The key thing to remember is an object does nothing, when was the last time your chair executed its "sit" method on you?
It doesn't right, you execute your "sit" method on the chair, but you don't need to hold any kind of state to do that.
There is a series of states that are "sitting" and "not sitting" and data that can describe each.
