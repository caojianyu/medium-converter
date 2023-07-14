
/**
 * @author 994Ay
 * @description 工具方法（都可以使用rust替换）
 */

import { videoFormatArr } from "./constants";

/**
 * 字节单位转换
 * 
 * @param size 字节大小
 * @returns 格式化单位数值
 */
function byteConversion(size: number) {
    if (!size) return '';
    if (size < pow1024(1)) return size + ' B';
    if (size < pow1024(2)) return (size / pow1024(1)).toFixed(2) + ' KB';
    if (size < pow1024(3)) return (size / pow1024(2)).toFixed(2) + ' MB';
    if (size < pow1024(4)) return (size / pow1024(3)).toFixed(2) + ' GB';
    return (size / pow1024(4)).toFixed(2) + ' TB'
}

/**
 * 将总时长为秒的单位转换为时、分、秒
 * 
 * @param duration 总秒数
 * @returns 格式化时间
 */
function formatDateTime(duration: number) {
    const hour = Math.floor(duration / 3600)
    const min = Math.floor(duration / 60) % 60
    const sec = duration % 60
    return formatTime(hour) + ':' + formatTime(min) + ':' + formatTime(sec)
}

/**
 * 时分秒字符串转为秒
 * 
 * @param time 时分秒字符串
 * @returns 转换后秒数
 */
function dateTimeToSecond(time: string) {
    const arr = time.split(':');
    const hour = parseInt(arr[0]);
    const min = parseInt(arr[1]);
    const sec = parseInt(arr[2]);
    return hour * 3600 + min * 60 + sec
}

/**
 * 生成唯一id
 * 
 * @returns 
 */
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * 根据后缀判断是否是视频
 * 
 * @param suffix 后缀
 * @returns boolean
 */
function isVideo(suffix: string) {
    return videoFormatArr.includes(suffix);
}


/** 以下为非导出方法 */

/**
 * 格式化单位数字
 * 
 * @param {number} val 时分秒数值
 */

function formatTime(val: number) {
    return val < 10 ? ("0" + val) : val
}

/**
 * 求次幂
 * 
 * @param num 
 * @returns 
 */
function pow1024(num: number) {
    return Math.pow(1024, num)
}

export { byteConversion, formatDateTime, dateTimeToSecond, uuid, isVideo }