import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

const Admin = sequelize.define(
  'Admin',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4, // Generate a UUID by default
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (Admin) => {
        const SALT = process.env.SALT;
        const salt = await bcrypt.genSalt(parseInt(SALT));
        Admin.password = await bcrypt.hash(Admin.password, salt);
      },
      beforeUpdate: async (Admin) => {
        if (Admin.changed('password')) {
          const SALT = process.env.SALT;
          const salt = await bcrypt.genSalt(parseInt(SALT));
          Admin.password = await bcrypt.hash(Admin.password, salt);
        }
      },
    },
  }
);

// Add an instance method to compare passwords
Admin.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Add a class-level method to generate JWT
Admin.generateToken = function (Admin) {
  return jwt.sign(
    { id: Admin.id, name: Admin.name },
    process.env.JWT_SECRET
  );
};

// Add a class-level method to verify JWT
Admin.verifyToken = function (token) {
  try {
    const value = jwt.verify(token, process.env.JWT_SECRET);
    return value;
  } catch (error) {
    return null; // Handle token verification failure
  }
};

export default Admin;