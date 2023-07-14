
/**
 * @author 994Ay
 * @description 固定常量
 */

/** 常见视频格式 */
const videoFormatArr = ["mp4", "mov", "mkv", "avi", "wmv", "m4v", "mpg", "vob", "webm", "ogv", "3gp", "flv", "f4v", "swf"];

/** 常见音频格式 */
const audioFormatArr = ["mp3", "wav", "m4a", "wma", "aac", "flac", "ac3", "m4r", "ape", "ogg"];

/** 视频转换参数 */
const videoParamList = [
    {
        name: "mp4",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "HD 1080P",
                value: "1920x1080",
            },
            {
                name: "HD 720P",
                value: "1280x720",
            },
            {
                name: "640P",
                value: "960x640",
            },
            {
                name: "SD 480P",
                value: "640x480",
            },
            {
                name: "4K UHDTV",
                value: "3840X2160",
            },
            {
                name: "4K Full Aperture",
                value: "4096x3112",
            },
        ],
    },
    {
        name: "mov",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "HD 1080P",
                value: "1920x1080",
            },
            {
                name: "HD 720P",
                value: "1280x720",
            },
            {
                name: "SD 480P",
                value: "640x480",
            },
            {
                name: "4K UHDTV",
                value: "3840X2160",
            },
            {
                name: "4K Full Aperture",
                value: "4096x3112",
            },
        ],
    },
    {
        name: "mkv",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "HD 1080P",
                value: "1920x1080",
            },
            {
                name: "HD 720P",
                value: "1280x720",
            },
            {
                name: "SD 480P",
                value: "640x480",
            },
            {
                name: "4K UHDTV",
                value: "3840X2160",
            },
            {
                name: "4K Full Aperture",
                value: "4096x3112",
            },
        ],
    },
    {
        name: "avi",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "HD 1080P",
                value: "1920x1080",
            },
            {
                name: "HD 720P",
                value: "1280x720",
            },
            {
                name: "SD 480P",
                value: "640x480",
            },
        ],
    },
    {
        name: "wmv",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "HD 1080P",
                value: "1920x1080",
            },
            {
                name: "HD 720P",
                value: "1280x720",
            },
            {
                name: "SD 480P",
                value: "640x480",
            },
            {
                name: "4K UHDTV",
                value: "3840X2160",
            },
            {
                name: "4K Full Aperture",
                value: "4096x3112",
            },
        ],
    },
    {
        name: "m4v",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "HD 1080P",
                value: "1920x1080",
            },
            {
                name: "HD 720P",
                value: "1280x720",
            },
            {
                name: "SD 480P",
                value: "640x480",
            },
            {
                name: "4K UHDTV",
                value: "3840X2160",
            },
            {
                name: "4K Full Aperture",
                value: "4096x3112",
            },
        ],
    },
    {
        name: "mpg",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "HD 1080P",
                value: "1920x1080",
            },
            {
                name: "HD 720P",
                value: "1280x720",
            },
            {
                name: "SD 480P",
                value: "720x480",
            },
            {
                name: "SD 576P",
                value: "720x576",
            },
        ],
    },
    {
        name: "vob",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "480P DVD-Video",
                value: "720x480",
            },
        ],
    },
    {
        name: "webm",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "HD 1080P",
                value: "1920x1080",
            },
            {
                name: "HD 720P",
                value: "1280x720",
            },
            {
                name: "SD 480P",
                value: "640x480",
            },
            {
                name: "4K UHDTV",
                value: "3840X2160",
            },
            {
                name: "4K Full Aperture",
                value: "4096x3112",
            },
        ],
    },
    {
        name: "ogv",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "HD 1080P",
                value: "1920x1080",
            },
            {
                name: "HD 720P",
                value: "1280x720",
            },
            {
                name: "SD 480P",
                value: "640x480",
            },
        ],
    },
    {
        name: "3gp",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "3GP2",
                value: "320x240",
            },
            {
                name: "3GP1",
                value: "176x144",
            }
        ],
    },
    {
        name: "flv",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "HD 1080P",
                value: "1920x1080",
            },
            {
                name: "HD 720P",
                value: "1280x720",
            },
            {
                name: "SD 480P",
                value: "640x480",
            },
            {
                name: "SD 360P",
                value: "640x360",
            },
            {
                name: "4K UHDTV",
                value: "3840X2160",
            },
            {
                name: "4K Full Aperture",
                value: "4096x3112",
            },
        ],
    },
    {
        name: "f4v",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "HD 1080P",
                value: "1920x1080",
            },
            {
                name: "HD 720P",
                value: "1280x720",
            },
            {
                name: "SD 480P",
                value: "640x480",
            },
            {
                name: "SD 360P",
                value: "640x360",
            },
            {
                name: "4K UHDTV",
                value: "3840X2160",
            },
            {
                name: "4K Full Aperture",
                value: "4096x3112",
            },
        ],
    },
    {
        name: "swf",
        children: [
            {
                name: "同原文件",
                value: "原媒体分辨率",
            },
            {
                name: "HD 1080P",
                value: "1920x1080",
            },
            {
                name: "HD 720P",
                value: "1280x720",
            },
            {
                name: "SD 480P",
                value: "640x480",
            },
            {
                name: "SD 360P",
                value: "320x240",
            },
            {
                name: "4K UHDTV",
                value: "3840X2160",
            },
            {
                name: "4K Full Aperture",
                value: "4096x3112",
            },
        ],
    },
]

/** 音频转换参数 */
const audioParamList = [
    {
        name: "mp3",
        children: [
            {
                name: "高品质",
                value: "256k",
            },
            {
                name: "中品质",
                value: "128k",
            },
            {
                name: "低品质",
                value: "96k",
            },
        ],
    },
    {
        name: "wav",
        children: [
            {
                name: "无损",
                value: "256k",
            },
        ],
    },
    {
        name: "m4a",
        children: [
            {
                name: "高品质",
                value: "256k",
            },
            {
                name: "中品质",
                value: "128k",
            },
            {
                name: "低品质",
                value: "96k",
            },
        ],
    },
    {
        name: "wma",
        children: [
            {
                name: "高品质",
                value: "256k",
            },
            {
                name: "中品质",
                value: "128k",
            },
            {
                name: "低品质",
                value: "96k",
            },
        ],
    },
    {
        name: "aac",
        children: [
            {
                name: "高品质",
                value: "256k",
            },
            {
                name: "中品质",
                value: "128k",
            },
            {
                name: "低品质",
                value: "96k",
            },
        ],
    },
    {
        name: "flac",
        children: [
            {
                name: "高品质",
                value: "256k",
            },
            {
                name: "中品质",
                value: "128k",
            },
            {
                name: "低品质",
                value: "96k",
            },
        ],
    },
    {
        name: "ac3",
        children: [
            {
                name: "高品质",
                value: "256k",
            },
            {
                name: "中品质",
                value: "128k",
            },
            {
                name: "低品质",
                value: "96k",
            },
        ],
    },
    {
        name: "m4r",
        children: [
            {
                name: "高品质",
                value: "256k",
            },
            {
                name: "中品质",
                value: "128k",
            },
            {
                name: "低品质",
                value: "96k",
            },
        ],
    },
    {
        name: "ape",
        children: [
            {
                name: "无损",
                value: "256k",
            },
        ],
    },
    {
        name: "ogg",
        children: [
            {
                name: "高品质",
                value: "256k",
            },
            {
                name: "中品质",
                value: "128k",
            },
            {
                name: "低品质",
                value: "96k",
            },
        ],
    },
]

export { videoFormatArr, audioFormatArr, videoParamList, audioParamList } 