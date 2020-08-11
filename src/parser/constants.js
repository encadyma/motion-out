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
    "debug": {
        id: "debug",
        name: "Debug",
        namespace: "DEBUG",
        src: "assets/asf/debug.asf"
    }
}

export const MMD_FILES = {
    "korone": {
        src: "assets/mmd/korone/戌神ころね＿v4.pmx",
        name: "Inugami Korone",
        name_jp: "戌神ころね",
        author: "Cover Corp.",
        website: "https://www.mmd.hololive.tv/",
        bonemap: {
            "root": "全ての親",         // Maybe センター
            "lhipjoint": "左足ＩＫ",
            "rhipjoint": "右足ＩＫ",
            "lowerback": "センター",
            "upperback": "腰",
            "thorax": "thorax",
            "lowerneck": "lowerneck",
            "upperneck": "upperneck",
            "head": "頭",
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