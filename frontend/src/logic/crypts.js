exports.encryptUrl = (plainUrl) => {
    const encryptedUrl = btoa(plainUrl);
    return encryptedUrl;
}

exports.decryptUrl = (encryptedUrl) => {
    const plainUrl = atob(encryptedUrl);
    return plainUrl;
}