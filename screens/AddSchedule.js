// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Platform,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { useNavigation } from "@react-navigation/native";
// import { database } from "../config/firebase";
// import {
//   collection,
//   addDoc,
//   Timestamp,
//   query,
//   getDocs,
// } from "firebase/firestore";
// import { Ionicons } from "@expo/vector-icons";

// const AddSchedule = () => {
//   const navigation = useNavigation();
//   const [course, setCourse] = useState("");
//   const [start, setStart] = useState(null);
//   const [end, setEnd] = useState(null);
//   const [location, setLocation] = useState("");
//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);
//   const [pickingTimeFor, setPickingTimeFor] = useState(null);

//   const addSchedule = async () => {
//     const startTime = new Date(start);
//     const endTime = new Date(end);

//     const startTimestamp = Timestamp.fromDate(startTime);
//     const endTimestamp = Timestamp.fromDate(endTime);

//     const schedulesCollection = collection(database, "schedules");

//     try {
//       const querySnapshot = await getDocs(query(schedulesCollection));

//       let conflictFound = false;
//       querySnapshot.forEach((doc) => {
//         const schedule = doc.data();
//         const scheduleStart = schedule.start.toDate();
//         const scheduleEnd = schedule.end.toDate();
//         conflictFound = startTime < scheduleEnd && endTime > scheduleStart
//       });

//       if (conflictFound ) {
//         Alert.alert("There is already a schedule during this time.");
//       } else if(course !== "" || start !== null || end !== null || location !== "") {
//         const newSchedule = {
//           id: Date.now().toString(),
//           course,
//           start: startTimestamp,
//           end: endTimestamp,
//           location,
//           participants: [],
//         };
//         await addDoc(schedulesCollection, newSchedule);
//         navigation.goBack();
//       } else {
//         Alert.alert("Error", "All fields must be completed.")
//       }
//     } catch (error) {
//       console.error("Error adding schedule: ", error);
//     }
//   };

//   const handleDateTimeChange = (event, selectedDate) => {
//     if (event.type === "dismissed") {
//       setShowStartPicker(false);
//       setShowEndPicker(false);
//       return;
//     }

