import {Toast} from "vant";

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
	return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
	const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
	return reg.test(url);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
	const reg = /^[a-z]+$/;
	return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
	const reg = /^[A-Z]+$/;
	return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
	const reg = /^[A-Za-z]+$/;
	return reg.test(str);
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
	// eslint-disable-next-line no-useless-escape
	const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (reg.test(email)) Toast("邮箱有误");
	return reg.test(email);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUserName(str) {
	const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/;
	if (isNullOrUndefined(str) || !reg.test(str)) Toast('用户名为8-16位字母或数字组合');
	return reg.test(str);
}

/**
 * @param {string} pwd
 * @returns {Boolean}
 */
export function validPwd(pwd) {
	const reg = /^[a-zA-Z0-9]{6,16}$/;
	if (!reg.test(pwd) || isNullOrUndefined(pwd)) Toast('密码为8-16位字母或数字');
	return reg.test(pwd);
}

export function validPayPwd(pwd) {
	if (pwd.length < 4 || isNullOrUndefined(pwd)) Toast('交易密码长度为4');
	return pwd.length === 4 && !isNullOrUndefined(pwd)
}

export function validConfirmPwd(pwd, confirmPwd) {
	if (pwd !== confirmPwd) {
		Toast('密码不一致');
		return false;
	} else {
		return true;
	}
}

export function validVerifyCode(verifyCode) {
	if (isNullOrUndefined(verifyCode)) Toast('验证码错误');
	return !isNullOrUndefined(verifyCode);
}

export function validCardNo(cardNo) {
	const reg = /[1-9][0-9]{14,18}$/;
	if (!reg.test(cardNo) || isNullOrUndefined(cardNo)) Toast('银行卡号不正确');
	return reg.test(cardNo);
}


export function isNullOrUndefinedDesc(value) {
	if (isNullOrUndefined(value)) Toast('不能为空');
	return !isNullOrUndefined(value);
}

/**
 * @param {string} phone
 * @returns {Boolean}
 */
export function validPhone(phone) {
	const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/;
	if (reg.test(phone)) Toast('电话号码格式不正确');
	return reg.test(phone);
}

/**
 * @param {string} qq
 * @returns {Boolean}
 */
export function validQQ(qq) {
	const reg = /^[1-9][0-9]{4,10}$/gim;
	return reg.test(qq);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
	return typeof str === "string" || str instanceof String;
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
	if (typeof Array.isArray === "undefined") {
		return Object.prototype.toString.call(arg) === "[object Array]";
	}
	return Array.isArray(arg);
}

export function isJson(str) {
	if (isString(str)) {
		let obj = JSON.parse(str);
		return isArray(obj) || isObject(obj);
	} else {
		return false
	}
}

/**
 * @param {Object} arg
 * @returns {Boolean}
 */
export function isObject(arg) {
	return Object.prototype.toString.call(arg) === "[object Object]";
}

export function isNullOrUndefined(value) {
	return value === null || value === undefined || value === "";
}

export function confirmed(value, target) {
	return String(value) === String(target);
}

/**
 * @param {Number} value
 * @param {Number} max
 * @returns {Boolean}
 */
export function maxValue(value, max) {
	if (isNullOrUndefined(value)) {
		return false;
	}
	return Number(value) <= max;
}


