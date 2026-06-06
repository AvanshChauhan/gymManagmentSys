import crypto from "crypto";

const imageKitAuth = (req, res) => {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey) {
    return res.status(500).json({
      success: false,
      message: "ImageKit environment variables are not configured",
    });
  }

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 10 * 60;
  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  return res.status(200).json({
    success: true,
    data: {
      token,
      expire,
      signature,
      publicKey,
      urlEndpoint: urlEndpoint || "",
    },
  });
};

export default imageKitAuth;
