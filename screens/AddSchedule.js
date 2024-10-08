import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database } from '../config/firebase';
import { collection, addDoc, Timestamp, query, getDocs } from 'firebase/firestore';

const AddSchedule = () => {
  const navigation = useNavigation();
  const [course, setCourse] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [location, setLocation] = useState('');

  const addSchedule = async () => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    
    // Convertir les dates en Timestamp Firestore
    const startTimestamp = Timestamp.fromDate(startTime);
    const endTimestamp = Timestamp.fromDate(endTime);
    
    // Récupérer la collection des schedules
    const schedulesCollection = collection(database, 'schedules');

    try {
      // Récupérer tous les créneaux
      const querySnapshot = await getDocs(query(schedulesCollection));

      let conflictFound = false;
      querySnapshot.forEach((doc) => {
        const schedule = doc.data();
        const scheduleStart = schedule.start.toDate();
        const scheduleEnd = schedule.end.toDate();

        if (
          (startTime < scheduleEnd && endTime > scheduleStart)
        ) {
          conflictFound = true;
        }
      });

      if (conflictFound) {
        console.log('Schedule conflict: There is already a schedule during this time.');
        Alert.alert('There is already a schedule during this time.');
      } else {
        const newSchedule = {
          id: Date.now().toString(),
          course,
          start: startTimestamp,
          end: endTimestamp,
          location,
          participants: []
        };

        await addDoc(schedulesCollection, newSchedule);
        console.log('Schedule added successfully!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error adding schedule: ', error);
    }
  };

  return (
    <View>
      <Text>Add a Schedule</Text>
      <TextInput placeholder="Course" value={course} onChangeText={setCourse} />
      <TextInput placeholder="Start (YYYY-MM-DD HH:mm)" value={start} onChangeText={setStart} />
      <TextInput placeholder="End (YYYY-MM-DD HH:mm)" value={end} onChangeText={setEnd} />
      <TextInput placeholder="Location" value={location} onChangeText={setLocation} />
      <Button title="Add Schedule" onPress={addSchedule} />
    </View>
  );
};

export default AddSchedule;
