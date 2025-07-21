const jwt = require("jsonwebtoken");
const Role = require("../model/Role");

const generateUserToken = async (data) => {
  const role=await Role.findById(data.role)
  const token = await jwt.sign(
    {
      userId: data._id,
      name: data.name,
      email: data.email,
       roleId: role._id,
      roleName: role.name,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7h" }
  );
  return token;
};

module.exports = generateUserToken;
