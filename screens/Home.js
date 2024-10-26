import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../colors";
import Toast from "react-native-toast-message";
import { auth } from "../config/firebase";
import { Entypo } from "@expo/vector-icons";

/* 
TODO 
  - update schedule on the home page
*/


const Home = () => {
  const navigation = useNavigation();
  const profilePic = auth.currentUser?.photoURL || undefined;

  const schedulesDict = {
    Monday: [
      { time: "08:00 - 10:00", course: "Anal. données & Int. art.", professor: "RIGGIO", location: "1303" },
      { time: "10:15 - 12:15", course: "Anal. données & Int. art.", professor: "RIGGIO", location: "1303" },
      { time: "13:15 - 15:15", course: "ERP: Approche th. & prat", professor: "VANNEROM", location: "2106" },
      { time: "15:30 - 17:30", course: "Projet ERP", professor: "VANNEROM", location: "2106" }
    ],
    Tuesday: [
      { time: "08:00 - 10:00", course: "Anal. données & Int. art.", professor: "RIGGIO", location: "1303" },
      { time: "10:15 - 12:15", course: "Anal. données & Int. art.", professor: "RIGGIO", location: "1303" },
      { time: "13:15 - 15:15", course: "Projets", professor: "LEMNAI SCHUERMANS TEMERBEK", location: "2106" },
      { time: "15:30 - 17:30", course: "Projets", professor: "LEMNAI SCHUERMANS TEMERBEK", location: "2503" }
    ],
    Wednesday: [],
    Thursday: [
      { time: "08:00 - 10:00", course: "Programmation Web IV", professor: "MEDOL", location: "Teams" },
      { time: "13:15 - 15:15", course: "Dév. IV: Plateforme.net", professor: "MEDOL", location: "Teams" }
    ],
    Friday: [
      { time: "08:00 - 10:00", course: "Programmation V: JAVA", professor: "ARKTOUT", location: "2106" },
      { time: "10:15 - 12:15", course: "Com. prof. rech. emploi", professor: "FLAMENT", location: "1105" },
      { time: "13:15 - 15:15", course: "English for IT Projects", professor: "TEMERBEK", location: "2503" },
      { time: "15:30 - 17:30", course: "IT Trends", professor: "BARRY", location: "2106" }
    ],
    Saturday: [
      { time: "08:00 - 10:00", course: "Dév. Mobile", professor: "TEST PROF", location: "Lab 1" },
      { time: "10:15 - 12:14", course: "Test Automation", professor: "TEST PROF", location: "Lab 2" },
      { time: "13:15 - 15:15", course: "Cloud Computing", professor: "TEST PROF", location: "Lab 3" },
      { time: "15:30 - 17:30", course: "Data Science", professor: "TEST PROF", location: "Lab 4" }
    ],
    Sunday: [
      { time: "08:00 - 10:00", course: "Machine Learning", professor: "TEST PROF", location: "Lab 5" },
      { time: "10:15 - 12:15", course: "Blockchain", professor: "TEST PROF", location: "Lab 6" },
      { time: "13:15 - 15:15", course: "Cybersecurity", professor: "TEST PROF", location: "Lab 7" },
      { time: "15:30 - 17:30", course: "AI Ethics", professor: "TEST PROF", location: "Lab 8" }
    ]
  };

  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [nextSchedule, setNextSchedule] = useState(null);
  const [remainingSchedules, setRemainingSchedules] = useState([]);

  const goToChat = () => {
    if (!currentSchedule) {
      const nextStartTime = nextSchedule
        ? new Date(nextSchedule.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : null;
      Alert.alert(
        "No schedule found",
        `Please try again at ${nextStartTime} `
      )
      return;
    }

    navigation.navigate("Chat", {
      recipientCourseName: currentSchedule.course,
      recipientLocation: currentSchedule.location,
      recipientEndTime: currentSchedule.end.getTime(),
      recipientSchedulesId: currentSchedule.id,
    });
  };

  const toggleScheduleInfos = (schedule) => {
    Alert.alert(
      "Schedule Infos",
      `Course Name: ${schedule.course}\nLocation: ${schedule.location}\nStart Time: ${new Date(schedule.start).toLocaleString()}\nEnd Time: ${new Date(schedule.end).toLocaleString()}\nProf: ${schedule.professor}`,
      [{ text: "OK" }]
    );
  };

  useLayoutEffect(() => {
    const now = new Date();
    const currentDay = now.toLocaleString("en-US", { weekday: "long" });
    const todaySchedules = schedulesDict[currentDay] || [];

    if (!todaySchedules.length) {
      setCurrentSchedule(null);
      setNextSchedule(null);
      setRemainingSchedules([]);
      return;
    }

    const fetchedSchedules = todaySchedules.map((timeSlot, index) => {
      const { time, course, professor, location } = timeSlot;
      const [startTime, endTime] = time.split(" - ");

      const now = new Date();
      const start = new Date(now);
      const [startHour, startMinute] = startTime.match(/\d+/g).map(Number);
      const startPeriod = startTime.includes("PM") && startHour !== 12 ? 12 : 0;
      start.setHours(startHour + startPeriod, startMinute, 0);

      const end = new Date(now);
      const [endHour, endMinute] = endTime.match(/\d+/g).map(Number);
      const endPeriod = endTime.includes("PM") && endHour !== 12 ? 12 : 0;
      end.setHours(endHour + endPeriod, endMinute, 0);

      return {
        id: `${currentDay}-${index}`,
        course,
        professor,
        location,
        start,
        end,
      };
    });

    const currentSchedule = fetchedSchedules.find(
      (schedule) => schedule.start <= now && schedule.end >= now
    );
    const nextSchedule = fetchedSchedules.find(
      (schedule) => schedule.start > now
    );
    const remainingSchedules = fetchedSchedules.filter(
      (schedule) => schedule.start > now && schedule.id !== nextSchedule?.id
    );

    setCurrentSchedule(currentSchedule || null);
    setNextSchedule(nextSchedule || null);
    setRemainingSchedules(remainingSchedules);
  }, []);

  useEffect(() => {
    let timeoutId;
    if (nextSchedule) {
      const now = new Date();
      const timeUntilNext = nextSchedule.start - now;
      if (timeUntilNext > 0) {
        timeoutId = setTimeout(() => {
          setCurrentSchedule(nextSchedule);
          setRemainingSchedules((prev) => {
            const [first, ...rest] = prev;
            setNextSchedule(first || null);
            return rest;
          });
        }, timeUntilNext);
      }
    }
    return () => clearTimeout(timeoutId);
  }, [nextSchedule, remainingSchedules]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate("Profile")}>
          <Image source={{ uri: profilePic }} style={styles.profilePicture} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Toast />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {(!schedulesDict[new Date().toLocaleString("en-US", { weekday: "long" })] ||
          schedulesDict[new Date().toLocaleString("en-US", { weekday: "long" })].length === 0) ? (
          <Text style={styles.noSchedulesText}>No classes today</Text>
        ) : (
          <>
            {currentSchedule && (
              <View style={styles.currentSection}>
                <Text style={styles.sectionTitle}>Currently Class</Text>
                <View style={[styles.scheduleItem, styles.currentScheduleItem]}>
                  <TouchableOpacity onPress={() => toggleScheduleInfos(currentSchedule)}>
                    <Text style={styles.scheduleText}>Course: {currentSchedule.course}</Text>
                    <Text style={styles.scheduleText}>
                      Start: {new Date(currentSchedule.start).toLocaleString()}
                    </Text>
                    <Text style={styles.scheduleText}>
                      End: {new Date(currentSchedule.end).toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {nextSchedule && (
              <View style={styles.nextSection}>
                <TouchableOpacity onPress={() => toggleScheduleInfos(nextSchedule)}>
                  <Text style={styles.sectionTitle}>Next Class</Text>
                  <View style={[styles.scheduleItem, styles.nextScheduleItem]}>
                    <Text style={styles.scheduleText}>Course: {nextSchedule.course}</Text>
                    <Text style={styles.scheduleText}>
                      Start: {new Date(nextSchedule.start).toLocaleString()}
                    </Text>
                    <Text style={styles.scheduleText}>
                      End: {new Date(nextSchedule.end).toLocaleString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {!!remainingSchedules.length && (
              <View style={styles.upcomingSection}>
                <Text style={styles.sectionTitle}>Upcoming Classes</Text>
                {remainingSchedules.map((schedule) => (
                  <View key={schedule.id} style={styles.scheduleItem}>
                    <TouchableOpacity onPress={() => toggleScheduleInfos(schedule)}>
                      <Text style={styles.scheduleText}>Course: {schedule.course}</Text>
                      <Text style={styles.scheduleText}>
                        Start: {new Date(schedule.start).toLocaleString()}
                      </Text>
                      <Text style={styles.scheduleText}>
                        End: {new Date(schedule.end).toLocaleString()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
      <View style={styles.chatButtonContainer}>
        <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
          <Entypo name="chat" size={24} color={colors.lightGray} />
        </TouchableOpacity>
      </View>
    </View>
  );

}

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
  profilePicture: {
    width: 40,
    height: 40,
    marginRight: 15,
    borderRadius: 25,
    borderColor: colors.gray,
    borderWidth: 1,
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
});
