import {
  Modal,
  Alert,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput as RNTextInput,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { createPlant, updatePlant } from "@/services/plantService";
import { useAuth } from "@/context/AuthContext";
import { useLoader } from "@/context/LoaderContext";
import { Plant, PlantCategory } from "@/types/Plant";

interface PlantFormProps {
  visible: boolean;
  onClose: () => void;
  editingPlant?: Plant | null;
}

interface RadioButtonOption {
  label: string;
  value: PlantCategory;
}

const RadioButton: React.FC<{
  options: RadioButtonOption[];
  selectedValue: PlantCategory;
  onSelect: (value: PlantCategory) => void;
}> = ({ options, selectedValue, onSelect }) => {
  return (
    <View style={{ paddingVertical: 8 }}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: isSelected ? "#10b981" : "#d1d5db",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              {isSelected && (
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#10b981" }} />
              )}
            </View>
            <Text style={{ fontSize: 16, color: "#374151", flex: 1 }}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const PlantForm: React.FC<PlantFormProps> = ({ visible, onClose, editingPlant }) => {
  const isNew = !editingPlant;

  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PlantCategory>("indoor");
  const [image, setImage] = useState<string | null>(null);

  const { user } = useAuth();
  const { showLoader, hideLoader } = useLoader();

  const options: RadioButtonOption[] = [
    { label: "Indoor", value: "indoor" },
    { label: "Outdoor", value: "outdoor" },
    { label: "Both", value: "both" },
  ];

  // Reset or prefill form whenever modal opens/closes
  useEffect(() => {
    if (visible) {
      if (editingPlant) {
        setPlantName(editingPlant.plantName);
        setDescription(editingPlant.description);
        setCategory(editingPlant.category);
        setImage(editingPlant.image || null);
      } else {
        setPlantName("");
        setDescription("");
        setCategory("indoor");
        setImage(null);
      }
    }
  }, [visible, editingPlant]);

  // Image picker with crop
  const pickImageFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const takePhotoWithCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const pickImage = () => {
    const buttons: { text: string; onPress?: () => void; style?: "cancel" | "destructive" }[] = [
      { text: "Camera", onPress: takePhotoWithCamera },
      { text: "Gallery", onPress: pickImageFromLibrary },
    ];

    if (image) buttons.push({ text: "Remove", onPress: () => setImage(null), style: "destructive" });
    buttons.push({ text: "Cancel", style: "cancel" });

    Alert.alert("Upload Image", "Choose Image Source", buttons, { cancelable: true });
  };

  const handleSubmit = async () => {
    if (!plantName.trim()) {
      Alert.alert("Validation", "Plant Name is required");
      return;
    }

    try {
      showLoader();
      if (isNew) {
        await createPlant({ plantName, description, category, image: image || "", userId: user?.uid });
      } else {
        await updatePlant(editingPlant.id!, { plantName, description, category, image: image || "" });
      }
      onClose();
    } catch (err) {
      console.log("Error saving plant", err);
      Alert.alert("Error", `Failed to ${isNew ? "create" : "update"} plant`);
    } finally {
      hideLoader();
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
        <View style={{ backgroundColor: "#fff", margin: 20, borderRadius: 20, padding: 20, width: "90%" }}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={{ alignSelf: "flex-end" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>X</Text>
          </TouchableOpacity>

          {/* Image Picker */}
          <View style={{ alignItems: "center", marginVertical: 15 }}>
            <View style={{ position: "relative" }}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 180, height: 180, borderRadius: 90 }}
                />
              ) : (
                <LinearGradient
                  colors={["#e6fcc7", "#05966950"]}
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: 90,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons name="local-florist" size={100} color="#027d66" opacity={0.2} />
                </LinearGradient>
              )}

              {/* Camera/Edit Button */}
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 45,
                  height: 45,
                  borderRadius: 22.5,
                  backgroundColor: "#10b981",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "#fff",
                }}
              >
                <MaterialIcons
                  name={image ? "edit" : "photo-camera"}
                  size={22}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Plant Name */}
          <LinearGradient colors={["#e6fcc7", "#05966950"]} style={{ padding: 12, borderRadius: 50, marginBottom: 10 }}>
            <RNTextInput
              placeholder="Plant Name"
              value={plantName}
              onChangeText={setPlantName}
              placeholderTextColor="#96ad76"
            />
          </LinearGradient>

          {/* Description */}
          <LinearGradient colors={["#e6fcc7", "#05966950"]} style={{ padding: 12, borderRadius: 50, marginBottom: 10 }}>
            <RNTextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor="#96ad76"
            />
          </LinearGradient>

          {/* Category */}
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 4 }}>Plant Category</Text>
            <RadioButton options={options} selectedValue={category} onSelect={setCategory} />
          </View>

          {/* Submit */}
          <TouchableOpacity onPress={handleSubmit} style={{ marginTop: 10 }}>
            <LinearGradient colors={["#10b981", "#059669"]} style={{ paddingVertical: 12, borderRadius: 8, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
                {isNew ? "Add Plant" : "Update Plant"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PlantForm;
