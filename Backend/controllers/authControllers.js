import User from "../models/User.js";

//Todo: Create a new User (Sign-in)
export const SignInUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const data = {
      name,
      email,
      password,
    };

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    //todo: hook will be called when user is created from encrypting password.
    const user = await User.create(data);

    const token = User.generateToken({
      id: user.id,
      name: user.name,
    });

    res.status(200).json({ token, email: user.email, username: user.name });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Todo: Login a User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "This account is not exist." });
    }

    if (!user.approved) {
      return res.status(403).json({ message: "This account is Bad!" });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Password didn't match." });
    }

    const token = User.generateToken({ id: user.id, name: user.name });
    res.status(200).json({ token, email: user.email, username: user.name });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
