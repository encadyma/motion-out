/**
 * AMC Parser by Kevin Mo (@encadyma).
 */

export class AMCParser {
    TOKEN_COMMENT_RGX = /^#(.+)/;
    TOKEN_KEYWORD_RGX = /^:(\w+)(?:\s+([\w\d\s\.]+))?/;
    TOKEN_KEYDATA_RGX = /^([\w]+)\s((?:(?:[\d\.\e\-]+)\s*)+)$/;
    TOKEN_FRAMENUM_RGX = /^([\d]+)$/;
    TOKEN_WHITESPACE_RGX = /^\s*$/;

    loaded = false;
    tokens = [];

    frames = [];
    frameCount = 0;

    errors = [];

    metadata = {
        name: "Unnamed AMC",
    };

    player = {
        frame: 0,
        fps: 10,
        playInterval: null,
    }

    /**
     * Sets the AMC human-readable name.
     * @param {String} name new AMC file name
     */
    setName(name) {
        this.metadata.name = name;
    }

    /**
     * Tokenizes a given AMC file for the parser,
     * given in raw ASCII format.
     * @param {String} raw_file or a string from an AMC file
     * @returns {Array} processed tokens
     */
    tokenize(raw_file) {
        const lines = raw_file.split('\n');
        let index = 0;
        this.tokens = [];

        console.time("tokenize amc");

        while (index < lines.length) {
            const line = lines[index].trim();
            if (this.TOKEN_KEYWORD_RGX.test(line)) {
                // KEYWORD - :keyword
                const matches = line.match(this.TOKEN_KEYWORD_RGX);
                this.tokens.push({ type: 'KEYWORD', words: (!matches[2] ? [matches[1]] : matches.slice(1)) });
            } else if (this.TOKEN_COMMENT_RGX.test(line)) {
                // COMMENTS - # comment
                this.tokens.push({ type: 'COMMENT', words: line.match(this.TOKEN_COMMENT_RGX).slice(1) });
            } else if (this.TOKEN_FRAMENUM_RGX.test(line)) {
                // FRAMENUM - frame #
                const matches = line.match(this.TOKEN_FRAMENUM_RGX);
                this.tokens.push({ type: 'FRAMENUM', words: [matches[1]] });
            } else if (this.TOKEN_KEYDATA_RGX.test(line)) {
                // KEYDATA - bone # # #...
                const matches = line.match(this.TOKEN_KEYDATA_RGX);
                this.tokens.push({ type: 'KEYDATA', words: [matches[1], ...matches[2].split(/,?\s+/)] });
            } else if (this.TOKEN_WHITESPACE_RGX.test(line)) {
                // WHITESPACE - 
                this.tokens.push({ type: 'WHITESPACE', words: [] });
            } else {
                // Unknown tokens are parsed as strings
                this.tokens.push({ type: 'STRING', words: [line] });
            }
            index++;
        }

        console.timeEnd("tokenize amc");

        return this.tokens;
    }

    process() {
        this.frames = [];
        this.frameCount = 0;

        console.time("parser amc");

        let index = 0;
        while (index < this.tokens.length) {
            const token = this.tokens[index];
            if (token.type == "KEYWORD") {
                // Ignore keyword data for now... maybe
                // in the future when we expand the AMC
                // file format.
            } else if (token.type == "COMMENT") {
                // Ignore comments per usual.
            } else if (token.type == "FRAMENUM") {
                // We go on a frame data loop!
                const findex = parseInt(token.words[0]) - 1;
                while (this.frames.length <= findex) {
                    // Push empty frames so we can index later.
                    // Not elegant.
                    this.frames.push(null);
                }

                let nextFrame = {};
                index++;

                while (index < this.tokens.length && this.tokens[index].type == "KEYDATA") {
                    const kdata = this.tokens[index].words;
                    nextFrame[kdata[0]] = kdata.slice(1).map(parseFloat);
                    index++;
                }

                this.frames[findex] = nextFrame;
                this.frameCount = Math.max(this.frameCount, findex + 1);
                continue;
            } else if (token.type != "WHITESPACE") {
                console.error("warning! cannot process token " + JSON.stringify(this.tokens[index]));
                this.errors.push("Cannot process token " + JSON.stringify(this.tokens[index]) + " on index " + index + ".");
            }

            index++;
        }

        this.loaded = true;

        console.log(this.frames);
        console.timeEnd("parser amc");

        return this.frames;
    }
}