//     if (pickingTimeFor === "start") {
//       if (!start) {
//         setStart(selectedDate);
//         setShowStartPicker(true);
//       } else {
//         setStart(selectedDate);
//         setShowStartPicker(false);
//       }
//     } else if (pickingTimeFor === "end") {
//       if (!end) {
//         setEnd(selectedDate);
//         setShowEndPicker(true);
//       } else {
//         setEnd(selectedDate);
//         setShowEndPicker(false);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Add Schedule</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Course"
//         value={course}
//         onChangeText={setCourse}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Location"
//         value={location}
//         onChangeText={setLocation}
//       />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => {
//           setShowStartPicker(true);
//           setPickingTimeFor("start");
//           setStart("");
//         }}
//       >
//         <View style={styles.buttonContent}>
//           <Ionicons name="time-outline" size={24} color="white" />
//           <Text style={styles.buttonText}>
//             Start Time{" "}
//             {start
//               ? `${start.toLocaleDateString()} ${start.toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}`
//               : ""}
//           </Text>
//         </View>
//       </TouchableOpacity>
//       {showStartPicker && (
//         <DateTimePicker
//           value={start ? new Date(start) : new Date()}
//           mode={"datetime"}
//           is24Hour={true}
//           display="default"
//           minimumDate={Date.now()}
//           onChange={handleDateTimeChange}
//         />
//       )}

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => {
//           setShowEndPicker(true);
//           setPickingTimeFor("end");
//           setEnd("");
//         }}
//       >
//         <View style={styles.buttonContent}>
//           <Ionicons name="time-outline" size={24} color="white" />
//           <Text style={styles.buttonText}>
//             End Time{" "}
//             {end
//               ? `${end.toLocaleDateString()} ${end.toLocaleTimeString([], {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}`
//               : ""}
//           </Text>
//         </View>
//       </TouchableOpacity>

//       {showEndPicker && (
//         <DateTimePicker
//           value={end ? new Date(end) : new Date()}
//           mode={Platform.OS == "ios" ? "datetime" : end ? "time" : "date"}
//           is24Hour={true}
//           display="default"
//           minimumDate={Date.now()}
//           onChange={handleDateTimeChange}
//         />
//       )}

//       <TouchableOpacity style={styles.addButton} onPress={addSchedule}>
//         <Text style={styles.addButtonText}>Add Schedule</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f0f4f8", // Softer background color
//     justifyContent: "center",
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#7383f3",
//     alignSelf: "center",
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: "#fff", // White background for inputs
//     height: 55,
//     marginBottom: 20,
//     fontSize: 16,
//     borderRadius: 10,
//     padding: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   button: {
//     backgroundColor: "#7383f3", // Primary color for buttons
//     height: 55,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   buttonContent: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 18,
//     marginLeft: 10,
//   },
//   addButton: {
//     backgroundColor: "#4CAF50", // Green for the add button
//     height: 55,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   addButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 18,
//   },
// });

// export default AddSchedule;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import { database } from "../config/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  getDocs,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const AddSchedule = () => {
  const navigation = useNavigation();
  const [course, setCourse] = useState("");
  const [location, setLocation] = useState("");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const toggleStartPicker = () => {
    setStartPickerVisible(!isStartPickerVisible);
  };

  const toggleEndPicker = () => {
    setEndPickerVisible(!isEndPickerVisible);
  };

  const handleConfirmStart = (date) => {
    setStart(date);
    toggleStartPicker();
  };

  const handleConfirmEnd = (date) => {
    setEnd(date);
    toggleEndPicker();
  };

  const addSchedule = async () => {
    if (!course || !start || !end || !location) {
      Alert.alert("Error", "All fields must be completed.");
      return;
    }

    const startTimestamp = Timestamp.fromDate(start);
    const endTimestamp = Timestamp.fromDate(end);
    const schedulesCollection = collection(database, "schedules");

    try {
      const querySnapshot = await getDocs(query(schedulesCollection));
      let conflictFound = false;

      querySnapshot.forEach((doc) => {
        const schedule = doc.data();
        const scheduleStart = schedule.start.toDate();
        const scheduleEnd = schedule.end.toDate();
        if (start < scheduleEnd && end > scheduleStart) {
          conflictFound = true;
        }
      });

      if (conflictFound) {
        Alert.alert("Conflict", "There is already a schedule during this time.");
      } else {
        const newSchedule = {
          course,
          start: startTimestamp,
          end: endTimestamp,
          location,
          participants: [],
        };
        await addDoc(schedulesCollection, newSchedule);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error adding schedule: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Schedule</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Course"
        value={course}
        onChangeText={setCourse}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Location"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.button} onPress={toggleStartPicker}>
        <View style={styles.buttonContent}>
          <Ionicons name="time-outline" size={24} color="white" />
          <Text style={styles.buttonText}>
            Start Time: {start ? start.toLocaleString() : "Select Start Time"}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={toggleEndPicker}>
        <View style={styles.buttonContent}>
          <Ionicons name="time-outline" size={24} color="white" />
          <Text style={styles.buttonText}>
            End Time: {end ? end.toLocaleString() : "Select End Time"}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={addSchedule}>
        <Text style={styles.addButtonText}>Add Schedule</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="datetime"
        date={start || new Date()}
        onConfirm={handleConfirmStart}
        onCancel={toggleStartPicker}
        minimumDate={new Date()}
      />

      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="datetime"
        date={end || new Date()}
        onConfirm={handleConfirmEnd}
        onCancel={toggleEndPicker}
        minimumDate={new Date()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7383f3",
    alignSelf: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    height: 55,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  button: {
    backgroundColor: "#7383f3",
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default AddSchedule;
