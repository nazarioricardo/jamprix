# Apple Sign In with Supabase in Expo - Setup and Maintenance Checklist

## Initial Setup

### 1. Apple Developer Account Setup
- [ ] Sign in to Apple Developer account
- [ ] Create/verify App ID with Sign In with Apple enabled
- [ ] Create Services ID
- [ ] Configure Sign In with Apple for the Service ID
- [ ] Add Supabase callback URL: `https://[project-ref].supabase.co/auth/v1/callback`

### 2. Supabase Setup
- [ ] Enable Apple provider in Authentication → Providers
- [ ] Add Service ID (Client ID) from Apple
- [ ] Leave OAuth Client Secret blank for native apps
- [ ] Verify callback URL configuration

### 3. Expo Project Setup
- [ ] Check Expo SDK is up to date: `npx expo install`
- [ ] Install required packages:
  ```bash
  npx expo install expo-apple-authentication
  npx expo install @supabase/supabase-js
  ```
- [ ] Configure app.json:
  ```json
  {
    "expo": {
      "ios": {
        "bundleIdentifier": "your.bundle.identifier",
        "usesAppleSignIn": true
      }
    }
  }
  ```
- [ ] Configure eas.json for development:
  ```json
  {
    "build": {
      "development": {
        "developmentClient": true,
        "distribution": "internal",
        "ios": {
          "simulator": true
        }
      }
    }
  }
  ```

### 4. Implementation
```typescript
import * as AppleAuthentication from 'expo-apple-authentication';

const signInWithApple = async () => {
  try {
    // Check availability
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Apple authentication not available');
    }

    // Sign in
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Supabase auth
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });

    if (error) throw error;
    return data;

  } catch (error) {
    console.error(error);
    throw error;
  }
};
```

### 5. Development Testing
- [ ] Build development client: `eas build --profile development --platform ios`
- [ ] Install on physical iOS device (not simulator)
- [ ] Test sign in with error logging enabled
- [ ] Verify Supabase auth session

## Maintenance Checklist (Run Monthly)

### Package Updates
- [ ] Update Expo packages: `npx expo install`
- [ ] Check other packages: `npm outdated`
- [ ] Security check: `npm audit`

### Configuration Verification
- [ ] Apple Developer portal certificates not expired
- [ ] Supabase project settings still correct
- [ ] Callback URLs still correctly configured

### Testing
- [ ] Sign in works on development build
- [ ] Sign in works on production build
- [ ] Session management working
- [ ] Error handling working

## Version Control Log

Keep track of working versions:

| Package | Version | Last Verified |
|---------|----------|---------------|
| Expo SDK | _______ | _______ |
| expo-apple-authentication | _______ | _______ |
| @supabase/supabase-js | _______ | _______ |

## Common Issues and Solutions

### 1. AuthApiError: Unacceptable audience
**Cause**: Testing in Expo Go instead of development build
**Solution**: Create and use development build with `eas build`

### 2. Apple Sign In not available
**Cause**: Testing in simulator or device not properly configured
**Solution**: Use physical iOS device with signed-in Apple ID

### 3. Authentication failed
**Cause**: Misconfigured callback URLs or Service ID
**Solution**: Verify all Apple Developer and Supabase configurations

## Additional Resources

- [Supabase Apple Auth Documentation](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [Expo Apple Authentication Documentation](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/get-started/)

## Notes

- Always test on physical iOS devices
- Keep package versions in sync
- Regularly check for deprecation notices
- Document any custom configurations
- Backup Apple Developer certificates and keys
