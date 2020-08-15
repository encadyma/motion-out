# Motion Out! CS184 Summer 2020 Final Project #18

![GIF of Michael Jackson dancing](https://encadyma.github.io/motion-out/screenshots/0813-mvp-mjackson.gif)

**Live Project URL**: [https://motionout.kevmo.xyz/](https://motionout.kevmo.xyz/)
**Presentation URL**: [Google Slides](https://docs.google.com/presentation/d/1Jf7SlY43Y-vfldFPQxG4iYvQUiBjpsAMhgJ1Bar_4Qc/edit#slide=id.gdbc0015146ccb8_4)

## Abstract

This project focuses on bringing motion data alive from CMU’s motion capture database onto a web platform using WebGL. Much of the challenge will come from translating the motion capture data (distributed in Acclaim's ASF/AMC formats) into useful movements for our skeleton and designing a system capable of rendering out these motions accurately and efficiently. With the goal of portability in mind, this project will also allow users to tweak the motion data and animate it on a given 3D character model.

On this website, I detail the technical approach I took and some of the pitfalls I encountered, as well as give visualizations of the project results and a vision for future iterations of this project.

## Table of Contents

Below is a guide of the website contents, with quick links for browsing convenience.

0. [Introduction](#)
1. [Abstract](#abstract)
2. [Technical Approach](#technical)
3. [Screenshots](#screenshots)
4. [References](#references)
5. [Credits](#credits)

## Technical Approach

### Deciding the Foundation

Portability was a big deciding factor in determining the frameworks and tools I used to write the editor. Platform specific libraries (Metal, DirectX, etc.) were out of the question. Especially in this generation of computing where native computing platforms become more fragmented (see ARM, RISC-V, Apple Silicon, Chromebooks, etc.), it's especially important to have more applications be more accessible with the less effort. One of the most portable formats of distribution is the Internet and web technologies. 

Surprisingly, 3D graphics are few and far in-between on the web even though there are powerful frameworks that can handle 3D. As a result, I saw it as a challenge to bring a powerful tool (motion capture) in an accessible manner and stretch the limits of 3D tooling on the web.

The foundation I decided to go with is a combination of THREE.js and Svelte, which ended up becoming incredibly powerful as it brings the benefits of a single-page application framework (components, reactivity, etc.) to a versatile 3D toolset. I was personally familiar with Svelte and SPA-likes before this project, but this was the first project where I used THREE.js extensively. Overall, I was incredibly happy with this setup and was impressed by how much I could build out.

The motion capture data itself was obtained through CMU's motion capture database [1]. The website provides an full export of the motion capture database in the data format I was interested in (ASF/AMC), totaling around 1.0GB. I imported some of the motion capture subjects that I liked into my project and got to work from there!

### Understanding the Skeleton
![Image of the skeleton parser, 08/09](https://notes.ocf.berkeley.edu/uploads/upload_eb45ae394062add76bcb3dee05d69203.png)

_Image of the skeleton parser on 08/09, with just the inspector and visual tokenizer._

![Image of the skeleton parser, 08/11](https://notes.ocf.berkeley.edu/uploads/upload_20ec7908f0969cbad352b5043de4aa7e.png)

_Image of the skeleton parser on 08/11, with the interpreted skeleton alongside the inspected skeleton definition file._

Before any work can be done with any motion capture data, there first needs to be a skeleton where that data can be applied. In the case of CMU's MoCap database, a skeleton is defined through an ASF file (**A**cclaim **S**keleton **F**ile), which is an ASCII text file format that defines the metadata of the skeleton, all bones and their degrees of freedom, and the hierarchy of the bone structure. One of the first tools for the editor I built was a visual tokenizer that helped distinguish the purpose of each line in the .ASF file.

```ruby
## Example ASF file created for parsing purposes.
# -----------------------------------------------
:version 1.10
:name Walk Skeleton Mini
:namespace mo_walk
:units
  mass 1.0
  length 0.45
  angle deg
:documentation
   .ast/.asf automatically generated from VICON data using
   VICON BodyBuilder and BodyLanguage model FoxedUp or BRILLIANT.MOD
:root
   order TX TY TZ RX RY RZ
   axis XYZ
   position 0 0 0  
   orientation 0 0 0 
:bonedata
  begin
     id 1 
     name lhipjoint
     direction 0.692024 -0.648617 0.316857 
     length 2.68184 
     axis 0 0 0  XYZ
  end
  begin
     id 30
     name rthumb
     direction -0.707107 -6.34961e-011 0.707107   
     length 0.718216   
     axis -90 -45 6.68868e-015   XYZ
    dof rx rz
    limits (-45.0 45.0)
           (-45.0 45.0)
  end
  ...
:hierarchy
  begin
    root rwrist
    rwrist rhand rthumb
    rhand rfingers
  end
```

_An example of an .ASF (Acclaim Skeleton File). Abridged for reading pleasure._

In the sample .ASF above, you can see that the first few parameters make up the metadata of the skeleton, while the `:bonedata` keyword marks the definition of all bones and `:hierarchy` marks the definition of the skeleton hierarchy. For each bone, there is a `dof` parameter that defines which parameters the motion capture data can act upon, with `RX`, `RY`, and `RZ` corresponding to Euler rotations. Reference [2] provides a further in-depth reading into how the .ASF file format works.

The parser was possible through a healthy dose of regular expression matching and a tokenizer that classifies each line into different categories (PROPERTY, STRING, WHITESPACE, KEYWORD, etc.). I was able to complete this using native Javascript, with each stage of the parsing process taking less than 10ms each (recorded using Javascript's console.time). This sums up to an average of 5ms-20ms parsing time when using real .ASF skeleton files consisting of 300-400 lines each.

With the skeleton data now processed, the data can now be passed to THREE.js, which will create a visual skeleton ("green stick figure") that can be added on to our scene. Half the battle!

### Getting the skeleton to move!
![GIF of Skeleton moving #1, 08/11](https://notes.ocf.berkeley.edu/uploads/upload_56118762c810edd2e9cb419ce44b7ee0.gif)

_GIF of the Skeleton doing a "Modern Dance" from one perspective, 08/11_

![GIF of Skeleton moving #2, 08/11](https://notes.ocf.berkeley.edu/uploads/upload_cced20add6c36d341f1c7a66fef1280a.gif)

_GIF of the Skeleton doing the same "Modern Dance" from another perspective, 08/11_

With the skeleton primed, we can start applying motion data to the skeleton. Similar to an .ASF, motion capture data is stored in an ASCII-based .AMC (**A**cclaim **M**otion **C**apture) file. Unlike the hierarchical .ASF, however, the .AMC is simpler as it lays out the keyframe data for each bone in a list.

```python
313            # FRAME NUMBER
root -2.48707 14.1873 -20.4302 3.13969 24.3752 7.47713
lowerback 16.6851 -0.00751085 -11.3876
upperback -0.683159 -2.29752 -0.37
thorax -9.75909 -0.515451 6.62149
lowerneck -0.13152 -9.71892 -10.1942
upperneck 5.99652 -13.3316 8.78051
head 3.07783 -6.64727 3.76996
rclavicle -5.1361e-014 4.37326e-015
...
```

_An example of some frame data in an .AMC. Each frame starts off with the frame number and a list of parameters._

Once again, another parser had to be written to interpret the data appropriately, this time using simpler regular expressions. Since the number of lines for each .AMC file is much higher than an .ASF (on the orders of 20-80k depending on the number of frames), the Javascript edition of the parser can take up to 100-300ms per process to complete, with much of the heavy burden on the tokenizer. This result is unsurprising because RegEx and string processing are relatively slow on Javascript.

As a side note, it might be surprising to hear that there is an incorrect way to construct a skeleton. In THREE.js, bones can positioned in two ways: recording position and rotation, or encoding the rotation of the bone into the positioning (setting the rotation to be 0). In testing the two methods, I've found that the latter method is incorrect. When applying rotations to a skeleton constructed using the latter method, you can yield some strange results. These results can be characterized as "zombie-like" or "vibing" by observers, but this type of behavior can be especially difficult to debug.

This can be especially confusing since the .ASF describes the direction of the bone as a unit vector, which one can mistakenly interpret as position data (position = scalar multiply the length with the unit vector). Instead, the correct implementation of the motion skeleton lies below:

```javascript
// Javascript pseudo-code. THREE.js code abstracted and simplified.
// Corresponds to asf.js:construct():464 (1d1ab77)
// Vector3(0, 0, 1) is used here since we want the position of each bone
// to simply consist of the length of the bone on the z-coordinate.
const rotation = Quaternion.eulerFromTwoVectors(Vector3(0, 0, 1), bone.direction);

// Later, we apply the Quaternion rotation onto the bone.
// THREE.js handles parented bones in local space, which is why
// we reverse the parent rotation and apply our global space rotation here.
bone.quaternion.multiply(bone.parent.rotation.inverse());
bone.quaternion.multiply(rotation);
```

While trying to wrap my head around this, I also accidentally discovered a small bug in one of the Quaternion methods in THREE.js, which I fixed up in a PR. [You can see that PR here!](https://github.com/mrdoob/three.js/pull/20042)

The last technical point I want to make on interpreting motion capture data is that there are two methods available for rendering the animation on the skeleton: the Javascript animation method and pre-rendering frames through THREE.js. The Javascript method (called "slow play" in the editor) uses the setInterval method to queue bone update calls per frame; the reason why this method is called "slow play" is because each frame can take more time than the next draw call to fully calculate and reposition all bones. If a frame happens to take up more time, it can potentially block other frames. The FPS counter, in terms of "slow play", acts more as a FPS limiter than it indicates playback speed.

To counter this, we can pre-calculate all the frames and rotations, then bake/render it into an animation timeline that can be interpolated over in case frames are skipped. THREE.js handles this part very nicely by providing animation timeline tools and providing linear interpolation between THREE.js frame updates, so the result ends up being a buttery smooth 60FPS.

### Placing some more skin in the game

![image alt](https://i.fluffy.cc/psWfjqv7TfbxrxDlzPqXmQ2zHpWQRQb6.gif)

_Viewing the bone structure of Inugami Korone in MikuMikuDance. Notice the increased complexity of the model compared to the motion capture skeleton._

The next biggest challenge was combining our skeleton + motion capture data with actual meshes. Most meshes come packaged pre-rigged with skeletons ready to go, which presented a new set of unique problems. After playing around with multiple different models and transforming their rotations and positions naively, here ware some of observations I made and headaches encountered:

- Bone translations can mean something different for different skeletons based on how it is constructed.
    - Important to get the rotations correct!
        - The character model skeleton does not necessarily match hierarchy on CMU skeleton.
- For MMD models, this bone translation has to be done from Japanese to English. Sometimes, an one-to-one equivalent might not exist.
    - The Korone MMD model has only one neck bone, while the CMU skeleton calls for two (upperneck, lowerneck).
- Even for similar skeletons, there are naive implementations that obviously do not work.
    - Replacing the character's skeleton entirely with the CMU skeleton will result in a dismangled body.
    - Trying to set position and rotation data from the original CMU skeleton to the corresponding bone will also result in a similar, but less intense dismangled mess.
    - Applying rotations only for all bones except for the root bone leads to characters just "vibing".

Below is a couple of screenshots of how motion data can look when applied incorrectly:

![Applying Position + Rotation Data](https://encadyma.github.io/motion-out/screenshots/0811-mvpa-brokenmel.gif)

_Applying Position + Rotation data to each bone on Yozora Mel._

![Applying Rotation Only](https://encadyma.github.io/motion-out/screenshots/0811-mvpa-badkorone.gif)

_Applying Rotation data only to each bone on Inugami Korone._

Because a naive implementation of bone matching wouldn't suffice, a composite solution had to be implemented. There is still one-to-one bone matching, but each character bone can have a set of transformations applied beforehand, such as a new position + additional rotation, to match with the regular skeleton. In an ideal solution, this would be applied automatically through a correctional algorithm that can adjust the character skeleton to be similar to the CMU skeleton. The next best option was to do this through manual correction, which is what the current editor supplies. Through manual corrections by eye, the model can get close to the actual skeleton!

![Pretty Close](https://encadyma.github.io/motion-out/screenshots/0813-mvp-mocapman-a1.gif)

_Rotation Only on the Motion Capture Man (Mixamo.com) with manual corrections applied to the legs._

In future iterations of the project, I hope to flesh this part of the project out more!

### Quality-of-life enhancements

This project also features a host of quality-of-life enhancements that make the editor experience more pleasant. Below is a short list of some of my favorites:

#### Skeleton Tree Browser
- Tree-based browser for skeletons (both for motion capture data and character mesh)
    - selecting a bone will bring up the properties for the bone at that frame
    - very similar to a tree-based browser you will find in a 3D editing application like Maya or Blender

#### Editing Tools
- Editing tools allow you to modify and debug skeletons + character meshes.
    - Changing playback speed of the animation (playback FPS).
        - Frame by frame analysis possible through the timeline.
    - Can live edit parameters in the bone menu
        - Possible to debug the skeleton without having to use the app itself.
    - Includes tools to assign bones and correctional transformations to MMD/character meshes.

#### Scene Tools
- Change the scene of the main viewer
    - Import .glb, .gltf, .dae (COLLADA) files and set it as the scene.
    - Even includes references to CS184 content, such as the bunny and dragon scenes in a Cornell Box.
    - Bonus feature: you can set the camera to automatically rotate around the scene!

#### File Format Extensions
- Added new keyword (:namespace) to prevent scenarios where an animation file could be played with an incompatible skeleton. No hard restrictions in the final version.

#### Asset Bundling
- All the assets (ASF/AMC/MMD/etc.) can be dropped into the asset folder!
    - The process has just been dropping in files from their respective sources and updating the app to let it know where the file is on the internet.
    - Assets are likewise exposed through /assets/ folder.
- App does an HTTP request to fetch the appropriate files. Can fetch from websites outside of Motion Out's domain (for example, directly from CMU's MoCap database).
- `constants.js` defines the locations of each asset -- data-based, not hard-coded files!

#### Rotating Default Cube
- Sorry, couldn't bring myself to delete it.

### Future Plans
- Improving processing speed by doing it through WebAssembly (to make it go even faster!).
- Adding support for more motion capture formats (.fbx)
- Abstracting away the parser and making it an official loader for THREE.js
- Other portability plans, such as making it a chatbot GIF service, making a video editor from it, etc.

## Other Screenshots
All of the historical screenshots that I've taken, including GIFs, can be found [in the Github repository here](https://github.com/encadyma/motion-out/tree/master/docs/screenshots).

![Cover image with mocap skeleton alongside real skeleton](https://encadyma.github.io/motion-out/screenshots/0813-mvp-mocapman-a1.gif)

_Cover image with mocap skeleton alongside real skeleton_

![GIF of Martial Arts Walking on Dragon](https://encadyma.github.io/motion-out/screenshots/0813-mvpa-dragon.gif)

_GIF of Martial Arts Walking on Dragon_

![GIF of tooling on the browser](https://i.fluffy.cc/F4sr5xmMchRXh5dx0P0v6lrJG0BqQwdt.gif)

_GIF of tooling on the browser_

## References
[1] CMU Motion Capture Database (http://mocap.cs.cmu.edu)
[2] Article on file parsing help for AMC/ASF (https://research.cs.wisc.edu/graphics/Courses/cs-838-1999/Jeff/ASF-AMC.html)

## Credits
- Kevin Mo (creator of the tool you see here)
- CMU for providing the Motion Capture Database (http://mocap.cs.cmu.edu). The database was created with funding from NSF EIA-0196217.
- Mixamo.com, Hololive/Cover Corp., CS184 Course Staff for providing models