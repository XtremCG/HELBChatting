import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../colors";
import { Entypo } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { auth } from "../config/firebase"; // Gardez cette importation pour l'authentification si nécessaire.

const Home = () => {
  const navigation = useNavigation();
  const profilePic = auth.currentUser?.photoURL || undefined;

  const schedulesDict = {
    "Monday": ["8:00 AM - 10:00 AM", "10:15 AM - 12:15 PM", "1:15 PM - 3:15 PM", "3:30 PM - 5:30 PM"],
    "Tuesday": ["8:00 AM - 10:00 AM", "10:15 AM - 12:15 PM", "1:15 PM - 3:15 PM", "3:30 PM - 5:30 PM"],
    "Wednesday": ["8:00 AM - 10:00 AM", "10:15 AM - 12:15 PM", "1:15 PM - 3:15 PM", "3:30 PM - 5:30 PM"],
    "Thursday": ["8:00 AM - 10:00 AM", "10:15 AM - 12:15 PM", "1:15 PM - 3:15 PM", "3:30 PM - 5:30 PM"],
    "Friday": ["8:00 AM - 10:00 AM", "10:15 AM - 12:15 PM", "1:15 PM - 3:15 PM", "3:30 PM - 5:30 PM"],
  };

  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [nextSchedule, setNextSchedule] = useState(null);
  const [remainingSchedules, setRemainingSchedules] = useState([]);

  const goToChat = () => {
    if (currentSchedule === null) {
      Toast.show({
        text1: "No schedule found",
        type: "error",
      });
      return;
    }

    navigation.navigate("Chat", {
      recipientCourseName: currentSchedule.course,
      recipientLocation: currentSchedule.location,
      recipientEndTime: currentSchedule.end.getTime(),
      recipientSchedulesId: currentSchedule.id,
    });
  };

  useLayoutEffect(() => {
    const now = new Date();
    const currentDay = now.toLocaleString('en-US', { weekday: 'long' }); // Get the current day (e.g., "Monday")
    const todaySchedules = schedulesDict[currentDay] || [];
    
    // Assuming each schedule lasts 2 hours and starts at the specified time
    const fetchedSchedules = todaySchedules.map((timeSlot, index) => {
      const [startTime, endTime] = timeSlot.split(" - ");
      const start = new Date(now);
      start.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]), 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 2); // Assuming each slot is 2 hours long

      return {
        id: `${currentDay}-${index}`, // Unique ID based on day and index
        course: `Course ${index + 1}`, // Example course name
        start,
        end,
        location: `Room ${index + 1}`, // Example location
      };
    });

    const current = fetchedSchedules.find(
      (schedule) => schedule.start <= now && schedule.end >= now
    );
    const next = fetchedSchedules.find(
      (schedule) => schedule.start > now && (!current || schedule.id !== current.id)
    );
    const remaining = fetchedSchedules.filter(
      (schedule) => schedule.id !== (next ? next.id : null) && schedule.id !== (current ? current.id : null)
    );

    setCurrentSchedule(current || null);
    setNextSchedule(next || null);
    setRemainingSchedules(remaining);
  }, []);

  useEffect(() => {
    let timeoutId;

    if (nextSchedule) {
      const now = new Date();
      const timeUntilNext = nextSchedule.start - now;

      if (timeUntilNext > 0) {
        timeoutId = setTimeout(() => {
          setCurrentSchedule(nextSchedule);

          setRemainingSchedules((prevSchedules) => {
            const [firstSchedule, ...restSchedules] = prevSchedules;
            setNextSchedule(firstSchedule || null);
            return restSchedules;
          });
        }, timeUntilNext);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [nextSchedule, remainingSchedules]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate("AddSchedule")}>
          <FontAwesome
            name="plus"
            size={24}
            color={colors.gray}
            style={{ marginLeft: 15 }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: profilePic }}
            style={styles.profilePicture}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Toast />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentSchedule ? (
          <View style={styles.currentSection}>
            <Text style={styles.sectionTitle}>Currently Class</Text>
            <View style={[styles.scheduleItem, styles.currentScheduleItem]}>
              <Text style={styles.scheduleText}>Course: {currentSchedule.course}</Text>
              <Text style={styles.scheduleText}>
                Start: {new Date(currentSchedule.start).toLocaleString()}
              </Text>
              <Text style={styles.scheduleText}>
                End: {new Date(currentSchedule.end).toLocaleString()}
              </Text>
              <Text style={styles.scheduleText}>Location: {currentSchedule.location}</Text>
            </View>
          </View>
        ) : null}

        {nextSchedule ? (
          <View style={styles.nextSection}>
            <Text style={styles.sectionTitle}>Next Class</Text>
            <View style={[styles.scheduleItem, styles.nextScheduleItem]}>
              <Text style={styles.scheduleText}>Course: {nextSchedule.course}</Text>
              <Text style={styles.scheduleText}>
                Start: {new Date(nextSchedule.start).toLocaleString()}
              </Text>
              <Text style={styles.scheduleText}>
                End: {new Date(nextSchedule.end).toLocaleString()}
              </Text>
              <Text style={styles.scheduleText}>Location: {nextSchedule.location}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noSchedulesText}>No next class available</Text>
        )}

        {remainingSchedules.length > 0 && (
          <View style={styles.upcomingSection}>
            <Text style={styles.sectionTitle}>Upcoming Classes</Text>
            {remainingSchedules.map((schedule) => (
              <View key={schedule.id} style={styles.scheduleItem}>
                <Text style={styles.scheduleText}>Course: {schedule.course}</Text>
                <Text style={styles.scheduleText}>
                  Start: {new Date(schedule.start).toLocaleString()}
                </Text>
                <Text style={styles.scheduleText}>
                  End: {new Date(schedule.end).toLocaleString()}
                </Text>
                <Text style={styles.scheduleText}>Location: {schedule.location}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.chatButtonContainer}>
        <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
          <Entypo name="chat" size={24} color={colors.lightGray} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  currentSection: {
    marginBottom: 20,
  },
  nextSection: {
    marginBottom: 20,
  },
  upcomingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.primary,
  },
  scheduleItem: {
    backgroundColor: colors.lightGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  currentScheduleItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  nextScheduleItem: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  scheduleText: {
    fontSize: 16,
    color: "#000",
  },
  noSchedulesText: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  chatButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  chatButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  profilePicture: {
    width: 40,
    height: 40,
    marginRight: 15,
    borderRadius: 25,
    borderColor: colors.gray,
    borderWidth: 1,
  },
});