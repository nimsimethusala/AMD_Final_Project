import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLoader } from "@/context/LoaderContext";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db } from "@/firebase"; 
import { getApp } from "firebase/app";

export interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  profileImage?: string;
}

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: "",
  });

  const { showLoader, hideLoader } = useLoader();
  const auth = getAuth(getApp());
  const storage = getStorage(getApp());

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUser = async () => {
      try {
        showLoader();
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data() as User;
          setUser(userData);
          setEditForm({
            username: userData.username,
            email: userData.email,
            password: "",
            profileImage: userData.profileImage || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        hideLoader();
      }
    };

    fetchUser();
  }, []);

  // Request permission helper
  const requestPermission = async (type: "camera" | "gallery") => {
    if (type === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    }
  };

  // Handle Image Pick
  const handlePickImage = async () => {
    const options = ["Take Photo", "Choose from Gallery"];
    if (editForm.profileImage) options.push("Remove Photo");
    options.push("Cancel");

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
          destructiveButtonIndex: editForm.profileImage ? 2 : undefined,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) await pickFromCamera();
          else if (buttonIndex === 1) await pickFromGallery();
          else if (buttonIndex === 2 && editForm.profileImage) removeImage();
        }
      );
    } else {
      // Android simple Alert fallback
      Alert.alert(
        "Profile Image",
        "Choose an option",
        [
          { text: "Take Photo", onPress: pickFromCamera },
          { text: "Choose from Gallery", onPress: pickFromGallery },
          ...(editForm.profileImage ? [{ text: "Remove Photo", onPress: removeImage }] : []),
          { text: "Cancel", style: "cancel" },
        ],
        { cancelable: true }
      );
    }
  };

  const pickFromCamera = async () => {
    const granted = await requestPermission("camera");
    if (!granted) {
      Alert.alert("Permission required", "Please allow camera access");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setEditForm({ ...editForm, profileImage: result.assets[0].uri });
  };

  const pickFromGallery = async () => {
    const granted = await requestPermission("gallery");
    if (!granted) {
      Alert.alert("Permission required", "Please allow gallery access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) setEditForm({ ...editForm, profileImage: result.assets[0].uri });
  };

  const removeImage = () => {
    setEditForm({ ...editForm, profileImage: "" });
  };

  // Handle Save Profile
  const handleSave = async () => {
    if (!editForm.username.trim() || !editForm.email.trim()) {
      Alert.alert("Error", "Username and email are required");
      return;
    }

    try {
      showLoader();
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      let imageUrl = user?.profileImage || "";

      // If new image added
      if (editForm.profileImage && editForm.profileImage !== user?.profileImage) {
        const response = await fetch(editForm.profileImage);
        const blob = await response.blob();
        const imageRef = ref(storage, `profileImages/${currentUser.uid}.jpg`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      // If image removed
      if (!editForm.profileImage && user?.profileImage) {
        const imageRef = ref(storage, `profileImages/${currentUser.uid}.jpg`);
        await deleteObject(imageRef).catch(() => null);
        imageUrl = "";
      }

      // Update Auth email & password
      if (editForm.email !== user?.email) await updateEmail(currentUser, editForm.email);
      if (editForm.password) await updatePassword(currentUser, editForm.password);

      const updatedUser: User = {
        id: currentUser.uid,
        username: editForm.username,
        email: editForm.email,
        profileImage: imageUrl,
      };

      await setDoc(doc(db, "users", currentUser.uid), updatedUser);

      setUser(updatedUser);
      setIsEditing(false);
      setEditForm({ ...editForm, password: "" });
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      hideLoader();
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditForm({
        username: user.username,
        email: user.email,
        password: "",
        profileImage: user.profileImage || "",
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await auth.signOut();
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f0fdf4" }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={{
          paddingTop: 50,
          paddingBottom: 30,
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#065f46",
            marginBottom: 8,
          }}
        >
          Profile
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Manage your account information
        </Text>
      </View>

      {/* User Details Card */}
      <View
        style={{
          marginHorizontal: 20,
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          marginBottom: 20,
        }}
      >

      {/* Profile Image */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <View style={{ position: "relative" }}>
          {editForm.profileImage ? (
            <Image
              source={{ uri: editForm.profileImage }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <View
              style={{
                backgroundColor: "#10b98120",
                borderRadius: 50,
                width: 100,
                height: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons name="person" size={50} color="#10b981" />
            </View>
          )}

          {/* Camera / Edit Button */}
            <TouchableOpacity
              onPress={handlePickImage}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#10b981",
                borderRadius: 25,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#fff",
              }}
            >
            <Feather
              name={editForm.profileImage ? "edit-2" : "camera"}
              size={20}
              color="#fff"
            />
            </TouchableOpacity>
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#065f46",
            marginTop: 12,
          }}
        >
        {user.username}
        </Text>
      </View>


        {/* Form Fields */}
        <View style={{ marginBottom: 20 }}>
          {/* Username */}
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#065f46", marginBottom: 8 }}>
            Username
          </Text>
          {!isEditing ? (
            <View style={{ backgroundColor: "#f9fafb", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: "#374151" }}>{user.username}</Text>
            </View>
          ) : (
            <TextInput
              value={editForm.username}
              onChangeText={(text) => setEditForm({ ...editForm, username: text })}
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                borderWidth: 1,
                borderColor: "#d1d5db",
                marginBottom: 16,
              }}
              placeholder="Enter username"
            />
          )}

          {/* Email */}
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#065f46", marginBottom: 8 }}>
            Email
          </Text>
          {!isEditing ? (
            <View style={{ backgroundColor: "#f9fafb", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: "#374151" }}>{user.email}</Text>
            </View>
          ) : (
            <TextInput
              value={editForm.email}
              onChangeText={(text) => setEditForm({ ...editForm, email: text })}
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                borderWidth: 1,
                borderColor: "#d1d5db",
                marginBottom: 16,
              }}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}

          {/* Password */}
          {isEditing && (
            <>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#065f46", marginBottom: 8 }}>
                New Password (optional)
              </Text>
              <TextInput
                value={editForm.password}
                onChangeText={(text) => setEditForm({ ...editForm, password: text })}
                style={{
                  backgroundColor: "#f9fafb",
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  marginBottom: 16,
                }}
                placeholder="Enter new password (leave empty to keep current)"
                secureTextEntry
              />
            </>
          )}
        </View>

        {/* Action Buttons */}
        {!isEditing ? (
          <TouchableOpacity
            style={{
              backgroundColor: "#10b981",
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => setIsEditing(true)}
          >
            <Feather name="edit-2" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#e5e7eb",
                borderRadius: 12,
                padding: 16,
                flex: 1,
                alignItems: "center",
              }}
              onPress={handleCancel}
            >
              <Text style={{ color: "#374151", fontSize: 16, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#10b981",
                borderRadius: 12,
                padding: 16,
                flex: 1,
                alignItems: "center",
              }}
              onPress={handleSave}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Logout */}
      {!isEditing && (
        <View style={{ paddingHorizontal: 20, marginBottom: 40 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "#ef4444",
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={18} color="#ef4444" style={{ marginRight: 8 }} />
            <Text style={{ color: "#ef4444", fontSize: 16, fontWeight: "600" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default ProfileScreen;