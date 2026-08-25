import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface LoginResult {
  success: boolean;
  role?: 'healthworker' | 'doctor' | 'admin';
  error?: string;
  uid?: string;
  email?: string;
}

/**
 * Signs in a user using Firebase Auth (email + password)
 * and fetches their role from the "Users" Firestore collection.
 */
export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch the user's role from Firestore collection "Users"
    const userDocRef = doc(db, 'Users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const role = userData.role;

      if (role === 'healthworker' || role === 'doctor' || role === 'admin') {
        return {
          success: true,
          role,
          uid: user.uid,
          email: user.email || email
        };
      } else {
        return {
          success: false,
          error: `User has an invalid or missing role: ${role}`
        };
      }
    } else {
      return {
        success: false,
        error: 'User profile not found in Firestore.'
      };
    }
  } catch (error: any) {
    console.error('Firebase Auth Error:', error);
    let errorMessage = 'Login failed. Please check your credentials.';
    if (
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/invalid-credential'
    ) {
      errorMessage = 'Invalid email or password.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address format.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Signs out the current user
 */
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};
