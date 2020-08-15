
# Motion Out! CS184 Summer 2020 Final Project #18

![GIF of Michael Jackson dancing](https://encadyma.github.io/motion-out/screenshots/0813-mvp-mjackson.gif)

**Live Project URL**: [https://motionout.kevmo.xyz/](https://motionout.kevmo.xyz/)
**Presentation URL**: [Google Slides](https://docs.google.com/presentation/d/1Jf7SlY43Y-vfldFPQxG4iYvQUiBjpsAMhgJ1Bar_4Qc/edit#slide=id.gdbc0015146ccb8_4)

## Abstract

This project focuses on bringing motion data alive from CMU’s motion capture database onto a web platform using WebGL. Much of the challenge will come from translating the motion capture data (distributed in Acclaim's ASF/AMC formats) into useful movements for our skeleton and designing a system capable of rendering out these motions accurately and efficiently. With the goal of portability in mind, this project will also allow users to tweak the motion data and animate it on a given 3D character model.

On this website, I detail the technical approach I took and some of the pitfalls I encountered, as well as give visualizations of the project results and a vision for future iterations of this project.

## Installation

Install the dependencies...

```bash
cd motion-out
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).

## Future Plans
- Improving processing speed by doing it through WebAssembly (to make it go even faster!).
- Adding support for more motion capture formats (.fbx)
- Abstracting away the parser and making it an official loader for THREE.js
- Other portability plans, such as making it a chatbot GIF service, making a video editor from it, etc.

## Screenshots
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
