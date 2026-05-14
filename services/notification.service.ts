import { db } from "@/firebase.config";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { doc, updateDoc } from "firebase/firestore";
import { Platform } from "react-native";

// High-level configuration for notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Register for push notifications and get the device token
 */
export async function registerForPushNotificationsAsync(userId: string) {
  let token;

  if (Platform.OS === "web") {
    console.log("Push notifications are not supported on web natively.");
    return null;
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }

    // For Expo, we use the projectId from app.json
    // In many setups, it can be passed or inferred
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Push Token:", token);

    // Update user profile in Firestore with the token
    try {
      await updateDoc(doc(db, "users", userId), {
        pushToken: token,
      });
    } catch (error) {
      console.error("Error updating push token in Firestore:", error);
    }
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#10B981",
    });
  }

  return token;
}

/**
 * Send a local notification (Used for immediate feedback or testing)
 */
export async function sendLocalNotification(
  title: string,
  body: string,
  data: any = {},
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // null means immediate
  });
}

/**
 * Handle notification received while the app is in foreground
 */
export function addNotificationListeners(
  onReceived: (notification: Notifications.Notification) => void,
  onResponse: (response: Notifications.NotificationResponse) => void,
) {
  const notificationListener =
    Notifications.addNotificationReceivedListener(onReceived);
  const responseListener =
    Notifications.addNotificationResponseReceivedListener(onResponse);

  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
}

/**
 * Schedule booking reminder notifications
 * Schedules:
 *   - 1 day before  → "Your match is tomorrow!"
 *   - 2 hours before → "Your slot starts in 2 hours!"
 */
export async function scheduleBookingReminders(
  bookingId: string,
  turfName: string,
  bookingDate: string,    // YYYY-MM-DD
  slotTime: string,       // "HH:mm" of first slot e.g. "18:00"
): Promise<void> {
  if (Platform.OS === "web") return; // Web doesn't support scheduled notifications

  try {
    // Parse the match date & time into a JS Date
    const [year, month, day] = bookingDate.split("-").map(Number);
    const [hour, minute] = slotTime.split(":").map(Number);
    const matchTime = new Date(year, month - 1, day, hour, minute, 0);

    const oneDayBefore  = new Date(matchTime.getTime() - 24 * 60 * 60 * 1000);
    const twoHoursBefore = new Date(matchTime.getTime() - 2  * 60 * 60 * 1000);
    const now = new Date();

    // 1 day before reminder
    if (oneDayBefore > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🏟️ Match Tomorrow!",
          body: `Your slot at ${turfName} is tomorrow at ${slotTime}. Get ready!`,
          data: { bookingId, screen: "bookings" },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: oneDayBefore,
        },
      });
    }

    // 2 hours before reminder
    if (twoHoursBefore > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "⚽ Kick-off in 2 Hours!",
          body: `Your slot at ${turfName} starts at ${slotTime}. Don't be late!`,
          data: { bookingId, screen: "bookings" },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: twoHoursBefore,
        },
      });
    }

    console.log(`✅ Reminders scheduled for booking ${bookingId} at ${turfName}`);
  } catch (error) {
    console.error("Error scheduling booking reminders:", error);
  }
}
