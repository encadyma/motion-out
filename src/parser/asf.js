/**
 * ASF Parser by Kevin Mo (@encadyma).
 */

import { toRadians } from './constants';
import * as THREE from 'three';

export class ASFParser {
    TOKEN_KEYWORD_RGX = /^:(\w+)(?:\s+([\w\d\s\.]+))?/;
    TOKEN_COMMENT_RGX = /^#(.+)/;
    TOKEN_BEGIN_RGX = /^begin$/;
    TOKEN_END_RGX = /^end$/;
    TOKEN_WHITESPACE_RGX = /^\s*$/;
    TOKEN_TUPLE_RGX = /(\w+\s)?\(((?:\s?[\d\.e\-]+)+)\)/;

    tokens = [];
    errors = [];

    loaded = false;

    metadata = {
        version: null,
        name: "Not Loaded",
        namespace: null,
        units: {
            mass: 1.0,
            length: 1,
            angle: "deg"
        },
        documentation: null
    };

    root = {
        id: "0",
        name: "root",
        order: [],
        axis: [],
        position: [],
        orientation: [],
        lastRotation: new THREE.Quaternion(),
        quatRotation: new THREE.Quaternion()
    };

    bones = {};
    tree = {};

    three = {
        enabled: false,
        bones: {},
        skeleton: null,
        container: null,
        mesh: null,
        helper: null,
    };

    editor = {
        openedBones: {
            "root": false,
        },
        currBone: "root",
        isBaking: false,
    };

    baked = {
        status: false,
        tracks: [],
        name: null,
        fps: 120,
        clip: null,
        mixer: null,
        action: null,
    }

    /**
     * Tokenizes a given ASF file for the parser,
     * given in raw ASCII format.
     * @param {String} raw_file or a string from an ASF file
     * @returns {Array} processed tokens
     */
    tokenize(raw_file) {
        const lines = raw_file.split('\n');
        let index = 0;
        this.tokens = [];

        let currentKey;

        while (index < lines.length) {
            const line = lines[index].trim();
            if (this.TOKEN_KEYWORD_RGX.test(line)) {
                // KEYWORDS - :keyword
                const matches = line.match(this.TOKEN_KEYWORD_RGX);
                currentKey = matches[1];
                this.tokens.push({ type: 'KEYWORD', words: (!matches[2] ? [matches[1]] : matches.slice(1)) });

                if (currentKey == "documentation") {
                    // Interpret all as string until next keyword.
                    index++;
                    while (index < lines.length && !this.TOKEN_KEYWORD_RGX.test(lines[index].trim())) {
                        this.tokens.push({ type: 'STRING', words: [lines[index].trim()] });
                        index++;
                    }
                    continue;
                } else if (currentKey == "root" || currentKey == "units") {
                    // Interpret all as properties until next keyword.
                    index++;
                    while (index < lines.length && !this.TOKEN_KEYWORD_RGX.test(lines[index].trim())) {
                        this.tokens.push({ type: 'PROPERTY', words: lines[index].trim().split(/,?\s+/) });
                        index++;
                    }
                    continue;
                }
            }
            else if (this.TOKEN_COMMENT_RGX.test(line)) {
                // COMMENTS - # comment
                this.tokens.push({ type: 'COMMENT', words: line.match(this.TOKEN_COMMENT_RGX).slice(1) });
            }
            else if (this.TOKEN_BEGIN_RGX.test(line)) {
                // BEGIN TOKEN - begin
                this.tokens.push({ type: 'BEGIN', words: ['begin'] });

                // Begin reading until the end!
                index ++;
                while (index < lines.length && !this.TOKEN_END_RGX.test(lines[index].trim())) {
                    if (currentKey == "hierarchy") {
                        // Interpret as relations.
                        this.tokens.push({ type: 'RELATION', words: lines[index].trim().split(/,?\s+/) });
                    } else if (currentKey != "documentation"){
                        // Interpret as properties.
                        const props = lines[index].trim().split(/,?\s+/);
                        if (props[0] == 'limits' && this.TOKEN_TUPLE_RGX.test(lines[index].trim())) {
                            // Start consuming tuples
                            let tuples = [];

                            while (index < lines.length && this.TOKEN_TUPLE_RGX.test(lines[index].trim())
                                && !this.TOKEN_END_RGX.test(lines[index].trim())) {
                                tuples.push(lines[index].trim().match(this.TOKEN_TUPLE_RGX)[2]);
                                index++;
                            }

                            this.tokens.push({ type: 'PROPERTY', words: ['limits', tuples] });
                            continue;
                        } else {
                            this.tokens.push({ type: 'PROPERTY', words: lines[index].trim().split(/,?\s+/) });
                        }
                    }
                    index++;
                }
                continue;
            }
            else if (this.TOKEN_END_RGX.test(line)) {
                // END TOKEN - end
                this.tokens.push({ type: 'END', words: ['end'] });
            }
            else if (this.TOKEN_WHITESPACE_RGX.test(line)) {
                // WHITESPACE TOKEN -
                this.tokens.push({ type: 'WHITESPACE', words: [] });
            }
            else {
                // Unknown tokens are parsed as strings
                this.tokens.push({ type: 'STRING', words: [line] });
            }
            index++;
        }

        return this.tokens;
    }

