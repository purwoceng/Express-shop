import prisma from "../prisma.js";

/**
+ * Middleware to validate and extract user authentication token from request headers.
+ *
+ * @param {Object} req - The request object
+ * @param {Object} res - The response object
+ * @param {Function} next - The next function to be called in the middleware chain
+ * @return {Promise<void>} - Promise that resolves if the token is valid, or rejects with an error message
+ */

export const authToken = async (req, res, next) => {
  console.log(req.head);
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Token is required",
    });
  }

  const validToken = await prisma.token.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          is_blocked: true,
          role_id: true,
        },
      },
    },
  });

  if (!validToken) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  if (validToken.expires_at < new Date()) {
    return res.status(401).json({
      message: "Expired token",
    });
  }

  if (validToken.user.is_blocked) {
    return res.status(401).json({
      message: "Blocked user",
    });
  }

  req.user = validToken.user;

  next();
};

export const authorizePermission = (permission) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const permissionRecords = await prisma.permissionRole.findMany({
      where: { role_id: req.user.role_id },
      include: { permission: true },
    });

    const permissions = permissionRecords.map(
      (record) => record.permission.name
    );

    console.log("looking for permission", permission);
    console.log("in permissions", permissions);

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    next();
  };
};
