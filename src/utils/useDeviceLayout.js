import { useWindowDimensions, PixelRatio } from 'react-native';

export function useDevice() {
  const { width, height } = useWindowDimensions();

  const shortestSide = Math.min(width, height);
  const longestSide = Math.max(width, height);
  const aspectRatio = longestSide / shortestSide;

  /* -------------------------------------------------
     DEVICE DETECTION (size + aspect ratio)
  -------------------------------------------------- */
  const isSmallPhone = shortestSide < 360;

  const isPhone =
    shortestSide >= 360 &&
    shortestSide < 600 &&
    aspectRatio < 2.1;

  // 📱 Fold COVER screen (very tall)
  const isFolded =
    shortestSide >= 360 &&
    shortestSide < 600 &&
    aspectRatio >= 2.1;

  // 📖 Fold OPEN screen (almost square)
  const isUnfolded =
    shortestSide >= 600 &&
    shortestSide < 900 &&
    aspectRatio >= 1.2 &&
    aspectRatio <= 1.8;

  // 💻 Tablet
  const isTablet =
    shortestSide >= 900 ||
    (shortestSide >= 840 && aspectRatio < 1.4);

  const deviceType =
    isTablet
      ? 'tablet'
      : isUnfolded
      ? 'unfolded'
      : isFolded
      ? 'folded'
      : isSmallPhone
      ? 'small-phone'
      : 'phone';

  /* -------------------------------------------------
     ORIENTATION
  -------------------------------------------------- */
  const isLandscape = width > height;
  const isPortrait = !isLandscape;

  /* -------------------------------------------------
     GLOBAL UI TOKENS (Splash → Logout)
  -------------------------------------------------- */
  const ui = {
    /* base padding */
    padding:
      deviceType === 'tablet'
        ? 40
        : deviceType === 'unfolded'
        ? 32
        : 20,

    /* border radius */
    radius:
      deviceType === 'tablet'
        ? 44
        : deviceType === 'unfolded'
        ? 36
        : deviceType === 'folded'
        ? 30
        : 26,

    /* spacing scale */
    spacing: {
      sm: deviceType === 'tablet' ? 12 : 8,
      md: deviceType === 'tablet' ? 20 : 16,
      lg: deviceType === 'tablet' ? 40 : 24,
      xl: deviceType === 'tablet' ? 48 : 32,
    },

    /* typography */
    font: {
      h1: PixelRatio.roundToNearestPixel(
        deviceType === 'tablet'
          ? 36
          : deviceType === 'unfolded'
          ? 32
          : 26
      ),
      h2: PixelRatio.roundToNearestPixel(
        deviceType === 'tablet'
          ? 28
          : deviceType === 'unfolded'
          ? 24
          : 20
      ),
      body: PixelRatio.roundToNearestPixel(
        deviceType === 'tablet' ? 18 : 15
      ),
      small: PixelRatio.roundToNearestPixel(13),
    },

    /* buttons */
    button: {
      height:
        deviceType === 'tablet'
          ? 62
          : deviceType === 'unfolded'
          ? 50
          : 50,
      fontSize: deviceType === 'tablet' ? 18 : 16,
      radius: deviceType === 'tablet' ? 18 : 14,
    },

    /* images */
    image: {
      hero:
        deviceType === 'tablet'
          ? 320
          : deviceType === 'unfolded'
          ? 260
          : 200,
      avatar:
        deviceType === 'tablet'
          ? 160
          : deviceType === 'unfolded'
          ? 120
          : 80,
    },

    /* layout */
    columns:
      deviceType === 'tablet' || deviceType === 'unfolded' ? 2 : 1,
  };

  return {
    width,
    height,
    shortestSide,
    aspectRatio,

    deviceType,

    isSmallPhone,
    isPhone,
    isFolded,
    isUnfolded,
    isTablet,

    isLandscape,
    isPortrait,

    ui,
  };
}




// import { useWindowDimensions ,PixelRatio} from 'react-native';

// export function useDevice() {
//   const { width, height } = useWindowDimensions();
//   const shortestSide = Math.min(width, height);
//   console.log('shortestSide',shortestSide);
  
// //   let device = "phone";

// //   if (shortestSide < 360) {
// //     device = "small-phone";
// //   } else if (shortestSide >= 360 && shortestSide < 480) {
// //     device = "folded"; // fold cover screen
// //   } else if (shortestSide >= 480 && shortestSide < 600) {
// //     device = "big-phone";
// //   } else if (shortestSide >= 600 && shortestSide < 840) {
// //     device = "unfolded"; // fold open
// //   } else {
// //     device = "tablet";
// //   }
//   const isSmallPhone = shortestSide < 360;
//   const isPhone = shortestSide >= 360 && shortestSide < 600;
//   const isFolded = shortestSide >= 600 && shortestSide < 840;
//   const isTablet = shortestSide >= 840;

//   const deviceType = isTablet
//     ? 'tablet'
//     : isFolded
//     ? 'fold'
//     : isSmallPhone
//     ? 'small'
//     : 'phone';

//   /** 🎯 Global scaling tokens */
//   const ui = {
//     padding: isTablet ? 40 : isFolded ? 32 : 20,
//     radius: isTablet ? 44 : isFolded ? 32 : 30,
// // radius:
// //       device === "tablet"
// //         ? 44
// //         : device === "unfolded"
// //         ? 40
// //         : device === "folded"
// //         ? 32
// //         : device === "small-phone"
// //         ? 26
// //         : 30,
//     font: {
//       h1: isTablet ? 34 : isFolded ? 30 : 26,
//       h2: isTablet ? 26 : isFolded ? 22 : 18,
//       body: isTablet ? 18 : 15,
//       small: 13,
//     },

//     button: {
//       height: isTablet ? 64 : 54,
//       text: isTablet ? 18 : 16,
//     },

//     image: {
//       hero: isTablet ? 320 : isFolded ? 260 : 200,
//       avatar: isTablet ? 160 : 120,
//     },
//   };

//   return {
//     width,
//     height,
//     shortestSide,

//     isSmallPhone,
//     isPhone,
//     isFolded,
//     isTablet,

//     deviceType,
//     ui,
//   };
// }

