export const TO_RADIANS = Math.PI / 180.0;

export const toRadians = val => (val * TO_RADIANS);

export const AMC_FILES = {
    "golf": [
        { name: "golf_01", src: "assets/amc/golf_01.amc" },
    ],
    "walk": [
        { name: "walk_03", src: "assets/amc/walk_03.amc" },
    ],
    "debug": []
};

export const ASF_FILES = {
    "golf": {
        id: "golf",
        name: "Golf",
        namespace: "GOLF",
        src: "assets/asf/golf.asf"
    },
    "walk": {
        id: "walk",
        name: "Walk",
        namespace: "WALK",
        src: "assets/asf/walk.asf"
    },
}

export const MMD_FILES = {
    "korone": {
        src: "assets/mmd/korone/戌神ころね＿v4.pmx",
        name: "Inugami Korone",
        name_jp: "戌神ころね",
        author: "Cover Corp.",
        website: "https://www.mmd.hololive.tv/",
        bonemap: {
            "root": "root",
            "lowerback": "lowerback",
            "upperback": "upperback",
            "thorax": "thorax",
            "lowerneck": "lowerneck",
            "upperneck": "upperneck",
            "head": "head",
            "rclavicle": "rclavicle",
            "rhumerus": "rhumerus",
            "rradius": "rradius",
            "rwrist": "rwrist",
            "rhand": "rhand",
            "rfingers": "rfingers",
            "rthumb": "rthumb",
            "lclavicle": "lclavicle",
            "lhumerus": "lhumerus",
            "lradius": "lradius",
            "lwrist": "lwrist",
            "lhand": "lhand",
        },
    }
}