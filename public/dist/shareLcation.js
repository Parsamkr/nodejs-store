function sendLocation(useFallback = false) {
  if (!navigator.geolocation) {
    alert(
      "Geolocation is not supported by this browser. Please use a modern browser or enable location services."
    );
    return;
  }

  // Show loading state
  const locationButton = document.getElementById("sendLocationButton");
  if (!locationButton) return;

  const originalContent = locationButton.innerHTML;
  locationButton.disabled = true;
  locationButton.style.opacity = "0.6";
  locationButton.innerHTML = "⏳";

  // Use less strict options if this is a fallback attempt
  const geolocationOptions = useFallback
    ? {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 600000, // Accept cached location up to 10 minutes old
      }
    : {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude: lat, longitude: lng } = position.coords;

      // Send location in special format that will be detected and rendered as a map
      // Format: LOCATION:lat,lng for easy parsing
      const locationMessage = `LOCATION:${lat},${lng}`;

      // Get chat variables from window (set by script.js)
      const currentNamespace = window.currentNamespace;
      const currentRoom = window.currentRoom;
      const username = window.chatUsername;
      const userId = window.chatUserId;

      if (!currentNamespace || !currentRoom) {
        alert("Please select a room first.");
        locationButton.disabled = false;
        locationButton.style.opacity = "1";
        locationButton.innerHTML = originalContent;
        return;
      }

      if (!username || !userId) {
        alert("You must be logged in to send location.");
        locationButton.disabled = false;
        locationButton.style.opacity = "1";
        locationButton.innerHTML = originalContent;
        return;
      }

      // Send location via socket
      if (window.socket && typeof window.socket.emit === "function") {
        window.socket.emit("sendMessage", {
          endpoint: currentNamespace,
          roomName: currentRoom,
          message: locationMessage,
          username: username,
          userId: userId,
        });
      }

      // Reset button
      locationButton.disabled = false;
      locationButton.style.opacity = "1";
      locationButton.innerHTML = originalContent;
    },
    (error) => {
      console.error("Geolocation error:", error);
      let errorMessage = "Failed to get your location.";
      let shouldRetry = false;

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage =
            "Location permission denied.\n\nPlease:\n1. Check your browser's location permissions\n2. Allow location access for this site\n3. Make sure location services are enabled on your device";
          break;
        case error.POSITION_UNAVAILABLE:
          if (!useFallback) {
            // Try again with fallback options
            shouldRetry = true;
            errorMessage =
              "Trying to get your location with less strict settings...";
          } else {
            errorMessage =
              "Location information unavailable.\n\nPossible causes:\n1. GPS/Location services are disabled on your device\n2. You're in an area with poor GPS signal\n3. Your device can't determine its location\n\nPlease enable location services or check your device settings.";
          }
          break;
        case error.TIMEOUT:
          if (!useFallback) {
            // Try again with fallback options (longer timeout)
            shouldRetry = true;
            errorMessage =
              "Location request taking longer than expected. Retrying...";
          } else {
            errorMessage =
              "Location request timed out.\n\nPlease:\n1. Check your internet connection\n2. Enable location services\n3. Move to an area with better GPS signal";
          }
          break;
        default:
          errorMessage =
            "An unknown error occurred while getting your location.\n\nPlease check:\n1. Your device's location settings\n2. Browser permissions\n3. Try again in a moment";
      }

      // Reset button
      locationButton.disabled = false;
      locationButton.style.opacity = "1";
      locationButton.innerHTML = originalContent;

      if (shouldRetry) {
        // Show retry message and try again with fallback options
        console.log(errorMessage);
        setTimeout(() => {
          sendLocation(true); // Retry with fallback options
        }, 500);
      } else {
        alert(errorMessage);
      }
    },
    geolocationOptions
  );
}

// Wait for DOM to be ready before adding event listener
function setupLocationButton() {
  const locationButton = document.getElementById("sendLocationButton");
  if (locationButton) {
    // Remove existing listener if any (to avoid duplicates)
    locationButton.removeEventListener("click", sendLocation);
    locationButton.addEventListener("click", sendLocation);
    return true;
  }
  return false;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // Try immediately
    if (!setupLocationButton()) {
      // If button doesn't exist yet (chat not initialized), try again after a delay
      setTimeout(() => {
        setupLocationButton();
      }, 500);
    }
  });
} else {
  // DOM already loaded
  if (!setupLocationButton()) {
    // If button doesn't exist yet, try again after a delay
    setTimeout(() => {
      setupLocationButton();
    }, 500);
  }
}

// Expose setup function for script.js to call after chat initialization
window.setupLocationButton = setupLocationButton;