    /**
     * Processes the current set of tokens.
     */
    process() {
        let index = 0;
        let currentKey;

        while (index < this.tokens.length) {
            const token = this.tokens[index];

            if (token.type == "KEYWORD") {
                currentKey = token.words[0];
                switch (currentKey) {
                    case "name":
                        this.metadata.name = token.words[1];
                        break;
                    case "version":
                        this.metadata.version = token.words[1];
                        break;
                    case "namespace":
                        this.metadata.namespace = token.words[1];
                        break;
                    case "root":
                    case "documentation":
                    case "units":
                    case "bonedata":
                    case "hierarchy":
                        break;
                    default:
                        console.error("warning! cannot process keyword " + JSON.stringify(token));
                        this.errors.push("Cannot process keyword " + JSON.stringify(token) + " on index " + index + ".");
                        break;
                }
            } else if (token.type == "WHITESPACE" || token.type == "COMMENT") {
                // Ignore them!
            } else if (currentKey == "documentation" && token.type == "STRING") {
                // Documentation stuff!
                if (!this.metadata.documentation) {
                    this.metadata.documentation = token.words[0];
                } else {
                    this.metadata.documentation += " " + token.words[0];
                }
            } else if (currentKey == "units" && token.type == "PROPERTY") {
                switch (token.words[0]) {
                    case "mass":
                        if (parseFloat(token.words[1]) == NaN) {
                            console.error("error! argument @ " + JSON.stringify(token) + " not a float!");
                            this.errors.push("Argument to property `mass` @ " + JSON.stringify(token) + " on index " + index + " not a float.");
                        } else {
                            this.metadata.units.mass = parseFloat(token.words[1]);
                        }
                        break;
                    case "length":
                        if (parseFloat(token.words[1]) == NaN) {
                            console.error("error! argument @ " + JSON.stringify(token) + " not a float!");
                            this.errors.push("Argument to property `length` @ " + JSON.stringify(token) + " on index " + index + " not a float.");
                        } else {
                            this.metadata.units.length = parseFloat(token.words[1]);
                        }
                        break;
                    case "angle":
                        this.metadata.units.angle = token.words[1];
                        break;
                    default:
                        console.error("warning! cannot process keyword " + JSON.stringify(token));
                        this.errors.push("Cannot process keyword " + JSON.stringify(token) + " on index " + index + ".");
                        break;
                }
            } else if (currentKey == "root") {
                // Enter into a read loop for root data.
                while (index < this.tokens.length && this.tokens[index].type != "KEYWORD") {
                    if (this.tokens[index].type == "PROPERTY") {
                        const prop = this.tokens[index];
                        switch (this.tokens[index].words[0]) {
                            case "order":
                                this.root.order = this.tokens[index].words.slice(1).map(s => s.toUpperCase());
                                break;
                            case "axis":
                                this.root.axis = prop.words[1].split("");
                                break;
                            case "position":
                                this.root.position = prop.words.slice(1).map(parseFloat);
                                break;
                            case "orientation":
                                this.root.orientation = prop.words.slice(1).map(parseFloat);
                                break;
                            default:
                                console.error("[2] warning! in rootdata loop, cannot process property " + JSON.stringify(this.tokens[index]));
                                this.errors.push("Unexpected property " + JSON.stringify(this.tokens[index]) + " on index " + index + " in root data read.");
                        }
                    } else {
                        console.error("[1] warning! in rootdata loop, cannot process keyword " + JSON.stringify(this.tokens[index]));
                        this.errors.push("Unexpected token " + JSON.stringify(this.tokens[index]) + " on index " + index + " in root data read.");
                    }
                    index++;
                }
                continue;
            } else if (currentKey == "hierarchy") {
                // Enter into a read loop for hierarchy data.
                while (index < this.tokens.length && this.tokens[index].type != "KEYWORD") {
                    const SKIP_TYPES = ["BEGIN", "END", "WHITESPACE", "COMMENT"];
                    if (this.tokens[index].type == "RELATION") {
                        const rel = this.tokens[index].words;
                        // We start searching the tree for the given keyword.
                        if (rel[0] == "root") {
                            // Inject children into the tree
                            for (const child_name of rel.slice(1)) {
                                this.tree[child_name] = null;
                            }
                        } else {
                            // Traverse into the tree until we find the child.
                            // If not, post an error.
                            function traverse(tree) {
                                if (!tree || Object.keys(tree).length == 0) {
                                    return false;
                                }
                                
                                for (const child in tree) {
                                    if (child == rel[0]) {
                                        tree[child] = {};
                                        for (const future of rel.slice(1)) {
                                            tree[child][future] = null;
                                        }
                                        return true;
                                    } else if (traverse(tree[child])) {
                                        return true;
                                    }
                                }
                            }

                            if (!traverse(this.tree)) {
                                console.error("[2] warning! in hieradata loop, cannot find location for relation " + JSON.stringify(this.tokens[index]));
                                this.errors.push("Confused relation " + JSON.stringify(this.tokens[index]) + " on index " + index + " in hierarchy data read.");
                            }
                        }
                    } else if (!SKIP_TYPES.includes(this.tokens[index].type)) {
                        // Become lazy and just skip interpretation of begin/end.
                        console.error("[1] warning! in hieradata loop, cannot process keyword " + JSON.stringify(this.tokens[index]));
                        this.errors.push("Unexpected token " + JSON.stringify(this.tokens[index]) + " on index " + index + " in hierarchy data read.");
                    }
                    index++;
                }
                console.log(this.tree);
                continue;
            } else if (currentKey == "bonedata") {
                // Enter into a read loop collecting bone data.
                while (index < this.tokens.length && this.tokens[index].type != "KEYWORD") {
                    if (this.tokens[index].type == "WHITESPACE" || this.tokens[index].type == "COMMENT") {
                        // Ignore these again.
                    } else if (this.tokens[index].type == "BEGIN") {
                        // Start reading bone properties.
                        let nextBone = {
                            id: null,
                            name: null,
                            direction: [],
                            length: 0,
                            axis: [],
                            axis_order: [],
                            dof: [],
                            limits: []
                        };
                        index++;

                        while (index < this.tokens.length 
                            && this.tokens[index].type != "END"
                            && this.tokens[index].type != "KEYWORD") {
                            // Read all the properties of each bone, placing
                            // them into the bone data structure.
                            const prop = this.tokens[index];
                            if (prop.type == "PROPERTY") {
                                switch(prop.words[0]) {
                                    case "id":
                                        nextBone.id = prop.words[1];
                                        break;
                                    case "name":
                                        nextBone.name = prop.words[1];
                                        break;
                                    case "direction":
                                        nextBone.direction = prop.words.slice(1).map(parseFloat);
                                        break;
                                    case "length":
                                        nextBone.length = parseFloat(prop.words[1]);
                                        break;
                                    case "axis":
                                        nextBone.axis = prop.words.slice(1, -1).map(parseFloat);
                                        nextBone.axis_order = prop.words[prop.words.length - 1].split("");
                                        break;
                                    case "dof":
                                        nextBone.dof = prop.words.slice(1).map(s => s.toUpperCase());
                                        break;
                                    case "limits":
                                        // Split each constraint argument into two, then parse.
                                        nextBone.limits = prop.words[1].map(l => l.split(/,?\s+/).map(parseFloat));
                                        break;
                                    default:
                                        console.error("[3] warning! in bonedata loop, cannot process token " + JSON.stringify(this.tokens[index]));
                                        this.errors.push("Unexpected property token " + JSON.stringify(this.tokens[index]) + " on index " + index + " in bone data read.");
                                }
                            } else {
                                console.error("[2] warning! in bonedata loop, cannot process token " + JSON.stringify(this.tokens[index]));
                                this.errors.push("Unexpected non-property token " + JSON.stringify(this.tokens[index]) + " on index " + index + " in bone data read.");
                            }
                            
                            index++;
                        }

                        this.bones[nextBone.name] = nextBone;

                        // Add the bone to the editor
                        this.editor.openedBones[nextBone.name] = false;

                        if (this.tokens[index].type != "KEYWORD") {
                            // If forced out by next keyword, we break out of the bonedata read loop.
                            // Technically, this is incorrect syntax as there should
                            // be a closing "end" tag for each bone.
                            break;
                        }
                    } else {
                        console.error("[1] warning! in bonedata loop, cannot process token " + JSON.stringify(this.tokens[index]));
                        this.errors.push("Unexpected token " + JSON.stringify(this.tokens[index]) + " on index " + index + " in bone data read.");
                    }
                    index++;
                }
            } else {
                console.error("warning! cannot process token " + JSON.stringify(this.tokens[index]));
                this.errors.push("Cannot process token " + JSON.stringify(this.tokens[index]) + " on index " + index + ".");
            }

            index++;
        }

        this.loaded = true;
    }

