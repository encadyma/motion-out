/**
 * AMC Parser by Kevin Mo (@encadyma).
 */

export class AMCEngine {
    TOKEN_COMMENT_RGX = /^#(.+)/;
    TOKEN_KEYWORD_RGX = /^:(\w+)(?:\s+([\w\d\s\.]+))?/;
    TOKEN_FRAME_RGX = /^([\d]+)$/;

    tokens = [];

    tokenize(raw_file) {
        return this.tokens;
    }

    process() {
        return null;
    }
}