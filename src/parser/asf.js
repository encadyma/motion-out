/**
 * ASF Parser by Kevin Mo (@encadyma).
 */

export const SMALL_ASF = 
`## Example ASF file created for parsing purposes.
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
     id 27 
     name rwrist
     direction -1 -4.48953e-011 1.43537e-026   
     length 1.68252   
     axis -9.31228e-015 -90 -90   XYZ
    dof ry
    limits (-180.0 0.0)
  end
  begin
     id 28
     name rhand
     direction -1 -4.48961e-011 2.87071e-026   
     length 0.620444   
     axis -1.83174e-014 -90 -90   XYZ
    dof rx rz
    limits (-90.0 90.0)
           (-45.0 45.0)
  end
  begin
     id 29
     name rfingers
     direction -1 -4.49037e-011 5.74091e-026   
     length 0.500218   
     axis -3.66347e-014 -90 -90   XYZ
    dof rx
    limits (0.0 90.0)
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
:hierarchy
  begin
    root rwrist
    rwrist rhand rthumb
    rhand rfingers
  end
`

export class ASFNode {
    constructor(bone, children = [],
        parent = null
    ) {
        this.id = bone.id;
        this.name = bone.name;
        this.direction = bone.direction;
        this.length = bone.length;
        this.axis = bone.axis;
        this.axis_order = bone.axis_order;
        this.dof = bone.dof;
        this.limits = bone.limits;
        this.children = children;
        this.parent = parent;
    }

    parent() {
        return this.parent;
    }

    name() {
        return this.name;
    }
}

export class ASFParser {
    TOKEN_KEYWORD_RGX = /^:(\w+)(?:\s+([\w\d\s\.]+))?/;
    TOKEN_COMMENT_RGX = /^#(.+)/;
    TOKEN_BEGIN_RGX = /^begin$/;
    TOKEN_END_RGX = /^end$/;
    TOKEN_WHITESPACE_RGX = /^\s*$/;
    TOKEN_TUPLE_RGX = /(\w+\s)?\(((?:\s?[\d\.e\-]+)+)\)/;

    tokens = [];
    errors = [];

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
        orientation: []
    };

    bones = {};
    tree = {};

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
                        console.log(this.bones);

                        // We start searching the tree for the given keyword.
                        if (rel[0] == "root") {
                            rel.slice(1)
                        } else {

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
    }
}