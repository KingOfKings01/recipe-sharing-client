import AWSService from '../services/awsService.js'; 

export const uploadImageMiddleware = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    console.log();
    console.log(req.file);
    console.log();

    const userId = req.user.id;
    const { originalname, mimetype, buffer } = req.file;
    const key = `${userId}-${Date.now()}-${originalname}`;

    const awsService = new AWSService();
    const uploadResult = await awsService.uploadToS3(key, buffer, mimetype);

    req.imageUrl = uploadResult.Location; // Store the image URL in req for further use
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading image' });
  }
};
  