import { auth, db } from "@/firebase";
import { User } from "../types/User";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser as firebaseDeleteUser,
  updatePassword
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

// ======= SIGN UP =======
export const signUp = async (username: string, email: string, password: string): Promise<string> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // add user to Firestore (don't store plain password!)
  await setDoc(doc(db, "users", user.uid), {
    username,
    email,
    createdAt: serverTimestamp()
  });

  return user.uid;
};

// ======= LOGIN =======
export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user.uid;
};

// ======= READ USER =======
export const getUserById = async (userId: string): Promise<User | null> => {
  const snapshot = await getDoc(doc(db, "users", userId));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as User;
};

// ======= UPDATE USER =======
export const updateUser = async (userId: string, data: Partial<User>) => {
  const { id, password, ...userData } = data; // never store password in Firestore
  await updateDoc(doc(db, "users", userId), userData);

  // optionally update password in Auth
  if (password) {
    const user = auth.currentUser;
    if (user) await updatePassword(user, password);
  }
};

// ======= DELETE USER =======
export const deleteUser = async (userId: string) => {
  // delete from Auth
  const user = auth.currentUser;
  if (user && user.uid === userId) await firebaseDeleteUser(user);

  // delete Firestore document
  await deleteDoc(doc(db, "users", userId));
};