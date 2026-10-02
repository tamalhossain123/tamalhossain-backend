const sharp = require('sharp');

/**
 * Base64 ইমেজকে রিসাইজ এবং WebP-তে কম্প্রেস করার ফাংশন
 */
async function optimizeBase64Image(base64String) {
  try {
    // Base64 প্রিফিক্স ও ডাটা আলাদা করা
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64String;
    }

    const imageBuffer = Buffer.from(matches[2], 'base64');

    // Sharp অপটিমাইজেশন
    const optimizedBuffer = await sharp(imageBuffer)
      .resize({
        width: 1400, // ম্যাক্সিমাম উইডথ ১৪০০px
        withoutEnlargement: true // ছোট ইমেজ বড় হবে না
      })
      .webp({ quality: 80 }) // ৮০% কোয়ালিটি WebP
      .toBuffer();

    return `data:image/webp;base64,${optimizedBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Image optimization failed:', error);
    return base64String; // ফেইল করলে অরিজিনাল ডাটা যাবে
  }
}

module.exports = { optimizeBase64Image };