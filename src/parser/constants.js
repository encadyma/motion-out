export const TO_RADIANS = Math.PI / 180.0;

export const toRadians = val => (val * TO_RADIANS);

import * as THREE from 'three';

export const AMC_FILES = {
    "golf": [
        { name: "golf_01", src: "assets/amc/golf/golf_01.amc" },
    ],
    "debug": [
        { name: "null", src: "assets/amc/debug/null.amc" },
    ],
    "walk": [
        { name: "walk_03", src: "assets/amc/walk/walk_03.amc" },
    ],
    "moderndance": [
        { name: "md_walk", src: "assets/amc/moderndance/md_walk.amc" },
        { name: "md_02", src: "assets/amc/moderndance/md_02.amc" },
        { name: "md_03", src: "assets/amc/moderndance/md_03.amc" },
        { name: "md_04", src: "assets/amc/moderndance/md_04.amc" },
        { name: "md_05", src: "assets/amc/moderndance/md_05.amc" },
        { name: "md_07", src: "assets/amc/moderndance/md_07.amc" },
    ],
    "mjackson": [
        { name: "mj_01", src: "assets/amc/mjackson/131_01.amc" },
        { name: "mj_02", src: "assets/amc/mjackson/131_02.amc" },
        { name: "mj_03", src: "assets/amc/mjackson/131_03.amc" },
        { name: "mj_04", src: "assets/amc/mjackson/131_04.amc" },
        { name: "mj_05", src: "assets/amc/mjackson/131_05.amc" },
        { name: "mj_06", src: "assets/amc/mjackson/131_06.amc" },
        { name: "mj_07", src: "assets/amc/mjackson/131_07.amc" },
        { name: "mj_08", src: "assets/amc/mjackson/131_08.amc" },
        { name: "mj_09", src: "assets/amc/mjackson/131_09.amc" },
        { name: "mj_10", src: "assets/amc/mjackson/131_10.amc" },
        { name: "mj_11", src: "assets/amc/mjackson/131_11.amc" },
        { name: "mj_12", src: "assets/amc/mjackson/131_12.amc" },
        { name: "mj_13", src: "assets/amc/mjackson/131_13.amc" },
        { name: "mj_14", src: "assets/amc/mjackson/131_14.amc" },
    ],
    "martialwalk": [
        { name: "mw_01", src: "assets/amc/martialwalk/135_01.amc" },
        { name: "mw_02", src: "assets/amc/martialwalk/135_02.amc" },
        { name: "mw_03", src: "assets/amc/martialwalk/135_03.amc" },
        { name: "mw_04", src: "assets/amc/martialwalk/135_04.amc" },
        { name: "mw_05", src: "assets/amc/martialwalk/135_05.amc" },
        { name: "mw_06", src: "assets/amc/martialwalk/135_06.amc" },
        { name: "mw_07", src: "assets/amc/martialwalk/135_07.amc" },
        { name: "mw_08", src: "assets/amc/martialwalk/135_08.amc" },
        { name: "mw_09", src: "assets/amc/martialwalk/135_09.amc" },
        { name: "mw_10", src: "assets/amc/martialwalk/135_10.amc" },
        { name: "mw_11", src: "assets/amc/martialwalk/135_11.amc" },
    ]
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
    },
    "moderndance": {
        id: "moderndance",
        name: "Modern Dance",
        namespace: "MODERNDANCE",
        src: "assets/asf/moderndance.asf"
    },
    "mjackson": {
        id: "mjackson",
        name: "Michael Jackson",
        namespace: "MJACKSON",
        src: "assets/asf/mjackson.asf"
    },
    "martialwalk": {
        id: "martialwalk",
        name: "Martial Art Walks",
        namespace: "MARTIALWALK",
        src: "assets/asf/martialwalk.asf"
    }
}

export const STAGE_FILES = {
    "testscene": {
        id: "testscene",
        type: "GLTF",
        name: "testscene.glb",
        description: "Test scene",
        src: "assets/scenes/testscene.glb",
        scale: 1,
    },
    "CBdragon": {
        id: "CBdragon",
        type: "COLLADA",
        name: "CBdragon.dae",
        description: "Cornell Box with Dragon",
        src: "assets/scenes/CBdragon.dae",
        scale: 50,
    },
    "CBbunny": {
        id: "CBbunny",
        type: "COLLADA",
        name: "CBbunny.dae",
        description: "Cornell Box with Bunny",
        src: "assets/scenes/CBbunny.dae",
        scale: 50,
    },
    "CBspheres": {
        id: "CBspheres",
        type: "COLLADA",
        name: "CBspheres.dae",
        description: "Cornell Box with Spheres",
        src: "assets/scenes/CBspheres.dae",
        scale: 50,
    },
    "dragon": {
        id: "dragon",
        type: "COLLADA",
        name: "dragon.dae",
        description: "Dragon",
        src: "assets/scenes/dragon.dae",
        scale: 50,
    },
}

