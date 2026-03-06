import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatar = profile.photos?.[0]?.value || null;

        if (!email) {
          return done(new Error("No email returned from Google"), null);
        }

        // 1. Already signed up with Google
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // 2. Email exists but registered normally. link Google to that account
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          user.avatar = user.avatar || avatar;
          await user.save();
          return done(null, user);
        }

        // 3. Brand-new user. create account (no password)
        user = await User.create({
          name,
          email,
          googleId: profile.id,
          avatar,
          role: "user",
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

export default passport;
