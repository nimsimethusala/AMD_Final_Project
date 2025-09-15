// services/authService.ts
import { auth, db, storage } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// ========== SIGN UP ==========
export const signUp = async (
  username: string,
  email: string,
  password: string
): Promise<string> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Add user to Firestore
  await setDoc(doc(db, "users", user.uid), {
    username,
    email,
    image: null,
    createdAt: serverTimestamp(),
  });

  return user.uid;
};

// ========== LOGIN ==========
export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user.uid;
};

// ========== LOGOUT ==========
export const logout = async () => {
  await signOut(auth);
};

// ========== GET USER ==========
export const getUser = async (uid: string) => {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};

// ========== UPDATE USER ==========
export const updateUser = async (
  uid: string,
  data: { username?: string; email?: string; image?: string | null }
) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });

  // If username or photo is updated, sync with Firebase Auth too
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: data.username || auth.currentUser.displayName || "",
      photoURL: data.image || auth.currentUser.photoURL || "",
    });
  }
};

// ========== DELETE USER ==========
export const deleteUserAccount = async (uid: string) => {
  // Delete Firestore user doc
  await deleteDoc(doc(db, "users", uid));

  // Delete Auth user
  if (auth.currentUser) {
    await deleteUser(auth.currentUser);
  }
};

// ========== UPLOAD PROFILE IMAGE ==========
export const uploadProfileImage = async (uid: string, file: Blob | Uint8Array | ArrayBuffer) => {
  const storageRef = ref(storage, `profileImages/${uid}.jpg`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  // Update Firestore user document with new image URL
  await updateUser(uid, { image: downloadURL });

  return downloadURL;
};

// ========== DELETE PROFILE IMAGE ==========
export const deleteProfileImage = async (uid: string) => {
  const storageRef = ref(storage, `profileImages/${uid}.jpg`);
  await deleteObject(storageRef).catch(() => {
    // ignore if no image found
  });

  // Remove image from Firestore user
  await updateUser(uid, { image: null });
};