export const HOLOLIVE_TRANSFORM = {
    "root": {
        position: new THREE.Vector3(30, -18, 30),
        rotation: new THREE.Euler()
    },
    "lfemur": {
        position: new THREE.Vector3(),
        rotation: new THREE.Euler(-Math.PI / 4, 0, 0)
    },
    "rfemur": {
        position: new THREE.Vector3(),
        rotation: new THREE.Euler(-Math.PI / 4, 0, 0)
    }
}

export const HOLOLIVE_BONEMAP = {
    "root": "全ての親",         // Maybe センター

    // lhipjoint tree
    // "lhipjoint": "左足",        // no degrees of freedom
    "lfemur": "左足",
    "ltibia": "左ひざ",
    "lfoot": "lfoot",
    "ltoes": "左足首",

    // rhipjoint tree
    // "rhipjoint": "右足",        // no degrees of freedom
    "rfemur": "右足",
    "rtibia": "右ひざ",
    "rfoot": "rfoot",
    "rtoes": "右足首",

    // Back stuff
    "lowerback": "lowerback",
    "upperback": "上半身",
    "thorax": "上半身２",
    "lowerneck": "首",
    "upperneck": "upperneck",
    "head": "頭",

    
    "rclavicle": "rclavicle",
    "rhumerus": "右腕",
    "rradius": "右ひじ",
    "rwrist": "右手首",
    "rhand": "右手捩",
    "rfingers": "右手先",
    "rthumb": "rthumb",

    "lclavicle": "lclavicle",
    "lhumerus": "左腕",
    "lradius": "左ひじ",
    "lwrist": "左手首",
    "lhand": "左手捩",
    "lfingers": "左手先",
    "lthumb": "lthumb",
    
};

export const MMD_FILES = {
    "trackerman": {
        id: "trackerman",
        type: "FBX",
        src: "assets/fbx/trackerman.fbx",
        name: "Motion Capture Man",
        name_jp: "Motion Capture Man",
        author: "Mixamo.com",
        website: "https://www.mixamo.com/",
        bonemap: {
            head: "Head",
            lclavicle: "nobone",
            lhand: "LeftHand",
            lhumerus: "LeftShoulder",
            lowerback: "Spine",
            lowerneck: "Neck",
            lradius: "LeftArm",
            lwrist: "LeftForeArm",
            rclavicle: "nobone",
            root: "Hips",
            thorax: "Spine2",
            upperback: "Spine1",
            upperneck: "Neck1",
        },
        transforms: {
            "lowerback": {
                position: new THREE.Vector3(),
                rotation: new THREE.Euler(Math.PI / 2, 0, 0),
            }
        },
        supported: true,
    },
    "korone": {
        id: "korone",
        type: "MMD",
        src: "assets/mmd/korone/戌神ころね＿v4.pmx",
        name: "Inugami Korone",
        name_jp: "戌神ころね",
        author: "Cover Corp.",
        website: "https://www.mmd.hololive.tv/",
        bonemap: HOLOLIVE_BONEMAP,
        transforms: HOLOLIVE_TRANSFORM,
        supported: false,
    },
    "okayu": {
        id: "okayu",
        type: "MMD",
        src: "assets/mmd/okayu/猫又おかゆ.pmx",
        name: "Nekomata Okayu",
        name_jp: "猫又おかゆ",
        author: "Cover Corp.",
        website: "https://www.mmd.hololive.tv/",
        bonemap: HOLOLIVE_BONEMAP,
        transforms: HOLOLIVE_TRANSFORM,
        supported: false,
    },
    "mel": {
        id: "mel",
        type: "MMD",
        src: "assets/mmd/mel/夜空メル.pmx",
        name: "Yozora Mel",
        name_jp: "夜空メル",
        author: "Cover Corp.",
        website: "https://www.mmd.hololive.tv/",
        bonemap: HOLOLIVE_BONEMAP,
        transforms: HOLOLIVE_TRANSFORM,
        supported: false,
    }
}