    /**
     * Constructs the three.js skeleton.
     */
    construct() {
        // Setup the root node.
        this.three.bones = {};

        const root = new THREE.Bone();
        root.name = this.root.name;
        root.position.x = this.root.position[0];
        root.position.y = this.root.position[1];
        root.position.z = this.root.position[2];

        root.setRotationFromEuler(new THREE.Euler(
            ...this.root.orientation.map(toRadians),
            this.root.axis.join('')
        ));

        this.three.bones[this.root.name] = root;

        function traverse(tree, parent, newPos, lastRotation, g) {
            // Traverse through the root node.
            if (tree == null) {
                return;
            }

            for (const child in tree) {
                const bone = new THREE.Bone();
                bone.name = child;

                // Store the parent rotation somewhere.
                lastRotation = lastRotation || new THREE.Quaternion();

                // Setup the position based on
                // direction and length of the bone.
                const direction = (new THREE.Vector3(...g.bones[child].direction)).normalize();
                const rotation = (new THREE.Quaternion()).setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
                const position = newPos || new THREE.Vector3();

                bone.position.x = position.x;
                bone.position.y = position.y;
                bone.position.z = position.z;

                bone.quaternion.multiply(lastRotation.clone().inverse());
                bone.quaternion.multiply(rotation);

                // Create the relation.
                parent.add(bone);
                g.three.bones[child] = bone;
                g.bones[child].quatRotation = rotation.clone();
                g.bones[child].lastRotation = lastRotation.clone();

                // Then we add more...
                traverse(tree[child], bone, new THREE.Vector3(0, 0, g.bones[child].length), rotation, g);
            }
        }

        traverse(this.tree, root, new THREE.Vector3(), new THREE.Quaternion(), this);

        // Create the skeleton from bones.
        this.three.skeleton = new THREE.Skeleton(Object.values(this.three.bones));

        this.three.helper = new THREE.SkeletonHelper(root);
        this.three.helper.skeleton = this.three.skeleton;

        this.three.container = new THREE.Group();
        this.three.container.add(root);

        this.three.enabled = true;
        return this.three.skeleton;
    }

