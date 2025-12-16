import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import CustomHeader from "../components/CustomHeader";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../styles/theme";
import strings from "../localization/en";


const ManageSubscriptionScreen = ({navigation}) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const availablePlans = [
    { id: 1, name: "Yearly", price: 295.95 },
  ];

  const features = [
    "Lorem ipsum dolor seat amet",
    "Lorem ipsum dolor seat amet",
    "Lorem ipsum dolor seat amet",
    "Lorem ipsum dolor seat amet",
  ];

  return (
<SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
    <CustomHeader
  title={strings.subscription.manage_subscription}
rightComponent={<TouchableOpacity></TouchableOpacity>}
  leftComponent={
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={26} color="#000" />
    </TouchableOpacity>
   
  }
/>    
    <ScrollView style={{ flex: 1, padding: 20,marginTop:20 }}>
      {/* CURRENT PLAN */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{strings.subscription.current_plan}</Text>
        <Text style={styles.cancel}>{strings.subscription.cancel}</Text>

        <View style={styles.row}>
          <Icon name="star" size={26} color="#2B9DE0" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.planName}>{strings.subscription.monthly}</Text>
            <Text style={styles.price}>$ 29.95 <Text style={{ color: "green" }}>{strings.subscription.active}</Text></Text>
          </View>
        </View>

        <TouchableOpacity style={styles.renewBtn}>
          <Text style={styles.renewText}>{strings.subscription.renew}</Text>
        </TouchableOpacity>
      </View>

      {/* AVAILABLE PLANS */}
      <Text style={styles.section}>{strings.subscription.available_plan}</Text>

      {availablePlans.map((plan) => (
        <TouchableOpacity
          key={plan.id}
          style={styles.planCard}
          onPress={() => setSelectedPlan(plan.id)}
        >
          <View style={styles.planHeader}>
            <Icon name="star" size={22} />
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.price}>{`$${plan.price}`}</Text>
          </View>
<View style={{borderWidth:1,    borderColor: "#D4D4D8",marginTop:20
}}></View>
          {/* FEATURES */}
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Icon name="check-circle" size={20} color="#2B9DE0" />
              <Text style={styles.feature}>{f}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.purchaseBtn}>
            <Text style={styles.purchaseText}>{strings.subscription.purchase}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
    </SafeAreaView>

  );
};

const styles = {
  card: {
    borderWidth: 1.5,
    padding: 15,
    borderRadius: 16,
    borderColor: "#D4D4D8",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 17, fontWeight: "700" },
  cancel: { position: "absolute", right: 15, top: 15, color: "#777" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  planName: { fontSize: 18, fontWeight: "600" },
  price: { fontSize: 15, marginTop: 2 },
  renewBtn: {
    backgroundColor: "#2B9DE0",
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  renewText: { color: "#fff", fontWeight: "700" },

  section: { fontSize: 18, fontWeight: "700", marginBottom: 10,marginTop:20 },

  planCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    marginBottom: 30,
    elevation: 2,
  },

  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    
  },

  featureRow: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  feature: { fontSize: 14, marginLeft: 10 },

  purchaseBtn: {
    backgroundColor: "#2B9DE0",
    padding: 12,
    borderRadius: 28,
    alignItems: "center",
    marginTop: 20,
  },
  purchaseText: { color: "#fff", fontSize: 17, fontWeight: "700" },
};

export default ManageSubscriptionScreen;
