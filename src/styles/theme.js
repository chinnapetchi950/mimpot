
import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
export const colors = {
    primary: '#3EA7DE',
    text: '#222',
    background: '#fff',
    dark: '#111827',
    text: '#1F2937',
    muted: '#6B7280',
    card: '#FFFFFF',
    bg: '#F7F8FA',
  }
export const theme = {
 
  spacing: {
    xs:8, sm:12, md:16, lg:24
  },
  radii: {
    small:8, medium:12, large:20
  },
  typography: {
    h1:28, h2:22, body:16
  }
};

// export default theme;



export const common = StyleSheet.create({
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowStart: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.background,
    borderRadius: 15,
    padding: wp("4%"),
    marginTop: hp("1.5%"),
  },
  title: {
    fontSize: wp("4.5%"),
    fontWeight: "700",
  },
});

// export default {
//   colors: {
//     primary: '#2AA8F2', // change to your brand color
//     dark: '#111827',
//     text: '#1F2937',
//     muted: '#6B7280',
//     card: '#FFFFFF',
//     bg: '#F7F8FA',
//   },
//   spacing: {
//     xs: 6, sm: 12, md: 16, lg: 24
//   }
// };

