import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

const BACKGROUND_FETCH_TASK = "background-fetch-task";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    
  console.log("Background fetch running...");

  
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

export async function registerBackgroundFetch() {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    if (
      status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
      status === BackgroundFetch.BackgroundFetchStatus.Denied
      
    ) {
      console.log("Background fetch is disabled");
      return;
    }

    const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    console.log("📡 Background Task Registered:", isTaskRegistered);
    if (!isTaskRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 10, // Run every 5 minutes
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("Background fetch task registered");
    }
  } catch (error) {
    console.error("Error registering background fetch:", error);
  }
}
