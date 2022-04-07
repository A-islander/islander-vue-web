const OSS = require("ali-oss");

export default function Client(data: any) {
    return new OSS({
        region: data.region,
        accessKeyId: data.accessKeyId,
        accessKeySecret: data.accessKeySecret,
        stsToken: data.stsToken,
        bucket: data.bucket,
    })
}
