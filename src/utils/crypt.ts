import CryptoJS, {Mode} from "crypto-js"
import { JSEncrypt } from "encryptlong"

/** AES 秘钥 */
const KEY = CryptoJS.enc.Utf8.parse("1234567891234567")
/** AES 偏移量 */
const IV = CryptoJS.enc.Utf8.parse("1234567891234567")
/** RSA 公钥 */
const PUBLIC_KEY = `
        -----BEGIN PUBLIC KEY-----
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDslpR2w+fxzDIf+ilq+puixzu
        wth5CWdTDX2Gf1RpDkPspI+j0/HIrmpqmeyMUsCJA8WlDmBeMH/K8l5eiUq1sz7C
        XDFlZgD20XFX/KLFnwE4Hwa8Tf/Jie1f2cDl25Ypp5PwSF5T8bMdOV6vBwCMLCVhk
        CpD0JJNdyM90LiKSQIDAQAB
        -----END PUBLIC KEY-----`
/** RSA 私钥 */
const PRIVATE_KEY = `
        -----BEGIN PUBLIC KEY-----
        MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMOyWlHbD5/HMMh/6
        KWr6m6LHO7C2HkJZ1MNfYZ/VGkOQ+ykj6PT8ciuamqZ7IxSwIkDxaUOYF4wf8ryXl
        6JSrWzPsJcMWVmAPbRcVf8osWfATgfBrxN/8mJ7V/ZwOXblimnk/BIXlPxsx05Xq8
        HAIwsJWGQKkPQkk13Iz3QuIpJAgMBAAECgYEAnrhvLOjBWVPTKysi5Av1Tccipjv+
        Gt0XonLUllt7eOGLEcm+fp+OALgFs4Q4KO+NHROkH+TzIDGx1EaTZ5Vus1bVqkGmt
        lzh1amcPEf30xEQlWmnAAHEvYJ3WQAjx3igsp+zxuTdYytMZc3ej/YK/NE7otb98X
        v9J5clbrmUKYkCQQD6hdVkbApaZmHDRJXLHn0eiyBxfINU+9Vbj+mNBCa/tTg3hj7
        /2c+ajl6oyPCPxVyntoA5P2wYB8Qm3+BGiSbjAkEAx/mo4Tn5k79ACG82g19MqxiP
        SDl3W6XDHheDpxhQWo5Ki4XrznvKM2jSIHs/Ac7MPq7M5/yrf7d0SNnVZAbl4wJBA
        LWU99z36nEnsEiml6RIDwxqbzOSumaIulbJctEBZ0yg/4RPS66Ko001UCsqqiKrPM
        NbJolYDPNF/cjnkFnP410CQEODiH6xwg8drJKsaW0lCY9iNU2fCSsJ5bwNGEebr9V
        C4OwGBLyrknKU2wxYT8deeBpZjZhs98GgwEOwN5kTsx0CQQC36quG2zCE+NewEqyl
        XuK1qlWfp6cG7ue9pu7g7Jey01ws+VaCJlN5fkiqjAUT7CYdyhDCqWPM3oYD2v++OHIq
        -----END PUBLIC KEY-----`

export function AES_CBC_Encrypt(content: any): any {
    return AESEncrypt(content, '', '', CryptoJS.mode.CBC)
}

export function AES_CBC_Decrypt(content: any): string {
    return AESDecrypt(content, '', '', CryptoJS.mode.CBC)
}

export function RSA_Encrypt(content: any): string {
    const jsEncrypt = new JSEncrypt()
    jsEncrypt.setPublicKey(PUBLIC_KEY)
    jsEncrypt.setPrivateKey(PRIVATE_KEY)
    return jsEncrypt.encryptLong(JSON.stringify(content))
}

export function RSA_Decrypt(content: string): string {
    const jsEncrypt = new JSEncrypt()
    jsEncrypt.setPublicKey(PUBLIC_KEY)
    jsEncrypt.setPrivateKey(PRIVATE_KEY)
    return JSON.parse(jsEncrypt.decryptLong(content))
}

export function AESEncrypt(word: any, keyStr: string, ivStr: string, mode: Mode): string {
    let key = KEY
    let iv = IV

    if (keyStr) {
        key = CryptoJS.enc.Utf8.parse(keyStr)
        iv = CryptoJS.enc.Utf8.parse(ivStr)
    }

    let srcs = CryptoJS.enc.Utf8.parse(word)
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: mode,
        padding: CryptoJS.pad.Pkcs7
    })
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}

export function AESDecrypt(word: any, keyStr: string, ivStr: string, mode: Mode): string {
    let key = KEY
    let iv = IV

    if (keyStr) {
        key = CryptoJS.enc.Utf8.parse(keyStr)
        iv = CryptoJS.enc.Utf8.parse(ivStr)
    }

    let base64 = CryptoJS.enc.Base64.parse(word)
    let src = CryptoJS.enc.Base64.stringify(base64)

    var decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: mode,
        padding: CryptoJS.pad.Pkcs7
    })

    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
}
