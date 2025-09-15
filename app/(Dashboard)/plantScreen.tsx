import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { onSnapshot } from "firebase/firestore";
import { useLoader } from "@/context/LoaderContext";
import { plantsRef, deletePlant } from "@/services/plantService";
import { Plant } from "@/types/Plant";
import PlantForm from "@/components/plantForm";

const PlantListScreen = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    "all" | "indoor" | "outdoor" | "both"
  >("all");

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);

  const { showLoader, hideLoader } = useLoader();

  // real-time load
  useEffect(() => {
    showLoader();
    const unsub = onSnapshot(
      plantsRef,
      (snap) => {
        const all = snap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Plant)
        );
        setPlants(all);
        setFilteredPlants(all);
        hideLoader();
      },
      (err) => {
        console.log("Error:", err);
        hideLoader();
      }
    );
    return () => unsub();
  }, []);

  // filter handler
  useEffect(() => {
    let data = plants;

    if (activeCategory !== "all") {
      data = data.filter((p) => p.category?.toLowerCase() === activeCategory);
    }

    if (searchText.trim() !== "") {
      data = data.filter((p) =>
        p.plantName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredPlants(data);
  }, [plants, searchText, activeCategory]);

  const handleDelete = async (id: string) => {
    try {
      showLoader();
      await deletePlant(id);
    } catch (err) {
      console.log("Delete error", err);
    } finally {
      hideLoader();
    }
  };

  const handleEdit = (plant: Plant) => {
    setEditingPlant(plant);
    setIsFormVisible(true);
  };

  const handleAdd = () => {
    setEditingPlant(null); 
    setIsFormVisible(true);
  };

  const renderPlantCard = ({ item }: { item: Plant }) => (
    <View
      style={{
        flex: 1,
        margin: 6,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 12,
        }}
        resizeMode="contain"
      />

      <Text
        style={{
          fontSize: 13,
          fontWeight: "bold",
          color: "#065f46",
          marginTop: 8,
          marginBottom: 8,
        }}
      >
        {item.plantName}
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <TouchableOpacity
          style={{ marginRight: 12 }}
          onPress={() => handleEdit(item)}
        >
          <Feather name="edit-2" size={20} color="#fbbf24" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id!)}>
          <Feather name="trash-2" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f0fdf4", paddingHorizontal: 12 }}>
      {/* Fixed Top Section */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 30,
          marginBottom: 16,
          color: "#065f46",
        }}
      >
        Search Plants
      </Text>

      {/* Search Bar */}
      <TextInput
        placeholder="Search by name..."
        placeholderTextColor="#6b7280"
        value={searchText}
        onChangeText={setSearchText}
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 12,
          fontSize: 16,
          marginBottom: 12,
        }}
      />

      {/* Category Filter */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 12,
        }}
      >
        {["all", "indoor", "outdoor", "herbal"].map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat as any)}
            style={{
              backgroundColor:
                activeCategory === cat ? "#10b981" : "#e5e7eb",
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: activeCategory === cat ? "#fff" : "#374151",
                fontWeight: "600",
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scrollable Plant Grid */}
      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => item.id!}
        renderItem={renderPlantCard}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Floating Button (Fixed Bottom Right) */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: "#10b981",
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          elevation: 5,
        }}
        onPress={handleAdd}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal: Reusable for Add + Edit */}
      <PlantForm
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        editingPlant={editingPlant}
      />
    </View>
  );
};

export default PlantListScreen;
