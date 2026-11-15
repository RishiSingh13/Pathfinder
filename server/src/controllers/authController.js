const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Enrolment = require('../models/Enrolment');
const TopicProgress = require('../models/TopicProgress');
const ProblemReport = require('../models/ProblemReport');
const { setAuthCookies, clearAuthCookies } = require('../middleware/auth');
const { sendSuccess, sendError } = require('../utils/responseEnvelope');

/**
 * Register a new user account (defaults strictly to student role)
 */
async function register(req, res, next) {
  try {
    const { email, password, displayName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(
        res,
        409,
        'CONFLICT',
        'An account with this email address already exists. Please sign in instead.',
        [{ path: 'email', message: 'Email address is already registered.' }],
        req
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      displayName,
      email,
      passwordHash,
      role: 'student', // Public registration role is always 'student'
    });

    const { csrfToken } = setAuthCookies(res, user);

    return sendSuccess(
      res,
      201,
      {
        user: {
          id: user._id.toString(),
          displayName: user.displayName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        csrfToken,
      }
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Sign in an existing user with email and password
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(
        res,
        401,
        'UNAUTHENTICATED',
        'Invalid email or password. Please verify your credentials and try again.',
        undefined,
        req
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(
        res,
        401,
        'UNAUTHENTICATED',
        'Invalid email or password. Please verify your credentials and try again.',
        undefined,
        req
      );
    }

    const { csrfToken } = setAuthCookies(res, user);

    return sendSuccess(
      res,
      200,
      {
        user: {
          id: user._id.toString(),
          displayName: user.displayName,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        csrfToken,
      }
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Sign out user by clearing session and CSRF cookies
 */
async function logout(req, res) {
  clearAuthCookies(res);
  return sendSuccess(res, 200, {
    loggedOut: true,
  });
}

/**
 * Retrieve current authenticated session information
 */
async function getMe(req, res) {
  if (!req.user) {
    return sendSuccess(res, 200, {
      authenticated: false,
      user: null,
      csrfToken: '',
    });
  }

  const csrfToken = req.cookies ? (req.cookies['csrf_token'] || '') : '';

  return sendSuccess(res, 200, {
    authenticated: true,
    user: {
      id: req.user._id.toString(),
      displayName: req.user.displayName,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
    csrfToken,
  });
}

/**
 * Securely delete user account and clean up associated learning data
 */
async function deleteAccount(req, res, next) {
  try {
    const userId = req.user._id;

    // Optional re-authentication if password provided
    if (req.body && req.body.password) {
      const fullUser = await User.findById(userId);
      const isMatch = await fullUser.comparePassword(req.body.password);
      if (!isMatch) {
        return sendError(
          res,
          401,
          'UNAUTHENTICATED',
          'Password confirmation failed. Please enter your correct password to delete your account.',
          [{ path: 'password', message: 'Incorrect password.' }],
          req
        );
      }
    }

    // Cascade delete user progress, enrollments, and problem reports
    await TopicProgress.deleteMany({ userId });
    await Enrolment.deleteMany({ userId });
    await ProblemReport.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    clearAuthCookies(res);

    return sendSuccess(res, 200, {
      deleted: true,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  logout,
  getMe,
  deleteAccount,
};
