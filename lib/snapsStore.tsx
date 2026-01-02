import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { ImageSourcePropType } from 'react-native';

export interface Snap {
  id: string;
  imageUri: string | ImageSourcePropType;
  title: string;
  description?: string;
  timestamp: Date;
  points: number;
  category: 'recycling' | 'reduction' | 'composting' | 'food' | 'transport';
}

interface SnapsContextType {
  snaps: Snap[];
  addSnap: (snap: Snap) => void;
  deleteSnap: (snapId: string) => void;
  getSnapById: (snapId: string) => Snap | undefined;
}

// Mock snap data - these represent actual user snaps
const INITIAL_SNAPS: Snap[] = [
  {
    id: 'snap-1',
    imageUri: require('../assets/images/snap1.jpeg'),
    title: 'Plastic Bottle Recycling',
    description: 'Successfully recycled 5 plastic bottles at the local recycling center.',
    timestamp: new Date(2026, 0, 2, 10, 30),
    points: 50,
    category: 'recycling',
  },
  {
    id: 'snap-2',
    imageUri: require('../assets/images/snap2.jpeg'),
    title: 'Reusable Shopping Bag',
    description: 'Used a reusable bag instead of plastic bags while shopping.',
    timestamp: new Date(2026, 0, 1, 14, 15),
    points: 30,
    category: 'reduction',
  },
  {
    id: 'snap-3',
    imageUri: require('../assets/images/snap3.jpeg'),
    title: 'Composting Pile',
    description: 'Started composting food waste in the garden.',
    timestamp: new Date(2025, 11, 31, 9, 45),
    points: 40,
    category: 'composting',
  },
  {
    id: 'snap-4',
    imageUri: require('../assets/images/snap4.jpeg'),
    title: 'Plant-Based Lunch',
    description: 'Enjoyed a delicious plant-based meal for lunch.',
    timestamp: new Date(2025, 11, 30, 12, 0),
    points: 25,
    category: 'food',
  },
  {
    id: 'snap-5',
    imageUri: require('../assets/images/snap5.jpeg'),
    title: 'Public Transport',
    description: 'Took the bus instead of driving a personal vehicle.',
    timestamp: new Date(2025, 11, 29, 8, 30),
    points: 35,
    category: 'transport',
  },
  {
    id: 'snap-6',
    imageUri: require('../assets/images/snap6.jpeg'),
    title: 'Paper Recycling',
    description: 'Recycled a stack of old newspapers and magazines.',
    timestamp: new Date(2025, 11, 28, 15, 20),
    points: 20,
    category: 'recycling',
  },
  {
    id: 'snap-7',
    imageUri: require('../assets/images/snap7.jpeg'),
    title: 'Zero Waste Shopping',
    description: 'Bought items without any packaging at the farmers market.',
    timestamp: new Date(2025, 11, 27, 11, 0),
    points: 45,
    category: 'reduction',
  },
  {
    id: 'snap-8',
    imageUri: require('../assets/images/snap1.jpeg'),
    title: 'Vegan Breakfast',
    description: 'Started the day with a nutritious plant-based breakfast.',
    timestamp: new Date(2025, 11, 26, 8, 0),
    points: 28,
    category: 'food',
  },
];

const SnapsContext = createContext<SnapsContextType | undefined>(undefined);

export const SnapsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snaps, setSnaps] = useState<Snap[]>(INITIAL_SNAPS);

  const addSnap = useCallback((snap: Snap) => {
    setSnaps((prevSnaps) => [snap, ...prevSnaps]);
  }, []);

  const deleteSnap = useCallback((snapId: string) => {
    setSnaps((prevSnaps) => prevSnaps.filter((snap) => snap.id !== snapId));
  }, []);

  const getSnapById = useCallback((snapId: string) => {
    return snaps.find((snap) => snap.id === snapId);
  }, [snaps]);

  const value = useMemo(
    () => ({ snaps, addSnap, deleteSnap, getSnapById }),
    [snaps, addSnap, deleteSnap, getSnapById]
  );

  return (
    <SnapsContext.Provider value={value}>
      {children}
    </SnapsContext.Provider>
  );
};

export const useSnapsStore = () => {
  const context = useContext(SnapsContext);
  if (!context) {
    throw new Error('useSnapsStore must be used within a SnapsProvider');
  }
  return context;
};