    /**
     * Imposes a keyframe on the current bones
     * based on incoming KEYDATA.
     */
    frameUpdate(keydata, updateBones = true) {
        let result = {};

        if (updateBones) {
            this.three.bones[this.root.name].updateMatrixWorld();
        }
        
        for (const boneName in keydata) {
            if (!Object.keys(this.three.bones).includes(boneName)) {
                this.errors.push(`Unknown bone name ${boneName} in key data found.`);
                console.warn(`Unknown bone name ${boneName} in key data found.`);
                continue;
            }

            if (boneName == this.root.name) {
                // Update root parameters.
                if (this.root.order.length != keydata[boneName].length) {
                    // Incorrect # of parameters.
                    this.errors.push(`Incorrect number of motion parameters for root node, ${keydata[boneName].length} provided.`);
                    console.error(`incorrect number of motion parameters for root node, ${keydata[boneName].length} provided.`);
                    continue;
                }
            }

            const order = boneName == this.root.name ? this.root.order : this.bones[boneName].dof;
            const axis_order = boneName == this.root.name ? this.root.axis.join('') : this.bones[boneName].axis_order.join('');
            const axis_values = boneName == this.root.name ? this.root.orientation : this.bones[boneName].axis;

            let axisEuler = new THREE.Euler(toRadians(axis_values[0]), toRadians(axis_values[1]), toRadians(axis_values[2]), axis_order);
            const axis = new THREE.Quaternion();
            // NOTE: .setFromEuler does not operate properly, submitted new
            // PR to get this fixed...
            this.setFromEuler(axis, axisEuler);
            // axis.setFromEuler(axisEuler);
            const inverseAxis = axis.clone().conjugate();

            const position = (new THREE.Vector3()).copy(this.three.bones[boneName].position);
            
            const rotation = this.three.bones[boneName].rotation.clone();
            const transform = new THREE.Matrix4();

            for (let i = 0; i < order.length; i++) {
                // Iterate over each parameter according to the labels.
                // TODO: switch these to constants
                const m = new THREE.Matrix4();

                switch(order[i]) {
                    case "TX":
                        position.x = keydata[boneName][i];
                        transform.multiplyMatrices(
                            m.makeTranslation(keydata[boneName][i], 0, 0),
                            transform
                        );
                        break;
                    case "TY":
                        position.y = keydata[boneName][i];
                        transform.multiplyMatrices(
                            m.makeTranslation(0, keydata[boneName][i], 0),
                            transform
                        );
                        break;
                    case "TZ":
                        position.z = keydata[boneName][i];
                        transform.multiplyMatrices(
                            m.makeTranslation(0, 0, keydata[boneName][i]),
                            transform
                        );
                        break;
                    case "RX":
                        rotation.x = toRadians(keydata[boneName][i]);
                        transform.multiplyMatrices(
                            m.makeRotationX(toRadians(keydata[boneName][i])),
                            transform
                        );
                        break;
                    case "RY":
                        rotation.y = toRadians(keydata[boneName][i]);
                        transform.multiplyMatrices(
                            m.makeRotationY(toRadians(keydata[boneName][i])),
                            transform
                        );
                        break;
                    case "RZ":
                        rotation.z = toRadians(keydata[boneName][i]);
                        transform.multiplyMatrices(
                            m.makeRotationZ(toRadians(keydata[boneName][i])),
                            transform
                        );
                        break;
                    default:
                        this.errors.push(`Unknown motion channel ${order[i]} provided.`);
                        console.error(`unknown motion channel ${order[i]} provided`);
                }
            }

            let newPos = new THREE.Vector3(),
                newQuaternion = new THREE.Quaternion(),
                newScale = new THREE.Vector3();
            
            transform.decompose(newPos, newQuaternion, newScale);

            if (updateBones) {
                this.three.bones[boneName].position.copy(position);
            }

            // Process the final rotation!
            
            const prefinalRotation = (new THREE.Quaternion())
                .multiply(axis)
                .multiply(newQuaternion)
                .multiply(inverseAxis);
            
            const finalRotation = (new THREE.Quaternion())
                .multiply((boneName == this.root.name ? this.root : this.bones[boneName]).lastRotation.clone().inverse())
                .multiply(prefinalRotation)
                .multiply((boneName == this.root.name ? this.root : this.bones[boneName]).quatRotation.clone());

            if (updateBones) {
                this.three.bones[boneName].quaternion.copy(finalRotation);
            }

            // Push this to results.
            result[boneName] = {
                uuid: this.three.bones[boneName].uuid,
                quaternion: finalRotation,
                position: position,
            };
        }

        if (updateBones) {
            this.three.bones[this.root.name].updateMatrixWorld();
            this.three.skeleton.update();
        }
        
        return result;
    }

