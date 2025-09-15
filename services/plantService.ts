import { collection, addDoc, doc, getDoc, updateDoc, deleteDoc, query, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Plant } from "@/types/Plant";

// Reference to the "plants" collection
export const plantsRef = collection(db, "plants");

// CREATE a new plant
export const createPlant = async (plant: Plant & { userId?: string }) => {
  const docRef = await addDoc(plantsRef, {
    ...plant,
    createdAt: new Date(),
  });
  return { id: docRef.id, ...plant };
};

// READ a single plant by ID
export const getPlantById = async (id: string): Promise<Plant | null> => {
  const docRef = doc(db, "plants", id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Plant;
  }
  return null;
};

// READ all plants
export const getAllPlants = async (): Promise<Plant[]> => {
  const q = query(plantsRef);
  const snapshot = await getDocs(q);
  const plants: Plant[] = [];
  snapshot.forEach((docSnap) => {
    plants.push({ id: docSnap.id, ...docSnap.data() } as Plant);
  });
  return plants;
};

// UPDATE a plant
export const updatePlant = async (id: string, plant: Partial<Plant>) => {
  const docRef = doc(db, "plants", id);
  await updateDoc(docRef, {
    ...plant,
    updatedAt: new Date(),
  });
};

// DELETE a plant
export const deletePlant = async (id: string) => {
  const docRef = doc(db, "plants", id);
  await deleteDoc(docRef);
};
