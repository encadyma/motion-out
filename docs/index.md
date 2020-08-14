# Motion Out! CS184 Summer 2020 Final Project #18

(cover images here)
### NOTE TO VIEWERS: This version of the project report website is not final!! There will be a future Github commit that will accomodate for the full website along with a Project Video. This is mostly an early planning doc. Sorry for the inconvenience!
**Live Project URL**: https://motionout.kevmo.xyz/

## Abstract

- make a prettier version of the proposal paragraph

This project focuses on bringing motion data alive from CMU’s motion capture database onto a web platform (WebGL/HTML5 Canvas). Much of the challenge will come from translating the motion capture data (distributed in ASF/AMC/C3D) into useful movements for our skeleton and designing a system capable of rendering out these motions accurately and efficiently. With the goal of portability in mind, this project will also allow users to tweak the motion data and animate it on a given 3D character model.

## Technical Approach

### Deciding the Foundation
- Why the web?
    - increasingly important to have more applications on the web as native computing platforms become fragmented (see ARM, ex. Chromebooks, locked-down devices, etc.)
    - 3D graphics not represented enough on the web
        - Bring a powerful tool to the internet and stretch the limits...
    - personal familiarity
- Why Svelte/three.js
    - reactivity comes from Svelte, personal familiarity, easy to make good interfaces without pulling hair out
    - three.js has much of the toolkit for starting with skeletons, bones, other 3D structures without having to
    - first time using three.js in a project

### Understanding the Skeleton
![Image of the skeleton parser, 08/09](https://notes.ocf.berkeley.edu/uploads/upload_eb45ae394062add76bcb3dee05d69203.png)
![Image of the skeleton parser, 08/11](https://notes.ocf.berkeley.edu/uploads/upload_20ec7908f0969cbad352b5043de4aa7e.png)

- How does the ASF format work?
    - Bring in an example from the format
    - Both .ASF and .AMC formats are ASCII text formats
        - ASF split into multiple sections
        - AMC split into each frame
    - Multiple metadata parameters
    - Involved a lot of regex matching!
    - :bonedata defines all the bones in the skeleton
    - :hierarchy defines the way the bones connect up
    - Also defines the degrees of freedom each bone has
    - Parameters were given in degrees, in Euler angles
- Built a tokenizer and parser for the .ASF file format
    - fast enough to do through native JS
    - builds a THREE.js skeleton structure
- Processor 

### Getting the skeleton to move!
![GIF of Skeleton moving #1, 08/11](https://notes.ocf.berkeley.edu/uploads/upload_56118762c810edd2e9cb419ce44b7ee0.gif)
![GIF of Skeleton moving #2, 08/11](https://notes.ocf.berkeley.edu/uploads/upload_cced20add6c36d341f1c7a66fef1280a.gif)

- How does the AMC format work?
    - show frame example
- How well does this translate to three.js skeleton/bone structure?
- some weird bugs that you came across
    - show some weird rotations with GIF screenshots
    - involved getting a typo fix in PR in THREE.js after hours of debugging (https://github.com/mrdoob/three.js/pull/20042)
- How does the current rotation system happen?
- slow Javascript animation method vs baking frames THREE.js method
    - why Javascript setInterval does not play ideally
    - we pre-calculate all the frames and rotations, then bake/render it into an animation timeline

### Placing some more skin in the game (TODO)

- not done... this is the Korone part
- translating bones from Japanese to CMU's English bones
    - body parts on Korone don't necessarily match hierarchy on CMU skeleton
- what about a custom Skeleton?

### Quality-of-life enhancements
- include short description on this

#### Skeleton Tree Browser
- tree-based browser for skeletons
    - selecting a bone will bring up the properties for the bone at that frame
    - very similar to a tree-based browser you will find in a 3D editing application like Maya or Blender

#### Editing Tools (TODO)
- editing tools
    - changing playback speed (playback FPS)
    - analyzing frame by frame
    - editing parameters in the bone menu (?)

#### Scene Tools (TODO)
- scene tools
    - make some simple scenes in Blender to vary up the viewport
    - should include references to CS184 project
    - examples:
        - the raytracer scene with the spheres and bunny

#### File Format Extensions
- Added new keyword (:namespace) to prevent scenarios where an animation file could be played with an incompatible skeleton

#### Asset Bundling
- all the assets can be dropped into the asset folder
    - the process has just been dropping in files from their respective sources, updating the app to let it know where the file is on the internet
    - assets are likewise exposed through /assets/ folder
- app does an HTTP request to fetch the appropriate files
- constants.js defines the locations of each asset -- data-based, not hard-coded files!

#### Rotating Default Cube
- sorry, couldn't bring myself to delete it.

### Future Plans
- Improving processing speed by doing it through WebAssembly (to make it go even faster!).
- Adding support for more motion capture formats (.fbx)
- Abstracting away the parser and making it an official loader for THREE.js

## Screenshots
- include captions with each image
- GIFs of part 1
- GIFs of part 2
- GIFs of part 3
- GIFs of part 4

## References
- CMU Motion Capture Database (http://mocap.cs.cmu.edu)
    - Article on file parsing help for AMC/ASF (https://research.cs.wisc.edu/graphics/Courses/cs-838-1999/Jeff/ASF-AMC.html)
- three.js
- Thank you to all the previous examples of AMC/ASF viewers for providing a project reference
    - Some listed on CMU's website

## Credits
- Kevin Mo (creator of the tool you see here)
- CMU for providing the Motion Capture Database (http://mocap.cs.cmu.edu). The database was created with funding from NSF EIA-0196217.
- Mixamo, Hololive/Cover Corp., CS184 Course Staff for providing models