    bake(amcFrames, amcName) {
        const TIME_PER_FRAME = 1.0 / this.baked.fps;
        this.baked.tracks = [];

        let animationTracks = {};
        if (amcFrames.length <= 0) {
            console.error("There are no frames given.")
            return;
        }

        for (const bone in amcFrames[0]) {
            animationTracks[bone] = {
                uuid: this.three.bones[bone].uuid,
                times: [],
                position: [],
                quaternion: [],
            };
        }

        for (let f = 0; f < amcFrames.length; f++) {
            const frame = this.frameUpdate(amcFrames[f], false);
            for (const bone in frame) {
                animationTracks[bone].times.push(f * TIME_PER_FRAME);

                // Due to the way KeyframeTracks store values in a Float32Array,
                // each value must be unpacked.
                animationTracks[bone].position.push(...frame[bone].position.toArray());
                animationTracks[bone].quaternion.push(...frame[bone].quaternion.toArray());
            }
        }

        // Generate a track per bone in animation tracks.
        for (const bone in animationTracks) {
            this.baked.tracks.push(
                new THREE.QuaternionKeyframeTrack(
                    // animationTracks[bone].uuid + '.quaternion',
                    `.bones[${bone}].quaternion`,
                    animationTracks[bone].times,
                    animationTracks[bone].quaternion
                )
            );
            this.baked.tracks.push(
                new THREE.VectorKeyframeTrack(
                    // animationTracks[bone].uuid + '.position',
                    `.bones[${bone}].position`,
                    animationTracks[bone].times,
                    animationTracks[bone].position
                )
            );
        }

        this.baked.clip = new THREE.AnimationClip(amcName, TIME_PER_FRAME * amcFrames.length, this.baked.tracks);

        this.baked.name = amcName;
        this.baked.mixer = new THREE.AnimationMixer(this.three.helper);
        this.baked.action = this.baked.mixer.clipAction(this.baked.clip).setEffectiveWeight(1.0);
        this.baked.status = true;

        return this.baked.action;
    }

