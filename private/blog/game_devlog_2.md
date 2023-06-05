# Game Devlog #2

#### Feb. 07, 2021 | Gavin Rossiter

Wow the 2nd devlog, honestly didn't think I would make it this far!

This week I really wanted to work towards creating a nice environment to sandbox ideas in.
Following on from the basic terrain I made last week, the next step for my little world was a stylized facelift.
I am a really big fan on the simple flat toon shading in modern video games.
I think the best examples of this style are [The Legend of Zelda: Breath of the Wild](https://www.youtube.com/watch?v=1rPxiXXxftE&ab_channel=Nintendo),
[Genshin Impact](https://www.youtube.com/watch?v=SY3XGzDousM&ab_channel=GenshinImpact) and to some degree [Overwatch](https://www.youtube.com/watch?v=dushZybUYnM&ab_channel=PlayOverwatch), although I'm inspired by lots of games with similar art styles.

An indie developer [Codeer](https://twitter.com/CodeerDev) shares a lot of the stylistic ideas I have for my game, you can check out some videos of their work [here](https://twitter.com/CodeerDev/status/1349000650529648648/video/1).
I reached out to Codeer to express my admiration for their work and shamlessly beg for a tutorial. They were kind enough to respond saying that created their shaders using the Amplify Shader Editor plugin for Unity and quote "I'll see what I can do in terms of a tutorial!".
I hope they follow through with the tutorial because the Unity community really loves this art style and Codeer has just nailed it.

Anyway, taking Codeer's work as inspiration and my unrelenting "do it the easist way possible" attitude I jumped on the Unity asset store, avoided the $80USD Amplify and instead grabbed [this amazing stylized grass shader](https://assetstore.unity.com/packages/vfx/shaders/stylized-grass-shader-143830) by [Staggart Creations](http://staggart.xyz/) for $25USD (about 40 dollarydoos).  This asset is truly great value, it's well documented, well structured and the creator has published several other assets in the same style. 
Checkout what I was able to do with it!

<Video url="https://youtu.be/1HaE_P6yogk" />

Unfortunately this wasn't completely pain free. 
First, because I'm using Map Magic 2 to place my grass and under the hood it uses Unity's fairly rubbish terrain system I had to figure out a solution to replace Unity's built in grass shaders with the new shader.  For whatever reason [(spoiler there is none)](https://forum.unity.com/threads/2019-2-overriding-shaders-of-terrain-grass.725294/), this is not easy.  My current workaround is to use a free trial of another asset [Nature Renderer](https://assetstore.unity.com/packages/tools/terrain/nature-renderer-personal-license-153552) as a complete replacement for the terrain renderer.  Eventually I'll need to find a better solution or purchase the (also) $80USD asset, just not right now at devlog 2.
Finally, to really sell the style I tweaked the lighting as described in this excellent [tutorial](https://www.youtube.com/watch?v=Jhd_RO7OjK0&t=94s&ab_channel=ProbablySpoonie) by Probably Spoonie, another "straight to the point, no bullshit, no time wasting" devlogger.

Aaaand thats about it for this week, I spent all of Saturday working on my website/resume so time for me to kick back and relax before the start of another week, and oh s#it.. its quarter to 11.

Peace!