    setFromEuler(quat, euler) {
        // three.js does not patch this until r120. PR#20042.
        // Until then, I'm bringing the math to this project...
        const x = euler._x, y = euler._y, z = euler._z, order = euler._order;

        const cos = Math.cos;
		const sin = Math.sin;

		const c1 = cos( x / 2 );
		const c2 = cos( y / 2 );
		const c3 = cos( z / 2 );

		const s1 = sin( x / 2 );
		const s2 = sin( y / 2 );
        const s3 = sin( z / 2 );
        
        switch ( order ) {

			case 'XYZ':
				quat._x = s1 * c2 * c3 + c1 * s2 * s3;
				quat._y = c1 * s2 * c3 - s1 * c2 * s3;
				quat._z = c1 * c2 * s3 + s1 * s2 * c3;
				quat._w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case 'YXZ':
				quat._x = s1 * c2 * c3 + c1 * s2 * s3;
				quat._y = c1 * s2 * c3 - s1 * c2 * s3;
				quat._z = c1 * c2 * s3 - s1 * s2 * c3;
				quat._w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			case 'ZXY':
				quat._x = s1 * c2 * c3 - c1 * s2 * s3;
				quat._y = c1 * s2 * c3 + s1 * c2 * s3;
				quat._z = c1 * c2 * s3 + s1 * s2 * c3;
				quat._w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case 'ZYX':
				quat._x = s1 * c2 * c3 - c1 * s2 * s3;
				quat._y = c1 * s2 * c3 + s1 * c2 * s3;
				quat._z = c1 * c2 * s3 - s1 * s2 * c3;
				quat._w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			case 'YZX':
				quat._x = s1 * c2 * c3 + c1 * s2 * s3;
				quat._y = c1 * s2 * c3 + s1 * c2 * s3;
				quat._z = c1 * c2 * s3 - s1 * s2 * c3;
				quat._w = c1 * c2 * c3 - s1 * s2 * s3;
				break;

			case 'XZY':
				quat._x = s1 * c2 * c3 - c1 * s2 * s3;
				quat._y = c1 * s2 * c3 - s1 * c2 * s3;
				quat._z = c1 * c2 * s3 + s1 * s2 * c3;
				quat._w = c1 * c2 * c3 + s1 * s2 * s3;
				break;

			default:
				console.warn( 'Inner THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + order );

        }
        
        quat._onChangeCallback();
        return quat;
    }
}